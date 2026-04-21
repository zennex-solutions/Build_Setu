export type User = {
  id: string;
  name: string;
  role?: string;
  avatar?: string;
};

export type ChatType = "direct" | "group" | "broadcast";

export type MessageTarget =
  | { type: "direct"; toUserId: string }
  | { type: "group"; toGroupId: string }
  | { type: "broadcast" };

export type MessageContent =
  | { type: "text"; text: string }
  | { type: "image"; url: string; caption?: string }
  | { type: "file"; url: string; name: string };

export type Message = {
  id: string;
  senderId: string;
  senderDisplayName?: string;

  content: MessageContent | string; // ✅ supports old + new
  timestamp: number | string;

  target: MessageTarget;
};
