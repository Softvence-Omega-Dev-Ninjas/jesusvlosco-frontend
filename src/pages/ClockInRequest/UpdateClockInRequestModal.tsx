/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

import { FaSpinner } from "react-icons/fa";

import {  useUpdateClockInRequestDataMutation } from "@/store/api/admin/shift-sheduling";
import { toast } from "sonner";
import { clockInRequestSchema } from "@/components/ShiftScheduling/AddClockInRequestModal/clockInRequest.schema";
import GoogleMapsLocationPicker from "@/components/ShiftScheduling/GoogleMapsLocationPicker";
import { TClockInRequest } from "@/types/clockin";

const clockInRequestDefaultValue = {
  shiftId: "",
  startDate: "",
  endDate: "",
  startTime: "",
  endTime: "",
  reason: "",
};

const UpdateClockInRequestModal = ({ item }: { item: TClockInRequest }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedShiftName, setSelectedShiftName] = useState("");
  const [updateClockInRequestData] = useUpdateClockInRequestDataMutation();


  // Convert ISO strings to date and time format for form
  const getDefaultValues = () => {
    if (!item) return clockInRequestDefaultValue;

    const startDateTime = new Date(item.requestedClockInAt);
    const endDateTime = new Date(item.requestedClockOutAt);

    return {
      shiftId: item.shiftId,
      startDate: startDateTime.toISOString().split('T')[0],
      endDate: endDateTime.toISOString().split('T')[0],
      startTime: startDateTime.toTimeString().slice(0, 5),
      endTime: endDateTime.toTimeString().slice(0, 5),
      reason: item.reason,
      locationCoordinates: {
        address: item.location,
        latitude: item.locationLat,
        longitude: item.locationLng,
      },
    };
  };

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof clockInRequestSchema>>({
    resolver: zodResolver(clockInRequestSchema),
    defaultValues: getDefaultValues(),
  });

  // Update form when modal opens with current item data
  useEffect(() => {
    if (isModalOpen && item) {
      const startDateTime = new Date(item.requestedClockInAt);
      const endDateTime = new Date(item.requestedClockOutAt);

      const defaultValues = {
        shiftId: item.shiftId,
        startDate: startDateTime.toISOString().split('T')[0],
        endDate: endDateTime.toISOString().split('T')[0],
        startTime: startDateTime.toTimeString().slice(0, 5),
        endTime: endDateTime.toTimeString().slice(0, 5),
        reason: item.reason,
        locationCoordinates: {
          address: item.location,
          latitude: item.locationLat,
          longitude: item.locationLng,
        },
      };

      reset(defaultValues);
      setSelectedShiftName(item.shift.shiftTitle);
    }
  }, [isModalOpen, item, reset]);


  const onSubmit = async (data: z.infer<typeof clockInRequestSchema>) => {
    // Combine date and time for start and end times
    const startDateTime = new Date(`${data.startDate}T${data.startTime}:00`).toISOString();
    const endDateTime = new Date(`${data.endDate}T${data.endTime}:00`).toISOString();

    // Only update the specified fields
    const formatedData = {
      shiftId: data.shiftId,
      requestedClockInAt: startDateTime,
      requestedClockOutAt: endDateTime,
      location: data.locationCoordinates.address,
      locationLat: data.locationCoordinates.latitude,
      locationLng: data.locationCoordinates.longitude,
      reason: data.reason,
    };
    try {
      const result = await updateClockInRequestData({ id: item.id, data: formatedData }).unwrap();
      console.log(result);
      if (result?.success) {
        toast.success("Clock-in request updated successfully!");
        reset();
        setIsModalOpen(false); // Close the dialog on success
      }
    } catch (error) {
      console.error("Error updating clock-in request:", error);
      toast.error("Failed to update clock-in request"); 
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
          <button className="flex items-center justify-center gap-3 px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors bg-white hover:shadow-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 w-full">
            <span className="text-sm font-medium text-black">Update Request</span>
          </button>
        </DialogTrigger>
        <DialogContent className="bg-white">
          <DialogHeader className="px-6">
            <DialogTitle className="font-bold">Update Clock In Request</DialogTitle>
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
                      type="text"
                      placeholder="Search for a shift..."
                      defaultValue={selectedShiftName}
                      readOnly
                      className={`w-full border border-slate-300 p-2 rounded-md}`}
                    />
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
                {isSubmitting ? <FaSpinner className="animate-spin" /> : "Update Request"}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UpdateClockInRequestModal;
