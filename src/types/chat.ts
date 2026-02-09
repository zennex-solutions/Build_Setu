export type User = {
  id: string;
  name: string;
  role?: string;
  avatar?: string;
};

export type ChatType = "direct" | "group" | "broadcast";

export type Message = {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  target: {
    type: ChatType;
    toUserId?: string;     // direct
    toGroupId?: string;    // group
    toAll?: boolean;       // broadcast
  };
};

export type ChatRoom = {
  id: string;
  name: string;
  type: ChatType;
  participants: User[];
  unreadCount: number;
  messages: Message[];
};
