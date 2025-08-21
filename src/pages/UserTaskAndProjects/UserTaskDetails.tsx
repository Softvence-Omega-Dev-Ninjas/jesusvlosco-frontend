import { useGetUserTaskDetailsQuery, useSubmitTaskMutation } from "@/store/api/admin/task-and-projects";
import { useNavigate, useParams } from "react-router-dom";
import { formatCustomDate } from "../TasksAndProjects/TaskRow";
import { FaSpinner } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Paperclip, X } from "lucide-react";

// 1. Define the Zod schema for validation
const taskAttachmentSchema = z.object({
  attachment: z
    .any()
    .refine((files) => files?.[0], "An attachment is required.")
    .refine((files) => files?.[0]?.size <= 5000000, `Max file size is 5MB.`)
    .refine(
      (files) =>
        [
          "image/jpeg",
          "image/png",
          "image/gif",
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ].includes(files?.[0]?.type),
      "Invalid file type."
    ),
});

type TaskAttachmentFormData = z.infer<typeof taskAttachmentSchema>;

export default function UserTaskDetails() {
  const { id } = useParams();

  const { data: taskDetails, isLoading } = useGetUserTaskDetailsQuery(id);
  console.log(taskDetails);
  const [submitTask, { isLoading: isSubmitting }] = useSubmitTaskMutation();

  const navigate = useNavigate();

  // 2. Initialize React Hook Form with the schema
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<TaskAttachmentFormData>({
    resolver: zodResolver(taskAttachmentSchema),
  });

  const attachment = watch("attachment");

  // 3. Create the submission handler
  const handleTaskSubmission = async (data: TaskAttachmentFormData) => {
    const formData = new FormData();

    if (data.attachment?.[0]) {
      formData.append("attachment", data.attachment[0]);
    }

    try {
      const result = await submitTask({ taskId: id, formData }).unwrap();
      if (result?.success) {
        toast.success("Task submitted successfully with attachment.");
        reset(); // Reset form after successful submission
        navigate("/user/user-task");
      }
    } catch (error) {
      console.error("Submission failed:", error);
      toast.error("Failed to submit task.");
    }
  };

  return (
    <div>
      {isLoading && (
        <div className="w-full h-96 flex items-center justify-center">
          <FaSpinner className="animate-spin text-3xl" />
        </div>
      )}
      {!isLoading && (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
          <div>
            {/* Header */}
            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-6 sm:mb-8">Task Details</h1>

            {/* Main Task Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-[#C8CAE7] p-6 sm:p-8">
              {/* Task Header */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                <div className="flex-1">
                  <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">{taskDetails?.data?.title}</h2>
                  <div className="flex flex-wrap gap-4 pt-4">
                    <span className="inline-flex items-center px-6 py-2 rounded-full text-sm bg-[#D9F0E4] text-[#06843F]">
                      {taskDetails?.data?.status}
                    </span>
                    <span className="inline-flex items-center px-6 py-2 rounded-full text-sm bg-[#4E53B1] text-white">
                      {taskDetails?.data?.labels}
                    </span>
                  </div>
                </div>
              </div>

              {/* Description Section */}
              <div className="mb-8 border-t border-b border-[#C8CAE7] py-8">
                <h3 className="text-lg font-medium text-[#484848] mb-3">Description</h3>
                <p className="text-[#5B5B5B] text-md leading-relaxed w-full lg:w-1/2">{taskDetails?.data?.description}</p>
              </div>

              {/* Assigned To Section */}
              <div className="mb-8 border-b border-[#C8CAE7] pb-8">
                <h3 className="text-lg font-medium text-[#5B5B5B] mb-3">Assigned to</h3>
                <a href="#" className="text-[#4E53B1] hover:text-black font-medium transition-colors duration-200">
                  {taskDetails?.data?.tasksUsers[0]?.user?.profile?.firstName} {taskDetails?.data?.tasksUsers[0]?.user?.profile?.lastName}
                </a>
              </div>

              {/* Time Section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 w-full lg:w-1/2">
                <div>
                  <h3 className="text-lg font-medium text-[#484848] mb-3">Start time</h3>
                  <div className="flex items-center gap-3 text-gray-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span>{formatCustomDate(taskDetails?.data?.startTime)}</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-[#484848] mb-3">End time</h3>
                  <div className="flex items-center gap-3 text-gray-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span>{formatCustomDate(taskDetails?.data?.endTime)}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Actions - Converted to a form */}
              <form onSubmit={handleSubmit(handleTaskSubmission)}>
                <div className="flex flex-col sm:flex-row items-center justify-between border-t border-[#C8CAE7] py-6 gap-4">
                  <div>
                    <div className="flex justify-start items-center">
                      <label
                        htmlFor="attachment"
                        className="inline-flex items-center gap-2 text-[#4E53B1] border border-[#4E53B1] font-medium px-4 py-2 rounded-lg cursor-pointer transition-colors duration-200 mb-2"
                      >
                        <Paperclip className="h-4 w-4" />
                        <span>{attachment?.[0] ? "Change attachment" : "Add attachment"}</span>
                      </label>
                      <input id="attachment" type="file" {...register("attachment")} className="hidden" />
                    </div>

                    {/* File preview and removal button */}
                    {attachment?.[0] && (
                      <div className="flex items-center gap-2 sm:mt-0 bg-slate-50 rounded-md px-3 py-4">
                        <span className="text-sm truncate max-w-[200px]">{attachment[0].name}</span>
                        <button
                          type="button"
                          onClick={() => reset({ attachment: undefined })}
                          className="text-gray-500 hover:text-red-500"
                          aria-label="Remove attachment"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-3 cursor-pointer rounded-lg text-white hover:bg-[#30325e] bg-[#4E53B1] disabled:bg-gray-400 disabled:cursor-not-allowed"
                    disabled={isSubmitting || taskDetails?.data?.status === "DONE"}
                  >
                    {isSubmitting ? "Submitting..." : "Submit Task"}
                  </button>
                </div>
                {errors.attachment?.message && <p className="text-sm text-red-500">{String(errors.attachment.message)}</p>}
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
