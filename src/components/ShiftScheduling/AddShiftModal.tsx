import React, { useRef, useEffect } from "react";
import { X, ChevronDown } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGetAllProjectUserQuery } from "@/store/api/user/project/projectApi";
import { useCreateSchedulingRequestMutation } from "@/store/api/user/scheduling/schedulingApi";
import { toast } from "sonner";
import { toISODate } from "@/utils/formatDateToMDY";

interface AddShiftModalProps {
  onClose: () => void;
}

const schema = z.object({
  projectId: z.string().min(1, "Project is required"),
  startDate: z.string().min(1, "Start date is required"),
  startTime: z.string().min(1, "Start time is required"),
  endDate: z.string().min(1, "End date is required"),
  endTime: z.string().min(1, "End time is required"),
  managerNote: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

// const projects = [
//   "Metro Shopping Center",
//   "Downtown Office Complex",
//   "Riverside Mall",
//   "Corporate Plaza",
//   "Tech Hub Center",
// ];

const AddShiftModal: React.FC<AddShiftModalProps> = ({ onClose }) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      projectId: "",
      startDate: "",
      endDate: "",
      startTime: "",
      endTime: "",
      managerNote: "",
    },
    //     defaultValues: {
    //       project: "Metro Shopping Center",
    //       startDate: "19/06/2025",
    //       endDate: "21/06/2025",
    //       startTime: "09:00",
    //       endTime: "17:00",
    //       managerNote: "",
    //     },
  });

  // const [showProjectDropdown, setShowProjectDropdown] = useState(false);
  // const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  // const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const { data, isLoading } = useGetAllProjectUserQuery(null);
  console.log({ data });
  const projects = data?.data;
  const [createSchedule, { isLoading: createIsLoading }] =
    useCreateSchedulingRequestMutation();
  const startDateRef = useRef<HTMLDivElement>(null);
  const endDateRef = useRef<HTMLDivElement>(null);

  const project = watch("projectId");
  const startDate = watch("startDate");
  const endDate = watch("endDate");
  const startTime = watch("startTime");
  const endTime = watch("endTime");

  // handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        startDateRef.current &&
        !startDateRef.current.contains(event.target as Node)
      ) {
      }
      if (
        endDateRef.current &&
        !endDateRef.current.contains(event.target as Node)
      ) {
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const formatDateForInput = (dateStr: string) => {
    const [day, month, year] = dateStr.split("/");
    return `${year}-${month}-${day}`;
  };

  const handleDateChange = (dateStr: string, isStartDate: boolean) => {
    const [year, month, day] = dateStr.split("-");
    const formattedDate = `${day}/${month}/${year}`;

    if (isStartDate) {
      setValue("startDate", formattedDate);

      // If end date is before new start date, update end date too
      if (new Date(dateStr) > new Date(formatDateForInput(endDate))) {
        setValue("endDate", formattedDate);
      }
    } else {
      setValue("endDate", formattedDate);
    }
  };

  const calculateHours = () => {
    const [startDay, startMonth, startYear] = startDate.split("/");
    const [endDay, endMonth, endYear] = endDate.split("/");

    const start = new Date(
      `${startYear}-${startMonth}-${startDay}T${startTime}:00`
    );
    let end = new Date(`${endYear}-${endMonth}-${endDay}T${endTime}:00`);

    if (end < start) {
      end = new Date(end.getTime() + 24 * 60 * 60 * 1000);
    }

    const diffMs = end.getTime() - start.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);

    const hours = Math.floor(diffHours);
    const minutes = Math.round((diffHours - hours) * 60);

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
  };

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const onSubmit = async (data: FormValues) => {
    console.log("Form submitted:", data);
    const startISO = toISODate(startDate, startTime);
    const endISO = toISODate(endDate, endTime);
    try {
      const scheduleData = {
        projectId: data?.projectId,
        note: data?.managerNote,
        startTime: startISO,
        endTime: endISO,
      };
      const result = await createSchedule(scheduleData).unwrap();
      if (result.success) {
        toast.success(result?.message || "Schedule request send!!!");
        onClose();
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to send schedule request");
      console.error("Error sending schedule request:", error);
    }
  };

  return (
    <div
      className="fixed bg-black/30 inset-0 bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto"
      onClick={handleOutsideClick}
    >
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 border-b-2 border-gray-300 bg-white p-6 pb-0 flex items-center justify-between">
          <h1 className="text-lg font-medium text-gray-900 mt-2">Add Shift</h1>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Form */}
              <div className="lg:col-span-2 space-y-6">
                {/* Project */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project
                  </label>
                  <div className="relative w-full">
                    <select
                      {...register("projectId")}
                      value={project}
                      disabled={isLoading}
                      onChange={(e) => setValue("projectId", e.target.value)}
                      className="w-full appearance-none px-3 py-2 border border-gray-300 rounded-md bg-white text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 "
                    >
                      <option value="" disabled>
                        Select a project
                      </option>
                      {projects?.map((proj: any) => (
                        <option key={proj?.id} value={proj?.id}>
                          {proj?.title}
                        </option>
                      ))}
                    </select>

                    {/* Chevron Icon */}
                    <ChevronDown
                      size={16}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                    />
                  </div>

                  {errors.projectId && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.projectId.message}
                    </p>
                  )}
                </div>

                {/* Start Date / Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Starts
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="date"
                      value={formatDateForInput(startDate)}
                      onChange={(e) => handleDateChange(e.target.value, true)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-full bg-white text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 [appearance:none] [-webkit-appearance:none]"
                      min={formatDateForInput(
                        new Date().toLocaleDateString("en-GB")
                      )}
                    />
                    <span className="text-sm text-gray-500 whitespace-nowrap">
                      At:
                    </span>
                    <input
                      type="time"
                      {...register("startTime")}
                      className="px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  {errors.startTime && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.startTime.message}
                    </p>
                  )}
                </div>

                {/* End Date / Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ends
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1" ref={endDateRef}>
                      <input
                        type="date"
                        value={formatDateForInput(endDate)}
                        onChange={(e) =>
                          handleDateChange(e.target.value, false)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-full bg-white text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 [appearance:none] [-webkit-appearance:none]"
                        min={formatDateForInput(startDate)}
                      />
                    </div>
                    <span className="text-sm text-gray-500 whitespace-nowrap">
                      At:
                    </span>
                    <input
                      type="time"
                      {...register("endTime")}
                      className="px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  {errors.endTime && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.endTime.message}
                    </p>
                  )}
                </div>

                {/* Notes */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Shift attachments
                  </h3>
                  <textarea
                    {...register("managerNote")}
                    placeholder="Add manager note"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    rows={6}
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={createIsLoading}
                  className="w-full cursor-pointer disabled:opacity-70 sm:w-auto bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full font-medium transition-colors"
                >
                  {createIsLoading ? "Sending...." : "Send for approval"}
                </button>
              </div>

              {/* Right Column */}
              <div className="lg:col-span-1">
                <div className="bg-indigo-100 rounded-lg p-6 text-center h-full lg:h-60 mt-3 flex flex-col justify-center">
                  <div className="text-sm text-indigo-600 mb-2">
                    Total hours
                  </div>
                  <div className="text-3xl font-bold text-indigo-800">
                    {startDate && endDate && startTime && endTime
                      ? calculateHours()
                      : "N/A"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddShiftModal;
