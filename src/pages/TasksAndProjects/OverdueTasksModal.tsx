import type React from "react";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { X, MessageCircle } from "lucide-react";
import { UserAvatar } from "./UserAvatar";
import { formatCustomDate } from "./TaskRow";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// interface OverdueTask {
//   id: string;
//   projectName: string;
//   dueDate: string;
//   dueTime: string;
//   label: string;
//   assignedTo: {
//     name: string;
//     avatar: string;
//   };
//   comments: number;
// }

interface OverdueTasksModalProps {
  overDueTasks: any;
}

export function OverdueTasksModal({ overDueTasks }: OverdueTasksModalProps) {
  // Mock overdue tasks data
  // const overdueTasks: OverdueTask[] = [
  //   {
  //     id: "1",
  //     projectName: "Metro Shopping Center",
  //     dueDate: "Due Jun 22",
  //     dueTime: "at 11:00 am",
  //     label: "General",
  //     assignedTo: {
  //       name: "Jane Cooper",
  //       avatar: "/diverse-group.png",
  //     },
  //     comments: 0,
  //   },
  //   {
  //     id: "2",
  //     projectName: "Riverside Apartments",
  //     dueDate: "Due Jun 30",
  //     dueTime: "at 10:00 am",
  //     label: "General",
  //     assignedTo: {
  //       name: "Wade Warren",
  //       avatar: "/diverse-group.png",
  //     },
  //     comments: 0,
  //   },
  //   {
  //     id: "3",
  //     projectName: "Tech Campus Phase 2",
  //     dueDate: "Due Jun 26",
  //     dueTime: "at 09:45 am",
  //     label: "General",
  //     assignedTo: {
  //       name: "Jane Cooper",
  //       avatar: "/diverse-group.png",
  //     },
  //     comments: 0,
  //   },
  // ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <p className="text-red-500 px-3 py-2 rounded-full bg-[#FFE6E7] flex items-center gap-1 cursor-pointer">
          <span className="bg-red-500 rounded-full w-4 h-4 text-white flex items-center justify-center text-sm font-medium">
            {overDueTasks?.length}
          </span>
          <span className="text-sm font-medium">Overdue tasks</span>
        </p>
      </DialogTrigger>
      <DialogContent className="max-w-md p-0 bg-white">
        <DialogHeader className="p-4 pb-2">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold text-[#4E53B1] flex items-center gap-2">Overdue Tasks</DialogTitle>
          </div>
        </DialogHeader>

        <div className="px-4 pb-4 space-y-3">
          {overDueTasks?.map((task: any) => (
            <div key={task?.id} className="border border-gray-200 rounded p-3 space-y-2">
              <div className="font-semibold text-gray-900">{task?.title}</div>

              <div className="flex items-center justify-between gap-2">
                <span className="text-red-600 font-medium">Due {formatCustomDate(task?.endTime)}</span>
                <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-medium">{task?.labels}...</span>
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage
                      src={task?.tasksUsers[0]?.user?.profile?.profileUrl || "/placeholder.svg"}
                      alt={task?.tasksUsers[0]?.user?.profile?.firstName}
                    />
                    <AvatarFallback className="text-xs border-2 rounded-full border-slate-300">{"DP"}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-gray-900">{task?.tasksUsers[0]?.user?.profile?.firstName}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                {/* <div className="flex items-center gap-1 text-gray-500">
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-sm">{task.comments} Comments</span>
                </div> */}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
