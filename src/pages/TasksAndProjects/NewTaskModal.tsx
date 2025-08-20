import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, X, Paperclip, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface NewTaskModalProps {
  trigger?: React.ReactNode;
}

interface TaskFormData {
  taskTitle: string;
  assignTo: string;
  description: string;
  location: string;
  startDate: Date | undefined;
  dueDate: Date | undefined;
  startTime: string;
  dueTime: string;
  labels: string[];
  attachment?: File;
}

export function NewTaskModal({ trigger }: NewTaskModalProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [startDate, setStartDate] = useState<Date>();
  const [dueDate, setDueDate] = useState<Date>();
  const [startTime, setStartTime] = useState("8:00 am");
  const [dueTime, setDueTime] = useState("8:00 am");
  const [labels, setLabels] = useState(["General Tasks"]);
  const [taskTitle, setTaskTitle] = useState("");
  const [assignTo, setAssignTo] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const removeLabel = (labelToRemove: string) => {
    setLabels(labels.filter((label) => label !== labelToRemove));
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
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    const formData: TaskFormData = {
      taskTitle: taskTitle.trim(),
      assignTo: assignTo.trim(),
      description: description.trim(),
      location: location.trim(),
      startDate,
      dueDate,
      startTime,
      dueTime,
      labels: [...labels],
    };

    try {
      console.log("[v0] Task Form Data:", formData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      resetForm();

      // You can add success notification here
      console.log("[v0] Task published successfully!");
    } catch (error) {
      console.error("[v0] Error publishing task:", error);
      // You can add error notification here
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
      startDate,
      dueDate,
      startTime,
      dueTime,
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
    setStartDate(undefined);
    setDueDate(undefined);
    setStartTime("8:00 am");
    setDueTime("8:00 am");
    setLabels(["General Tasks"]);
    setErrors({});
    setIsSubmitting(false);
  };

  return (
    <Dialog onOpenChange={(open) => !open && resetForm()}>
      <DialogTrigger asChild>{trigger || <Button>New Task</Button>}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px] p-0 bg-white">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle className="text-lg font-semibold text-[#4E53B1] flex items-center gap-2">
            <span className="text-[#4E53B1]">+</span>
            New Task
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 pb-6 space-y-4">
          {/* {showDetails && ( */}
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Task Details</h3>
          </div>
          {/* )} */}

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

          {/* {showDetails && ( */}
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
          {/* )} */}

          {/* {showDetails && ( */}
          <div className="flex items-center gap-2 text-sm text-gray-500 cursor-pointer hover:text-gray-700">
            <Paperclip className="h-4 w-4" />
            <span>Attachment</span>
          </div>
          {/* )} */}

          {/* {showDetails && ( */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Start Date</Label>
              <div className="flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn("flex-1 justify-start text-left font-normal border-gray-200", !startDate && "text-muted-foreground")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "dd/MM/yyyy") : "23/06/2025"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                  </PopoverContent>
                </Popover>
                <Select value={startTime} onValueChange={setStartTime}>
                  <SelectTrigger className="w-24 border-gray-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="8:00 am">8:00 am</SelectItem>
                    <SelectItem value="9:00 am">9:00 am</SelectItem>
                    <SelectItem value="10:00 am">10:00 am</SelectItem>
                    <SelectItem value="11:00 am">11:00 am</SelectItem>
                    <SelectItem value="12:00 pm">12:00 pm</SelectItem>
                    <SelectItem value="1:00 pm">1:00 pm</SelectItem>
                    <SelectItem value="2:00 pm">2:00 pm</SelectItem>
                    <SelectItem value="3:00 pm">3:00 pm</SelectItem>
                    <SelectItem value="4:00 pm">4:00 pm</SelectItem>
                    <SelectItem value="5:00 pm">5:00 pm</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="ghost" size="sm" className="px-2">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Due Date</Label>
              <div className="flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn("flex-1 justify-start text-left font-normal border-gray-200", !dueDate && "text-muted-foreground")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dueDate ? format(dueDate, "dd/MM/yyyy") : "23/06/2025"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={dueDate} onSelect={setDueDate} initialFocus />
                  </PopoverContent>
                </Popover>
                <Select value={dueTime} onValueChange={setDueTime}>
                  <SelectTrigger className="w-24 border-gray-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="8:00 am">8:00 am</SelectItem>
                    <SelectItem value="9:00 am">9:00 am</SelectItem>
                    <SelectItem value="10:00 am">10:00 am</SelectItem>
                    <SelectItem value="11:00 am">11:00 am</SelectItem>
                    <SelectItem value="12:00 pm">12:00 pm</SelectItem>
                    <SelectItem value="1:00 pm">1:00 pm</SelectItem>
                    <SelectItem value="2:00 pm">2:00 pm</SelectItem>
                    <SelectItem value="3:00 pm">3:00 pm</SelectItem>
                    <SelectItem value="4:00 pm">4:00 pm</SelectItem>
                    <SelectItem value="5:00 pm">5:00 pm</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="ghost" size="sm" className="px-2">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          {/* )} */}

          {/* {showDetails && ( */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Labels</Label>
            <div className="flex flex-wrap gap-2">
              {labels.map((label, index) => (
                <span key={index} className="bg-purple-100 text-purple-700 hover:bg-purple-200 flex items-center gap-1">
                  {label}
                  <button onClick={() => removeLabel(label)} className="ml-1 hover:bg-purple-300 rounded-full p-0.5">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
          {/* )} */}

          {/* {!showDetails && ( */}
          <div className="space-y-2">
            <Label htmlFor="assign-to" className="text-sm font-medium text-gray-700">
              Assign to
            </Label>
            <Input id="assign-to" placeholder="Assign" value={assignTo} onChange={(e) => setAssignTo(e.target.value)} className="border-gray-200" />
          </div>
          {/* )} */}

          {/* {!showDetails && (
            <button onClick={() => setShowDetails(true)} className="text-[#4E53B1] text-sm font-medium hover:underline flex items-center gap-1">
              <span className="text-[#4E53B1]">+</span>
              Add more details
            </button>
          )} */}

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
