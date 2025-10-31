/* eslint-disable @typescript-eslint/no-explicit-any */
import ProjectHeader from "@/components/ShiftScheduling/ProjectHeader";
import ShiftScheduler from "@/components/ShiftScheduling/ShiftScheduler";
import { useState } from "react";
import { X, File } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import GoogleMapsLocationPicker from "@/components/ShiftScheduling/GoogleMapsLocationPicker";
import {
  useCreateShiftTemplateMutation,
  useDeleteShiftTemplateMutation,
  useGetAllShiftTemplatesQuery,
} from "@/store/api/admin/shift-sheduling/CreateShiftApi";
import { DateTime } from "luxon";
import { userDefaultTimeZone } from "@/utils/dateUtils";
import { toast } from "sonner";
import { FaTrash } from "react-icons/fa";

interface TemplateFormData {
  startTime: string;
  endTime: string;
  location: string;
  locationLat: number;
  locationLng: number;
  templateTitle: string;
  job?: string;
  note?: string;
  locationCoordinates?: {
    address: string;
    latitude: number;
    longitude: number;
  } | null;
}

export default function ShiftScheduling() {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [createShiftTemplate] = useCreateShiftTemplateMutation();
  const {
    data: alltemplates,
    isLoading: isLoadingTemplates,
    refetch: refetchTemplates,
  } = useGetAllShiftTemplatesQuery({});
  const [deleteShiftTemplate] = useDeleteShiftTemplateMutation();
  const timeZone = userDefaultTimeZone();
  console.log("Fetched Templates:", alltemplates);
  // Form management for template creation
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TemplateFormData>({
    defaultValues: {
      startTime: "",
      endTime: "",
      location: "",
      locationLat: 0,
      locationLng: 0,
      templateTitle: "",
      job: "",
      note: "",
      locationCoordinates: null,
    },
  });

  const templates = alltemplates?.data || [];

    const toUTCISO = (dateIso: string, timeHHMM: string) => {
      // dateIso: "YYYY-MM-DD", timeHHMM: "HH:mm"
      // Interpret in user's timeZone, then convert to UTC ISO string
      return DateTime.fromISO(`${dateIso}T${timeHHMM}`, { zone: timeZone })
        .toUTC()
        .toISO();
    };

      // const startOfLocalDayToUTCISO = (dateIso: string) => {
      //   return DateTime.fromISO(`${dateIso}T00:00`, { zone: timeZone })
      //     .toUTC()
      //     .toISO();
      // };
  const onSubmit = async (data: TemplateFormData) => {
    try {
      // Get current date in ISO format
      const currentDate = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

      // Create the template data structure as requested
      const templateData = {
        startTime: toUTCISO(currentDate, data.startTime),
        endTime: toUTCISO(currentDate, data.endTime),
        location: data.locationCoordinates?.address || data.location,
        locationLat: data.locationCoordinates?.latitude || data.locationLat,
        locationLng: data.locationCoordinates?.longitude || data.locationLng,
        templateTitle: data.templateTitle,
        ...(data.job && { job: data.job }),
        ...(data.note && { note: data.note }),
      };

      console.log("Template created:", templateData);
      await createShiftTemplate(templateData).unwrap();
      // Refetch templates to show the newly added one
      refetchTemplates();
      // Reset form and close modal
      reset();
      setIsModalOpen(false);
      toast.success("Template created successfully!");
    } catch (error) {
      console.error("Error creating template:", error);
      toast.error("Error creating template. Please try again.");
    }
  };

  const isoToLocalTimeShort = (iso: string) =>
    DateTime.fromISO(iso).setZone(timeZone).toFormat("h:mm a");

  const handleDeleteTemplate = async (id: string) => {
    if (!id) return;
    try {
      await deleteShiftTemplate(id).unwrap();
      refetchTemplates();
      toast.success("Template deleted successfully!");
    } catch (error) {
      console.error("Error deleting template:", error);
      toast.error("Error deleting template. Please try again.");
    }
  };

  return (
    <div className="relative">
      <ProjectHeader />
      <ShiftScheduler />

      {/* Template Button */}
      <button
        onClick={() => setOpenDrawer(true)}
        className="fixed top-[10%] right-4 bg-[#4E53B1] hover:bg-[#3d4199] text-white px-4 py-2 rounded-lg shadow-lg transition-all duration-200 flex items-center gap-2 z-40"
      >
        <File size={18} />
        Template
      </button>

      {/* Drawer Overlay */}
      {openDrawer && (
        <div
          className="fixed inset-0 shadow-xl shadow-blue-500 z-50 transition-opacity duration-300"
          onClick={() => setOpenDrawer(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          openDrawer ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Templates</h2>
          <button
            onClick={() => setOpenDrawer(false)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {isLoadingTemplates && (
          <div className="p-6">
            <p className="text-gray-500">Loading templates...</p>
          </div>
        )}
        {/* Drawer Content */}
        <div className="p-6 overflow-y-auto h-full pb-20">
          <div className="space-y-4">
            {/* Template Categories */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                Shift Templates
              </h3>
              <div className="space-y-2">
                {templates && templates.length > 0 ? (
                  templates.map((template: any) => (
                    <div
                      key={template.id}
                      className="p-4 space-y-2 border border-gray-200 rounded-lg hover:border-[#4E53B1] cursor-pointer transition-colors duration-200"
                    >
                      <h4 className="font-medium text-gray-900 flex justify-between items-start">
                        <span>{template.templateTitle}</span> <FaTrash className="text-red-500" onClick={() => handleDeleteTemplate(template.id)} />
                      </h4>
                      <p className="text-sm text-gray-600">
                        {template.location}
                      </p>
                      <p className="text-sm text-gray-600">
                        {isoToLocalTimeShort(template.startTime)} -{" "}
                        {isoToLocalTimeShort(template.endTime)}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-600">No templates found</p>
                )}
              </div>
            </div>

            {/* Create New Template Button */}
            <div className="pt-4 border-t border-gray-200">
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full bg-[#4E53B1] hover:bg-[#3d4199] text-white px-4 py-3 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <File size={18} />
                Create New Template
              </button>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Create Template
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                &times;
              </button>
            </div>

            {/* Template Creation Form */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4 text-sm"
            >
              {/* Template Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Template Title <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="templateTitle"
                  control={control}
                  rules={{ required: "Template title is required" }}
                  render={({ field }) => (
                    <input
                      type="text"
                      placeholder="Enter template title (e.g., Morning Shift)"
                      {...field}
                      className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-[#4E53B1] focus:border-transparent"
                    />
                  )}
                />
                {errors.templateTitle && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.templateTitle.message}
                  </p>
                )}
              </div>

              {/* Start and End Time */}
              <div className="flex gap-4 items-center justify-between">
                <div className="flex items-center gap-4 w-full">
                  <div className="flex flex-col justify-start gap-2 flex-1">
                    <label className="font-medium">
                      Start Time <span className="text-red-500">*</span>
                    </label>
                    <Controller
                      name="startTime"
                      control={control}
                      rules={{ required: "Start time is required" }}
                      render={({ field }) => (
                        <input
                          type="time"
                          {...field}
                          className="border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-[#4E53B1] focus:border-transparent"
                        />
                      )}
                    />
                    {errors.startTime && (
                      <p className="text-red-500 text-xs">
                        {errors.startTime.message}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col justify-start gap-2 flex-1">
                    <label className="font-medium">
                      End Time <span className="text-red-500">*</span>
                    </label>
                    <Controller
                      name="endTime"
                      control={control}
                      rules={{ required: "End time is required" }}
                      render={({ field }) => (
                        <input
                          type="time"
                          {...field}
                          className="border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-[#4E53B1] focus:border-transparent"
                        />
                      )}
                    />
                    {errors.endTime && (
                      <p className="text-red-500 text-xs">
                        {errors.endTime.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Location Picker */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="locationCoordinates"
                  control={control}
                  rules={{ required: "Location is required" }}
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
                {errors.locationCoordinates && (
                  <p className="text-red-500 text-xs mt-1">
                    Location is required
                  </p>
                )}
              </div>

              {/* Job (Optional) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job (Optional)
                </label>
                <Controller
                  name="job"
                  control={control}
                  render={({ field }) => (
                    <input
                      type="text"
                      placeholder="Enter job role (e.g., Cashier)"
                      {...field}
                      className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-[#4E53B1] focus:border-transparent"
                    />
                  )}
                />
              </div>

              {/* Notes (Optional) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (Optional)
                </label>
                <Controller
                  name="note"
                  control={control}
                  render={({ field }) => (
                    <textarea
                      placeholder="Enter additional notes (e.g., Bring your ID card)"
                      {...field}
                      rows={3}
                      className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-[#4E53B1] focus:border-transparent"
                    />
                  )}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="bg-[rgba(78,83,177,1)] text-white px-6 py-2 rounded-lg text-sm hover:bg-indigo-800 transition-colors duration-200"
                >
                  Save as Template
                </button>
                <button
                  type="button"
                  className="text-red-500 border border-gray-300 px-6 py-2 rounded-lg font-semibold hover:bg-red-50 transition-colors duration-200"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
