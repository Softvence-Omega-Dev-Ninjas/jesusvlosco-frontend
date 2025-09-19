import { useState, useEffect, useMemo } from "react";
import {
  HiOutlineBell,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineChevronUp,
  HiOutlinePencil,
  HiOutlineTrash,
} from "react-icons/hi";
import { RxCross2 } from "react-icons/rx";
import { CiCirclePlus } from "react-icons/ci";
import { useForm, Controller } from "react-hook-form";
import {
  useCreateShiftMutation,
  useGetAllShiftTemplatesQuery,
} from "@/store/api/admin/shift-sheduling/CreateShiftApi";
import {
  useDeleteShiftMutation,
  useGetProjectUsersWithShiftQuery,
} from "@/store/api/user/scheduling/schedulingApi";
import { useParams } from "react-router-dom";
import {
  generateWeekDatesForWeeklySchedule,
  formatDateRange,
  goToPreviousWeek,
  goToNextWeek,
  isSameDayInTimeZone,
} from "@/utils/dateUtils";
import Swal from "sweetalert2";
import GoogleMapsLocationPicker from "./GoogleMapsLocationPicker";
import { ShiftAPIData, ShiftFormData } from "@/types/shift";
import { validateShiftData } from "@/utils/validation";
import { DateTime } from "luxon";
import { userDefaultTimeZone } from "@/utils/dateUtils"; // you already had this helper
import { ProjectUser, UserShiftData } from "@/types/projectType";
import EmployeeAvailabilityCard from "./EmployeeAvailabilityCard";
import { isSameWeek } from "date-fns";

interface Template {
  id: string;
  templateTitle: string;
  startTime: string;
  endTime: string;
  location: string;
  locationLat: number;
  locationLng: number;
  job?: string;
  note?: string;
}

const WeeklyScheduleGrid = () => {
  const timeZone = userDefaultTimeZone();
  const {
    data: alltemplates,
    isLoading: isLoadingTemplates,
  } = useGetAllShiftTemplatesQuery({});

  const projectIdd = useParams().id;
  const {
    data: projectInformationNew,
    isLoading,
    refetch,
  } = useGetProjectUsersWithShiftQuery(projectIdd);

  const [deleteShift] = useDeleteShiftMutation();
  const thisProjectInformation = projectInformationNew?.data as
    | ProjectUser[]
    | undefined;

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("");

  // debounce effect (400ms)
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 400);
    return () => clearTimeout(t);
  }, [searchTerm]);

  // compute filtered list from latest API data + debounced term
  const filteredUserList = useMemo(() => {
    const list = thisProjectInformation || [];
    const term = (debouncedSearchTerm || "").trim().toLowerCase();
    if (!term) return list;

    return list.filter((pu) => {
      const u = pu.user;
      if (!u) return false;
      const fullName = `${u.firstName || ""} ${u.lastName || ""}`.trim();
      const candidates = [
        fullName,
        u.firstName || "",
        u.lastName || "",
        u.email || "",
        u.jobTitle || "",
        u.department || "",
        u.phone || "",
      ]
        .filter(Boolean)
        .map((s) => s.toLowerCase());

      // check if any candidate contains the term
      return candidates.some((c) => c.includes(term));
    });
  }, [thisProjectInformation, debouncedSearchTerm]);

  // State
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

  // API hooks
  const [createShift] = useCreateShiftMutation();
  const { id: projectId } = useParams();

  // Form management
  const { control, handleSubmit, setValue, getValues, reset } =
    useForm<ShiftFormData>({
      defaultValues: {
        currentUserId: "",
        currentProjectId: projectId || "",
        date: new Date().toISOString().split("T")[0],
        startTime: "",
        endTime: "",
        shiftTitle: "",
        job: "",
        location: "",
        locationLng: 0,
        locationLat: 0,
        locationCoordinates: null,
        note: "",
        allDay: false,
        userIds: [],
        taskIds: [],
        shiftStatus: "PUBLISHED",
        saveAsTemplate: false,
      },
    });

  // Use filtered user list in rendering
  const userList = filteredUserList;

  const templates = alltemplates?.data || [];

  console.log("Selected Template:", selectedTemplate);
  // Helpers using Luxon
  const toUTCISO = (dateIso: string, timeHHMM: string, isEndTime: boolean = false, startTimeHHMM?: string) => {
    // dateIso: "YYYY-MM-DD", timeHHMM: "HH:mm"
    // Interpret in user's timeZone, then convert to UTC ISO string
    let targetDate = dateIso;
    
    // If this is an end time and it's earlier than start time, add one day
    if (isEndTime && startTimeHHMM) {
      const [startHour, startMin] = startTimeHHMM.split(':').map(Number);
      const [endHour, endMin] = timeHHMM.split(':').map(Number);
      
      const startMinutes = startHour * 60 + startMin;
      const endMinutes = endHour * 60 + endMin;
      
      // If end time is earlier than start time, it's next day
      if (endMinutes <= startMinutes) {
        const nextDay = DateTime.fromISO(dateIso).plus({ days: 1 });
        targetDate = nextDay.toISODate() || dateIso;
      }
    }
    
    return DateTime.fromISO(`${targetDate}T${timeHHMM}`, { zone: timeZone })
      .toUTC()
      .toISO();
  };

  const startOfLocalDayToUTCISO = (dateIso: string) => {
    return DateTime.fromISO(`${dateIso}T00:00`, { zone: timeZone })
      .toUTC()
      .toISO();
  };

  const isoToLocalDate = (iso: string) =>
    DateTime.fromISO(iso).setZone(timeZone).toISODate(); // YYYY-MM-DD

  const isoToLocalTime = (iso: string) =>
    DateTime.fromISO(iso).setZone(timeZone).toFormat("HH:mm");

  const isoToLocalTimeShort = (iso: string) =>
    DateTime.fromISO(iso).setZone(timeZone).toFormat("h:mm a");

  // onSubmit: convert local inputs -> UTC ISO strings using Luxon
  const onSubmit = async (
    data: ShiftFormData,
    status: "PUBLISHED" | "DRAFT" | "TEMPLATE"
  ) => {
    try {
      console.log("Form data before API call:", data);

      const locationCoordinates = data.locationCoordinates;

      const apiData: ShiftAPIData = {
        currentUserId: data.userIds[0] || selectedUserId,
        currentProjectId: projectId || "",
        // date as UTC ISO representing start of that local day
        date: startOfLocalDayToUTCISO(data.date) || "",
        shiftStatus: status,
        startTime: toUTCISO(data.date, data.startTime, false) || "",
        endTime: toUTCISO(data.date, data.endTime, true, data.startTime) || "",
        shiftTitle: data.shiftTitle,
        allDay: data.allDay,
        job: data.job,
        userIds: data.userIds.length > 0 ? data.userIds : [selectedUserId],
        taskIds: data.taskIds,
        location: locationCoordinates?.address || data.location,
        locationLng: locationCoordinates?.longitude || data.locationLng,
        locationLat: locationCoordinates?.latitude || data.locationLat,
        note: data.note,
        saveAsTemplate: data.saveAsTemplate,
      };

      // Validate before API call
      const validation = validateShiftData(apiData);
      if (!validation.isValid) {
        Swal.fire({
          title: "Validation Error!",
          text: validation.message,
          icon: "error",
          confirmButtonText: "OK",
        });
        return;
      }

      const result = await createShift(apiData).unwrap();
      console.log("Shift created successfully:", result);

      Swal.fire({
        title: "Success!",
        text: `Shift ${status.toLowerCase()} successfully!`,
        icon: "success",
        confirmButtonText: "OK",
      });

      // Reset form and close modal
      reset();
      setIsModalOpen(false);
      refetch();
    } catch (error) {
      console.error("Error creating shift:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to create shift. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handlePublish = () => {
    const formData = getValues();
    onSubmit(formData, "PUBLISHED");
  };

  const handleCancel = () => {
    reset();
    setIsModalOpen(false);
  };

  // Edit existing shift: convert UTC -> local for form fields
  const handleEditShift = (shift: UserShiftData, userId: string) => {
    setSelectedUserId(userId);

    const shiftDateIso = isoToLocalDate(shift.startTime); // date based on startTime local
    const formattedStartTime = isoToLocalTime(shift.startTime); // HH:mm
    const formattedEndTime = isoToLocalTime(shift.endTime); // HH:mm

    setValue("userIds", [userId]);
    setValue("date", shiftDateIso || "");
    setValue("startTime", formattedStartTime);
    setValue("endTime", formattedEndTime);
    setValue("shiftTitle", shift.title);
    setValue("job", shift.job);
    setValue("location", shift.location);
    setValue("locationCoordinates", {
      address: shift.location,
      longitude: shift.lng,
      latitude: shift.lat,
    });
    setValue("locationLng", shift.lng);
    setValue("locationLat", shift.lat);
    setValue("note", shift.note);
    setValue("currentUserId", userId);
    setValue("currentProjectId", projectId || "");
    setValue("shiftStatus", shift.shiftStatus);
    setValue("allDay", shift.allDay);

    setIsModalOpen(true);
  };

  const handleDeleteShift = async (shiftid: string) => {
    const result = await Swal.fire({
      title: "Delete Shift?",
      text: `Are you sure you want to delete the shift? This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteShift(shiftid).unwrap();
      Swal.fire({
        title: "Deleted!",
        text: "The shift has been deleted successfully.",
        icon: "success",
        confirmButtonText: "OK",
      });
      refetch();
    } catch (error) {
      console.error("Error deleting shift:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to delete shift. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handleAddShift = (userId: string, date: Date | string) => {
    setSelectedUserId(userId);

    const inputDate =
      typeof date === "string" ? new Date(date) : (date as Date);
    const formattedDate = inputDate.toISOString().split("T")[0];

    setValue("userIds", [userId]);
    setValue("date", formattedDate);
    setValue("currentUserId", userId);
    setValue("currentProjectId", projectId || "");
    setIsModalOpen(true);
  };

  const days = generateWeekDatesForWeeklySchedule(currentDate);

  if (isLoading) {
    return (
      <section className="w-full mb-12 bg-gray-50 border border-gray-200 p-4 rounded-lg shadow-sm">
        <div className="flex items-center justify-center h-32">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-2"></div>
            <p className="text-gray-600">Loading shifts...</p>
          </div>
        </div>
      </section>
    );
  }

  if (projectInformationNew?.error) {
    console.error("Error fetching project data:", projectInformationNew.error);
    return (
      <section className="w-full mb-12 bg-red-50 border border-red-200 p-4 rounded-lg shadow-sm">
        <div className="text-center text-red-600">
          <p className="font-semibold">Error loading project data</p>
          <p className="text-sm">Please try refreshing the page</p>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full mb-12 bg-gray-50 border border-gray-200 p-4 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <div className="flex justify-between items-center gap-4 w-full">
          <div className="ml-4 mr-4 flex items-center gap-2">
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, email, job, dept or phone..."
              className="border border-gray-300 rounded-md px-3 py-2 text-sm w-80"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="text-sm text-gray-500 px-2 py-1 hover:bg-gray-100 rounded border border-gray-300"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-gray-800">
              Weekly Schedule
            </h3>
            <button
              onClick={() => setCurrentDate(goToPreviousWeek(currentDate))}
              className="p-1 rounded-md hover:bg-gray-200 transition-colors"
            >
              <HiOutlineChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <span className="text-sm text-gray-600 min-w-max">
              {formatDateRange(currentDate)}
            </span>
            <button
              onClick={() => setCurrentDate(goToNextWeek(currentDate))}
              className="p-1 rounded-md hover:bg-gray-200 transition-colors"
            >
              <HiOutlineChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button className="hidden text-sm border border-indigo-300 text-[rgba(78,83,177,1)] px-3 py-1.5 rounded-full hover:bg-indigo-50  items-center gap-1">
            Actions <HiOutlineChevronUp className="w-4 h-4" />
          </button>
          <button className="hidden text-sm border border-indigo-300 text-[rgba(78,83,177,1)] px-3 py-1.5 rounded-full hover:bg-indigo-50  items-center gap-1">
            Add <HiOutlineChevronUp className="w-4 h-4" />
          </button>
          <button className="hidden text-sm bg-[rgba(78,83,177,1)] text-white px-4 py-1.5 rounded-full  items-center gap-1 hover:bg-indigo-800">
            Publish <HiOutlineBell className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="min-w-max mt-6">
        {/* Header row with day names */}
        <div className="grid grid-cols-8 gap-2 text-sm font-medium text-[rgba(78,83,177,1)] mb-2">
          {/* User column header */}
          <div className="text-center whitespace-nowrap font-semibold">
            Employee
          </div>
          {/* Day columns */}
          {days.map((day, i) => (
            <div key={i} className="text-center whitespace-nowrap">
              {day.day} {day.date}
            </div>
          ))}
        </div>

        {/* Multiple rows - one for each user */}
        <div className="space-y-2">
          {userList.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 text-lg">
                No employees found in this project
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Add employees to the project to see their shifts
              </p>
            </div>
          ) : (
            userList.map((projectUserData: ProjectUser, rowIdx: number) => {
              const user = projectUserData.user;
              const userShifts = projectUserData.shifts || [];

              const shiftsOfCurrentWeek = userShifts.filter((shift) => {
                const shiftDate = new Date(shift.date);
                return isSameWeek(shiftDate, currentDate);
              });

              if (!user) return null;

              return (
                <div
                  key={rowIdx}
                  className="grid grid-cols-8 gap-2 bg-white rounded-lg p-3 border border-gray-200"
                >
                  {/* User column */}
                  <div className="flex items-center justify-center">
                    <EmployeeAvailabilityCard
                      emp={projectUserData}
                      shifts={shiftsOfCurrentWeek}
                    />
                  </div>

                  {/* Day columns */}
                  {days.map((day, colIdx) => {
                    // Find shifts for this user on this specific day (local time comparison)
                    const shiftsForDay = userShifts.filter(
                      (shift: UserShiftData) => {
                        try {
                          // Compare the local date of shift start with the local date of the cell
                          const isMatch = isSameDayInTimeZone(
                            shift.date,
                            day.fullDate
                          );
                          return isMatch;
                        } catch (err) {
                          console.warn(
                            "Failed to match shift date:",
                            err,
                            shift
                          );
                          return false;
                        }
                      }
                    );

                    const dayShift =
                      shiftsForDay.length > 0
                        ? shiftsForDay[shiftsForDay.length - 1]
                        : null;

                    return (
                      <div key={`${rowIdx}-${colIdx}`} className="space-y-2">
                        {dayShift ? (
                          <div
                            className={`group min-h-[100px] lg:w-40 lg:h-32.5 rounded-md p-2 transition-all relative flex flex-col justify-center items-center gap-2 cursor-pointer ${
                              dayShift.shiftStatus === "PUBLISHED"
                                ? "bg-indigo-200 border border-[rgba(78,83,177,1)] hover:bg-indigo-300"
                                : "bg-white border-2 border-indigo-400 hover:bg-indigo-50"
                            }`}
                          >
                            <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-1">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditShift(dayShift, user.id);
                                }}
                                className="bg-blue-500 hover:bg-blue-600 text-white p-1.5 rounded text-xs transition-colors shadow-sm"
                                title="Edit Shift"
                              >
                                <HiOutlinePencil className="w-3 h-3" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteShift(dayShift.id);
                                }}
                                className="bg-red-500 hover:bg-red-600 text-white p-1.5 rounded text-xs transition-colors shadow-sm"
                                title="Delete Shift"
                              >
                                <HiOutlineTrash className="w-3 h-3" />
                              </button>
                            </div>

                            <p className="text-xs mt-2 px-1 font-medium text-indigo-800 mb-2 text-center">
                              {isoToLocalTimeShort(dayShift.startTime)} -{" "}
                              {isoToLocalTimeShort(dayShift.endTime)}
                            </p>

                            <p className="text-sm text-center font-semibold text-purple-800">
                              {dayShift.title}
                            </p>

                            <p className="text-xs text-center text-gray-600">
                              {dayShift.location}
                            </p>
                          </div>
                        ) : (
                          <div className="min-h-[100px] lg:w-40 lg:h-32.5 rounded-md p-2 border border-dashed border-gray-300 bg-white flex items-center justify-center hover:border-gray-400 transition-colors cursor-pointer">
                            <CiCirclePlus
                              onClick={() =>
                                handleAddShift(user.id, day.fullDate)
                              }
                              className="text-2xl text-gray-400 hover:text-gray-600"
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Shift Scheduling Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Schedule Shift
              </h2>
              <button
                onClick={handleCancel}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                &times;
              </button>
            </div>

            {/* Shift Details Form */}
            <form
              onSubmit={handleSubmit((data) => onSubmit(data, "PUBLISHED"))}
            >
              <div className="space-y-4 text-sm">
                <div>
                  <label htmlFor="templete" className="font-medium">
                    Want to use template?
                  </label>
                  <select
                    value={selectedTemplate?.id || ""}
                    onChange={(e) => {
                      const templateId = e.target.value;
                      if (templateId) {
                        const template = templates.find((t: Template) => t.id === templateId);
                        setSelectedTemplate(template);
                        console.log("Selected Template:", template);
                        
                        // Auto-fill form with template data
                        if (template) {
                          setValue("shiftTitle", template.templateTitle || "");
                          setValue("job", template.job || "");
                          setValue("note", template.note || "");
                          setValue("location", template.location || "");
                          setValue("locationLat", template.locationLat || 0);
                          setValue("locationLng", template.locationLng || 0);
                          setValue("locationCoordinates", {
                            address: template.location || "",
                            latitude: template.locationLat || 0,
                            longitude: template.locationLng || 0,
                          });
                          
                          // Convert template times to local time format
                          if (template.startTime) {
                            const localStartTime = isoToLocalTime(template.startTime);
                            setValue("startTime", localStartTime);
                          }
                          if (template.endTime) {
                            const localEndTime = isoToLocalTime(template.endTime);
                            setValue("endTime", localEndTime);
                          }
                        }
                      } else {
                        setSelectedTemplate(null);
                      }
                    }}
                    className="border border-gray-300 px-3 py-2 rounded-md w-full mt-2 focus:ring-2 focus:ring-[#4E53B1] focus:border-transparent"
                  >
                    <option value="">
                      Choose Template
                    </option>
                    {
                      templates.length > 0 && !isLoadingTemplates  ? (
                        templates.map((template: Template) => (
                          <option key={template.id} value={template.id}>
                            {template.templateTitle}
                          </option>
                        ))
                      ) : (
                        <option value="" disabled>No templates available</option>
                      )
                    }
                  </select>
                  {selectedTemplate && (
                    <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md flex items-center justify-between gap-5">
                     <div>
                       <p className="text-sm font-medium text-blue-800">
                        Selected Template: {selectedTemplate.templateTitle}
                      </p>
                      <p className="text-xs text-blue-600 mt-1">
                        📍 {selectedTemplate.location} | 
                        🕐 {selectedTemplate.startTime && isoToLocalTimeShort(selectedTemplate.startTime)} - {selectedTemplate.endTime && isoToLocalTimeShort(selectedTemplate.endTime)}
                        {selectedTemplate.job && ` | 💼 ${selectedTemplate.job}`}
                      </p>
                     </div>
                     <button onClick={() => setSelectedTemplate(null)}><RxCross2 /></button>
                    </div>
                  )}
                </div>

                {/* Start and End Time */}
                <div className="flex gap-4 items-center justify-between">
                  <div className="flex flex-col justify-start gap-2">
                    <label className="font-medium">Date</label>
                    <Controller
                      name="date"
                      control={control}
                      render={({ field }) => (
                        <input
                          type="date"
                          {...field}
                          className="border border-gray-300 px-3 py-2 rounded-md"
                        />
                      )}
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col justify-start gap-2">
                      <label className="font-medium">Start</label>
                      <Controller
                        name="startTime"
                        control={control}
                        render={({ field }) => (
                          <input
                            type="time"
                            {...field}
                            className="border border-gray-300 px-3 py-2 rounded-md"
                          />
                        )}
                      />
                    </div>
                    <div className="flex flex-col justify-start gap-2">
                      <label className="font-medium">End</label>
                      <Controller
                        name="endTime"
                        control={control}
                        render={({ field }) => (
                          <input
                            type="time"
                            {...field}
                            className="border border-gray-300 px-3 py-2 rounded-md"
                          />
                        )}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>All Day</span>
                    <Controller
                      name="allDay"
                      control={control}
                      render={({ field }) => (
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={field.onChange}
                          className="accent-[rgba(78,83,177,1)] w-4 h-4"
                        />
                      )}
                    />
                  </div>
                </div>

                {/* Shift Title */}
                <Controller
                  name="shiftTitle"
                  control={control}
                  render={({ field }) => (
                    <input
                      type="text"
                      placeholder="Shift Title"
                      {...field}
                      className="w-full border border-gray-300 rounded-md p-3"
                    />
                  )}
                />

                {/* Job */}
                <Controller
                  name="job"
                  control={control}
                  render={({ field }) => (
                    <input
                      type="text"
                      placeholder="Job"
                      {...field}
                      className="w-full border border-gray-300 rounded-md p-3"
                    />
                  )}
                />

                {/* Location Picker */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <Controller
                    name="locationCoordinates"
                    control={control}
                    render={({ field }) => (
                      <GoogleMapsLocationPicker
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Click to select location on map"
                        className="w-full"
                        apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
                      />
                    )}
                  />
                </div>

                {/* Notes */}
                <Controller
                  name="note"
                  control={control}
                  render={({ field }) => (
                    <textarea
                      placeholder="Type Description"
                      {...field}
                      rows={3}
                      className="w-full border border-gray-300 rounded-md p-3"
                    />
                  )}
                />

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    className="bg-[rgba(78,83,177,1)] text-white px-6 py-2 rounded-lg text-sm hover:bg-indigo-800"
                    onClick={handlePublish}
                  >
                    Publish
                  </button>
                  <button
                    type="button"
                    className="text-red-500 border border-gray-300 px-6 py-2 rounded-lg font-semibold hover:bg-red-50"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default WeeklyScheduleGrid;
