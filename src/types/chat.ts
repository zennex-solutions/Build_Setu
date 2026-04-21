export type User = {
  id: string;
  name: string;
  role?: string;
  avatar?: string;
  isAdmin?: boolean;
  status?: "online" | "offline" | "away";
};

export type ChatType = "direct" | "group" | "broadcast";

export type MessageTarget =
  | { type: "direct"; toUserId: string }
  | { type: "group"; toGroupId: string }
  | { type: "broadcast" };

export type MessageContent =
  | { type: "text"; text: string }
  | { type: "image"; url: string; caption?: string }
  | { type: "file"; url: string; name: string; size?: number };

export type Message = {
  id: string;
  senderId: string;
  senderDisplayName?: string;
  senderAvatar?: string;
  content: MessageContent | string;
  timestamp: number | string;
  target: MessageTarget;
  isRead?: boolean;
  delivered?: boolean;
};

export type ChatRoom = {
  id: string;
  name: string;
  type: ChatType;
  participants: User[];
  unreadCount: number;
  messages: Message[];
  isAdminOnly?: boolean;
  avatar?: string;
  lastMessage?: Message;
  createdAt?: number;
};
