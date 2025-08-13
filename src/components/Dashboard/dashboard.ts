export interface Employee {
  id: string;
  name: string;
  role: string;
  avatar: string;
  project: string;
  shift: string;
  date: string;
  time: string;
}

export interface TimeOffRequest {
  id: string;
  name: string;
  avatar: string;
  type: string;
  date: string;
  status: "pending" | "approved" | "declined";
}

export interface ChatMessage {
  id: string;
  name: string;
  avatar: string;
  imageUrl: string;
  message: string;
  time: string;
  unreadCount: number;
  isActive: boolean;
}

export interface Recognition {
  id: string;
  from: string;
  avatar: string;
  type: string;
  message: string;
  viewer: string;
}

export interface Achievement {
  id: string;
  title: string;
  date: string;
  recipient: string;
}
