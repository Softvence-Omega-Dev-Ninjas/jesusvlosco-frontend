import type React from "react";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { FaSpinner } from "react-icons/fa";
import { Paperclip, Trash2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { cn } from "@/lib/utils";
import { DateTimePicker } from "./DateTimePicker";
import { taskSchema } from "./schemas/createTask.scheme";
import { useGetAllUserQuery } from "@/store/api/admin/user/userApi";
import { useGetAllProjectsQuery } from "@/store/api/admin/shift-sheduling/CreateProjectapi";
import { useCreateTaskMutation } from "@/store/api/admin/task-and-projects";
import { toast } from "sonner";

type TaskFormData = z.infer<typeof taskSchema>;

interface NewTaskModalProps {
  trigger?: React.ReactNode;
}

export function NewTaskModal({ trigger }: NewTaskModalProps) {
  const { data: users, isLoading: isUserLoading } = useGetAllUserQuery(undefined);
  const { data: projects, isLoading: isProjectLoading } = useGetAllProjectsQuery(undefined);
  const [createTask] = useCreateTaskMutation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
  });

  const attachment = watch("attachment");

  // This function now explicitly resets each field to its initial empty state.
  const resetForm = () => {
    reset({
      projectId: "",
      assignUserId: "",
      title: "",
      description: "",
      location: "",
      startTime: undefined,
      endTime: undefined,
      labels: [],
      attachment: undefined,
    });
    setIsSubmitting(false);
  };

  //Handle publish task
  const handlePublishTask = async (data: TaskFormData) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === "labels") {
        (value as string[]).forEach((label) => formData.append("labels", label));
      } else if (key === "startTime" || key === "endTime") {
        const isoString = (value as Date).toISOString();
        formData.append(key, isoString);
      } else if (key === "attachment" && value?.[0]) {
        formData.append(key, value[0]);
      } else {
        formData.append(key, value as string);
      }
    });

    formData.append("status", "OPEN");

    try {
      const result = await createTask(formData).unwrap();
      console.log(result);
      if (result?.success) {
        toast.success("Task assigned successfully.");
      }

      resetForm();
    } catch (error) {
      console.error("Error publishing task:", error);
    }
  };

  //Handle draft task
  const handleDraftTask = async (data: TaskFormData) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === "labels") {
        (value as string[]).forEach((label) => formData.append("labels", label));
      } else if (key === "startTime" || key === "endTime") {
        formData.append(key, (value as Date).toISOString());
      } else if (key === "attachment" && value?.[0]) {
        formData.append(key, value[0]);
      } else {
        formData.append(key, value as string);
      }
    });

    formData.append("status", "DAFT");

    try {
      const result = await createTask(formData).unwrap();
      if (result?.success) {
        toast.success("Task draft saved successfully.");
      }
      resetForm();
    } catch (error) {
      console.error("Error saving draft task:", error);
    }
  };

  const showDetails = true; // Hardcoded to true for demonstration of delete button

  return (
    <Dialog onOpenChange={(open) => !open && resetForm()}>
      <DialogTrigger asChild>{trigger || <Button className="">New Task</Button>}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[600px] overflow-y-scroll border-none p-0 bg-white">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle className="text-lg font-semibold text-[#4E53B1] flex items-center gap-2">
            <span className="text-[#4E53B1]">+</span>
            New Task
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={(e) => e.preventDefault()} className="px-6 pb-6 space-y-4">
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Task Details</h3>
          </div>

          {/* Project */}
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-1.5">Project</Label>
            <Controller
              name="projectId"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value ?? ""}>
                  <SelectTrigger className={cn("w-full border border-slate-300", errors.projectId && "border-red-500")}>
                    <SelectValue placeholder="Select project" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-none">
                    {isProjectLoading && (
                      <div className="w-full h-14 flex items-center justify-center">
                        <FaSpinner className="animate-spin" />
                      </div>
                    )}
                    {!isProjectLoading &&
                      (projects as any)?.data?.projects?.map((project: any) => {
                        return <SelectItem key={project?.id} value={project?.id}>{`${project?.title}`}</SelectItem>;
                      })}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.projectId && <p className="text-sm text-red-500 mt-1">{errors.projectId.message}</p>}
          </div>

          {/* Assign to */}
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-1.5">Assign to</Label>
            <Controller
              name="assignUserId"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value ?? ""}>
                  <SelectTrigger className={cn("w-full border border-slate-300", errors.assignUserId && "border-red-500")}>
                    <SelectValue placeholder="Select user" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-none max-h-60 overflow-y-scroll">
                    {isUserLoading && (
                      <div className="w-full h-14 flex items-center justify-center">
                        <FaSpinner className="animate-spin" />
                      </div>
                    )}
                    {!isUserLoading &&
                      users?.data?.map((user: any) => {
                        return <SelectItem key={user?.id} value={user?.id}>{`${user?.profile?.firstName} ${user?.profile?.lastName}`}</SelectItem>;
                      })}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.assignUserId && <p className="text-sm text-red-500 mt-1">{errors.assignUserId.message}</p>}
          </div>

          {/* Task Title */}
          <div className="space-y-2">
            <Label htmlFor="task-title" className="text-sm font-medium text-gray-700">
              Task Title
            </Label>
            <Input
              id="task-title"
              placeholder="Task title"
              {...register("title")}
              className={cn("border-gray-200", errors.title && "border-red-500")}
            />
            {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
          </div>

          {/* Task Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium text-gray-700">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Add description"
              {...register("description")}
              className={cn("border-gray-200 min-h-[80px] resize-none", errors.description && "border-red-500")}
            />
            {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
          </div>

          {/* Attachment */}
          <div>
            <Label htmlFor="attachment" className="text-sm font-medium text-gray-700 mb-1.5 cursor-pointer flex items-center gap-2">
              <Paperclip className="h-4 w-4" />
              <span>Attachment</span>
            </Label>
            <Input id="attachment" type="file" {...register("attachment")} className="sr-only" />
            {attachment?.[0] ? (
              <div className="flex items-center justify-between p-2 mt-2 border border-gray-200 shadow-xs rounded-md">
                <span className="text-sm truncate">{attachment[0].name}</span>
                <Button variant="ghost" size="sm" onClick={() => reset({ ...watch(), attachment: undefined })}>
                  <X className="h-4 w-4 border-gray-200" />
                </Button>
              </div>
            ) : (
              <div className="mt-2 text-sm text-gray-500">No file selected</div>
            )}
            {errors.attachment && <p className="text-sm text-red-500 mt-1">{errors.attachment.message as React.ReactNode}</p>}
          </div>

          {/* Reusable Start + End DateTime pickers */}
          <Controller
            name="startTime"
            control={control}
            render={({ field }) => (
              <DateTimePicker
                label="Start Date & Time"
                date={field.value}
                setDate={field.onChange}
                time={field.value ? field.value.toLocaleTimeString("en-US", { hour12: false }) : ""}
                setTime={(time) => {
                  const [hours, minutes, seconds] = time.split(":").map(Number);
                  const newDate = field.value || new Date();
                  newDate.setHours(hours, minutes, seconds || 0, 0);
                  field.onChange(newDate);
                }}
              />
            )}
          />
          {errors.startTime && <p className="text-sm text-red-500 mt-1">{errors.startTime.message}</p>}

          <Controller
            name="endTime"
            control={control}
            render={({ field }) => (
              <DateTimePicker
                label="End Date & Time"
                date={field.value}
                setDate={field.onChange}
                time={field.value ? field.value.toLocaleTimeString("en-US", { hour12: false }) : ""}
                setTime={(time) => {
                  const [hours, minutes, seconds] = time.split(":").map(Number);
                  const newDate = field.value || new Date();
                  newDate.setHours(hours, minutes, seconds || 0, 0);
                  field.onChange(newDate);
                }}
              />
            )}
          />
          {errors.endTime && <p className="text-sm text-red-500 mt-1">{errors.endTime.message}</p>}

          {/* Labels */}
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-1.5">Labels</Label>
            <Controller
              name="labels"
              control={control}
              render={({ field }) => (
                <Select onValueChange={(value) => field.onChange([value])} value={field.value?.[0] ?? ""}>
                  <SelectTrigger className={cn("w-full border border-slate-300", errors.labels && "border-red-500")}>
                    <SelectValue placeholder="Select labels" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-none">
                    <SelectItem value="LOW">Low</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="HIGH">High</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.labels && <p className="text-sm text-red-500 mt-1">{errors.labels.message}</p>}
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location" className="text-sm font-medium text-gray-700">
              Location
            </Label>
            <Input
              id="location"
              placeholder="Location"
              {...register("location")}
              className={cn("border-gray-200", errors.location && "border-red-500")}
            />
            {errors.location && <p className="text-sm text-red-500">{errors.location.message}</p>}
          </div>

          <div className="flex justify-between items-center pt-4">
            <div className="flex gap-2">
              <Button
                className="bg-[#4E53B1] hover:bg-[#4E53B1]/90 text-white cursor-pointer"
                onClick={handleSubmit(handlePublishTask)}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Publishing..." : "Publish Task"}
              </Button>
              <Button
                variant="outline"
                className="border-gray-300 bg-transparent cursor-pointer"
                onClick={handleSubmit(handleDraftTask)}
                disabled={isSubmitting}
              >
                Draft Task
              </Button>
            </div>

            {showDetails && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-red-500 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                onClick={resetForm}
                disabled={isSubmitting}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
