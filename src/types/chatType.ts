/* eslint-disable @typescript-eslint/no-explicit-any */
interface TProfile {
  profileUrl: string | null;
  firstName: string;
  lastName: string;
}

interface TUser {
  id: string;
  profile: TProfile;
}

interface TMessage {
  id: string;
  content: string;
  createdAt: string;
  sender: TUser;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  file: any | null;
}

interface TBaseChat {
  chatId: string;
  lastMessage: TMessage;
  updatedAt: string;
}

export interface TTeamChat extends TBaseChat {
  type: "team";
  title: string;
}

export interface TPrivateChat extends TBaseChat {
  online: any;
  unread: any;
  type: "private";
  participant: TUser;
}

export type TChat = TTeamChat | TPrivateChat;

export type TChatList = TChat[];