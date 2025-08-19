// src/types/recognitionTypes.ts

export interface IUser {
  id: string;
  name: string;
  profilePicture?: string;
}

export interface IReply {
  id: string;
  comment: string;
  user: IUser;
  createdAt: string;
}

export interface IComment {
  id: string;
  comment: string;
  user: IUser;
  createdAt: string;
  replies: IReply[];
}

export interface IReaction {
  id: string;
  type: string; // e.g. "LIKE"
  user: IUser;
}

export interface IRecognition {
  id: string;
  badgeId: string;
  message: string;
  visibility: "PUBLIC" | "PRIVATE";
  users: IUser[];
  comments: IComment[];
  reactions: IReaction[];
  createdAt: string;
}

export interface RecognitionApiResponse {
  success: boolean;
  message: string;
  data: IRecognition[];
}
