import * as z from "zod";

const MAX_FILE_SIZE = 1024 * 1024; // 1MB

export const taskSchema = z.object({
  projectId: z.string().min(1, { message: "Project is required" }),
  assignUserId: z.string().min(1, { message: "Assignee is required" }),
  title: z.string().min(1, { message: "Task title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  location: z.string().min(1, { message: "Location is required" }),
  startTime: z.date({
    required_error: "Start date and time are required",
  }),
  endTime: z.date({
    required_error: "End date and time are required",
  }),
  labels: z.array(z.string()).min(1, { message: "At least one label is required" }),
  attachment: z
    .any()
    .refine((files) => files?.length > 0, "Attachment is required.")
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `File size must be less than 1MB.`)
    .refine(
      (files) =>
        !files?.[0] ||
        [
          "image/jpeg",
          "image/png",
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ].includes(files?.[0]?.type),
      "Unsupported file type."
    ),
});
