import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {  Paperclip, Trash2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { DateTimePicker } from "./DateTimePicker";

interface NewTaskModalProps {
  trigger?: React.ReactNode;
}

interface TaskFormData {
  taskTitle: string;
  assignTo: string;
  description: string;
  location: string;
  startDateTime: string | null;
  endDateTime: string | null;
  labels: string[];
  attachment?: File;
}

export function NewTaskModal({ trigger }: NewTaskModalProps) {
  const [projectId, setProjectId] = useState("");
  const [userId, setUserId] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const [labels, setLabels] = useState("");
  const [taskTitle, setTaskTitle] = useState("");
  const [assignTo, setAssignTo] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [startTime, setStartTime] = useState("00:00:00");

  const [endDate, setEndDate] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState("00:00:00");

  // Merge date + time into ISO string
  const mergeDateTime = (date: Date | null, time: string): string | null => {
    if (!date) return null;
    const [hours, minutes, seconds] = time.split(":").map(Number);
    const merged = new Date(date);
    merged.setHours(hours, minutes, seconds || 0, 0);
    return merged.toISOString();
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!taskTitle.trim()) {
      newErrors.taskTitle = "Task title is required";
    }

    if (showDetails && !description.trim()) {
      newErrors.description = "Description is required when using detailed form";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePublishTask = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    const formData: TaskFormData = {
      taskTitle: taskTitle.trim(),
      assignTo: assignTo.trim(),
      description: description.trim(),
      location: location.trim(),
      startDateTime: mergeDateTime(startDate, startTime),
      endDateTime: mergeDateTime(endDate, endTime),
      labels: [...labels],
    };

    try {
      console.log("[v0] Task Form Data (Publish):", formData);

      await new Promise((resolve) => setTimeout(resolve, 1000));
      resetForm();
    } catch (error) {
      console.error("[v0] Error publishing task:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDraftTask = () => {
    const formData: TaskFormData = {
      taskTitle: taskTitle.trim(),
      assignTo: assignTo.trim(),
      description: description.trim(),
      location: location.trim(),
      startDateTime: mergeDateTime(startDate, startTime),
      endDateTime: mergeDateTime(endDate, endTime),
      labels: [...labels],
    };

    console.log("[v0] Task saved as draft:", formData);
    resetForm();
  };

  const resetForm = () => {
    setShowDetails(false);
    setTaskTitle("");
    setAssignTo("");
    setDescription("");
    setLocation("");
    setStartDate(null);
    setEndDate(null);
    setStartTime("00:00:00");
    setEndTime("00:00:00");
    setLabels("");
    setErrors({});
    setIsSubmitting(false);
  };

  return (
    <Dialog onOpenChange={(open) => !open && resetForm()}>
      <DialogTrigger asChild>{trigger || <Button>New Task</Button>}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[600px] overflow-y-scroll border-none p-0 bg-white">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle className="text-lg font-semibold text-[#4E53B1] flex items-center gap-2">
            <span className="text-[#4E53B1]">+</span>
            New Task
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 pb-6 space-y-4">
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Task Details</h3>
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700 mb-1.5">Project</Label>
            <Select value={projectId} onValueChange={setProjectId}>
              <SelectTrigger className="w-full border border-slate-300">
                <SelectValue placeholder="Select project" />
              </SelectTrigger>
              <SelectContent className="bg-white border-none">
                <SelectItem value="title">Title</SelectItem>
                <SelectItem value="label">Status</SelectItem>
                <SelectItem value="assignedTo">Assignee</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700 mb-1.5">Assign to</Label>
            <Select value={userId} onValueChange={setUserId}>
              <SelectTrigger className="w-full border border-slate-300">
                <SelectValue placeholder="Select user" />
              </SelectTrigger>
              <SelectContent className="bg-white border-none">
                <SelectItem value="title">Title</SelectItem>
                <SelectItem value="label">Status</SelectItem>
                <SelectItem value="assignedTo">Assignee</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="task-title" className="text-sm font-medium text-gray-700">
              Task Title
            </Label>
            <Input
              id="task-title"
              placeholder="Task title"
              value={taskTitle}
              onChange={(e) => {
                setTaskTitle(e.target.value);
                if (errors.taskTitle) {
                  setErrors((prev) => ({ ...prev, taskTitle: "" }));
                }
              }}
              className={cn("border-gray-200", errors.taskTitle && "border-red-500")}
            />
            {errors.taskTitle && <p className="text-sm text-red-500">{errors.taskTitle}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium text-gray-700">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Add description"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (errors.description) {
                  setErrors((prev) => ({ ...prev, description: "" }));
                }
              }}
              className={cn("border-gray-200 min-h-[80px] resize-none", errors.description && "border-red-500")}
            />
            {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-500 cursor-pointer hover:text-gray-700">
            <Paperclip className="h-4 w-4" />
            <span>Attachment</span>
          </div>

          {/* Reusable Start + End DateTime pickers */}
          <DateTimePicker label="Start Date & Time" date={startDate} setDate={setStartDate} time={startTime} setTime={setStartTime} />
          <DateTimePicker label="End Date & Time" date={endDate} setDate={setEndDate} time={endTime} setTime={setEndTime} />

          <div>
            <Label className="text-sm font-medium text-gray-700 mb-1.5">Labels</Label>
            <Select value={userId} onValueChange={setUserId}>
              <SelectTrigger className="w-full border border-slate-300">
                <SelectValue placeholder="Select labels" />
              </SelectTrigger>
              <SelectContent className="bg-white border-none">
                <SelectItem value="LOW">Low</SelectItem>
                <SelectItem value="MEDIUM">Medium</SelectItem>
                <SelectItem value="HIGH">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-between items-center pt-4">
            <div className="flex gap-2">
              <Button className="bg-[#4E53B1] hover:bg-[#4E53B1]/90 text-white" onClick={handlePublishTask} disabled={isSubmitting}>
                {isSubmitting ? "Publishing..." : "Publish Task"}
              </Button>
              <Button variant="outline" className="border-gray-300 bg-transparent" onClick={handleDraftTask} disabled={isSubmitting}>
                Draft Task
              </Button>
            </div>

            {showDetails && (
              <Button
                variant="ghost"
                size="sm"
                className="text-red-500 hover:text-red-600 hover:bg-red-50"
                onClick={resetForm}
                disabled={isSubmitting}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
