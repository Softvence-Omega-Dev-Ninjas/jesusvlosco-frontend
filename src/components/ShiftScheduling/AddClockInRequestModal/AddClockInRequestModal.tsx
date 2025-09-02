/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import GoogleMapsLocationPicker from "../GoogleMapsLocationPicker";
import { FaSpinner } from "react-icons/fa";
import { clockInRequestSchema } from "./clockInRequest.schema";
import { useAddClockInRequestMutation, useGetAllShiftsOfAUserQuery } from "@/store/api/admin/shift-sheduling";
import { toast } from "sonner";

const clockInRequestDefaultValue = {
  shiftId: "",
  startDate: "",
  endDate: "",
  startTime: "",
  endTime: "",
  reason: "",
};

const AddClockInRequestModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [addClockInRequest] = useAddClockInRequestMutation();
  const { data: shiftData, isLoading: isShiftsLoading } = useGetAllShiftsOfAUserQuery({ searchTerm });

  console.log("===========>", shiftData);
  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof clockInRequestSchema>>({
    resolver: zodResolver(clockInRequestSchema),
    defaultValues: clockInRequestDefaultValue,
  });

  const onSubmit = async (data: z.infer<typeof clockInRequestSchema>) => {
    // Combine date and time for start and end times
    const startDateTime = new Date(`${data.startDate}T${data.startTime}:00`).toISOString();
    const endDateTime = new Date(`${data.endDate}T${data.endTime}:00`).toISOString();

    const formatedData = {
      shiftId: data.shiftId,
      requestedClockInAt: startDateTime,
      requestedClockOutAt: endDateTime,
      location: data.locationCoordinates.address,
      locationLat: data.locationCoordinates.latitude,
      locationLng: data.locationCoordinates.longitude,
      reason: data.reason,
    };
    console.log(formatedData);
    try {
      const result = await addClockInRequest(formatedData).unwrap();
      console.log(result);
      if (result?.success) {
        toast.success("Clock-in request sent successfully!");
        reset();
        setIsModalOpen(false); // Close the dialog on success
      }
    } catch (error) {
      console.error("Error publishing task:", error);
      toast.error("Failed to send Clock-in request"); // Add a toast for failure
    } finally {
      // setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Dialog
        open={isModalOpen}
        onOpenChange={(open) => {
          setIsModalOpen(open);
          if (!open) {
            reset();
          }
        }}
      >
        <DialogTrigger className="w-full">
          <button className="flex items-center gap-3 px-4 py-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors bg-white hover:shadow-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 w-full">
            <Plus className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Add Clock In Request</span>
          </button>
        </DialogTrigger>
        <DialogContent className="bg-white">
          <DialogHeader className="px-6">
            <DialogTitle className="font-bold">Add Clock In Request</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="px-6 pb-6 space-y-4">
            <div>
              <label htmlFor="shift-combobox" className="text-sm font-medium text-gray-700 mb-2 block">
                Shift
              </label>
              <Controller
                name="shiftId"
                control={control}
                render={() => (
                  <div className="relative">
                    <input
                      // id="shift-combobox"
                      type="text"
                      placeholder="Search for a shift..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className={`w-full border border-slate-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.shiftId ? "border-red-500" : ""
                      }`}
                      onFocus={() => {
                        setIsDropdownOpen(true);
                        setSearchTerm(""); // optional: reset search term on focus
                      }}
                      onBlur={() => {
                        // Small delay so onClick can fire before closing
                        setTimeout(() => setIsDropdownOpen(false), 150);
                      }}
                    />

                    {isDropdownOpen && (
                      <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-y-auto shadow-lg">
                        {isShiftsLoading ? (
                          <li className="p-2 text-gray-500">Loading shifts...</li>
                        ) : shiftData?.data?.length > 0 ? (
                          shiftData.data.map((item: any) => (
                            <li
                              key={item.id}
                              className="p-2 cursor-pointer hover:bg-gray-100"
                              onClick={() => {
                                setValue("shiftId", item.id, { shouldValidate: true });
                                setSearchTerm(item.shiftTitle);
                                setIsDropdownOpen(false);
                              }}
                            >
                              {item.shiftTitle}
                            </li>
                          ))
                        ) : (
                          <li className="p-2 text-gray-500">No shifts found.</li>
                        )}
                      </ul>
                    )}
                  </div>
                )}
              />
              {errors.shiftId && <p className="text-sm text-red-500 mt-1">{errors.shiftId.message}</p>}
            </div>

            {/* Task Description */}
            <div className="space-y-2">
              <label htmlFor="reason" className="text-sm font-medium text-gray-700 block">
                Reason
              </label>
              <textarea
                id="reason"
                placeholder="Add reason"
                {...register("reason")}
                className={`w-full border border-gray-200 min-h-[80px] resize-none p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.reason ? "border-red-500" : ""
                }`}
              />
              {errors.reason && <p className="text-sm text-red-500">{errors.reason.message}</p>}
            </div>

            {/* Start Date / Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Starts</label>
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <div className="w-full">
                  <input
                    type="date"
                    {...register("startDate")}
                    className={`w-full rounded-md px-3 py-2 border border-gray-300  bg-white text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 [appearance:none] [-webkit-appearance:none] ${
                      errors.startDate ? "border-red-500" : ""
                    }`}
                    min={new Date().toISOString().slice(0, 10)}
                  />
                  {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate.message}</p>}
                </div>
                <span className="text-sm text-gray-500 whitespace-nowrap">At:</span>
                <div className="w-full">
                  <input
                    type="time"
                    {...register("startTime")}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.startTime ? "border-red-500" : ""
                    }`}
                  />
                  {errors.startTime && <p className="text-red-500 text-sm mt-1">{errors.startTime.message}</p>}
                </div>
              </div>
            </div>

            {/* End Date / Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ends</label>
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <div className="w-full">
                  <input
                    type="date"
                    {...register("endDate")}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 [appearance:none] [-webkit-appearance:none] ${
                      errors.endDate ? "border-red-500" : ""
                    }`}
                    min={new Date().toISOString().slice(0, 10)}
                  />
                  {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate.message}</p>}
                </div>
                <span className="text-sm text-gray-500 whitespace-nowrap">At:</span>
                <div className="w-full">
                  <input
                    type="time"
                    {...register("endTime")}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.endTime ? "border-red-500" : ""
                    }`}
                  />
                  {errors.endTime && <p className="text-red-500 text-sm mt-1">{errors.endTime.message}</p>}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
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
              {errors.locationCoordinates?.address && <p className="text-red-500 text-sm mt-1">{errors.locationCoordinates.address.message}</p>}
            </div>

            <div className="flex justify-end items-center pt-4">
              <button
                type="submit"
                className="bg-[#4E53B1] hover:bg-[#4E53B1]/90 text-white font-medium py-2 px-6 rounded-full cursor-pointer transition-colors"
                disabled={isSubmitting}
              >
                {isSubmitting ? <FaSpinner className="animate-spin" /> : "Send"}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddClockInRequestModal;
