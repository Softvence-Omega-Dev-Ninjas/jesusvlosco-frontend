import z from "zod";

export const clockInRequestSchema = z.object({
  shiftId: z.string().min(1, "Project is required"),
  reason: z.string().optional(),
  startDate: z.string().min(1, "Start date is required"),
  startTime: z.string().min(1, "Start time is required"),
  endDate: z.string().min(1, "End date is required"),
  endTime: z.string().min(1, "End time is required"),
  locationCoordinates: z.object({
    address: z.string().min(1, "Location is required"),
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
  }),
});
