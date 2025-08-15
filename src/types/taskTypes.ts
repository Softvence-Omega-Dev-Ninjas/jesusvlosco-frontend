/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IAssignedUser {
  name: string;
  avatar: string;
}

export interface ITask {
  id: string;
  name: string;
  status: "Open" | "Draft" | "Done";
  label: string;
  startTime: string;
  dueDate: string;
  assignedTo: IAssignedUser;
  title?: string;
}

export interface IProject {
  id: string;
  name: string;
  tasks: ITask[];
  // assignedTo?: IAssignedUser;
  assignedTo?: any;
}

export type GroupByOption = "title" | "label" | "assignedTo";
export type ActiveTab = "tasks" | "open" | "done";
export type ViewMode = "list" | "dates";
