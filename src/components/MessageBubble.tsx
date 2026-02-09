import type { Message } from "../types/chat";


type Props = {
  message: Message;
  currentUserId: string;
};

const MessageBubble = ({ message, currentUserId }: Props) => {
  const isMe = message.senderId === currentUserId;

  return (
    <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-xs px-4 py-2 rounded-lg text-sm ${
          isMe
            ? "bg-blue-600 text-white"
            : "bg-gray-200 text-gray-800"
        }`}
      >
        {!isMe && (
          <div className="text-xs font-semibold mb-1">
            {message.senderName}
            {message.target.type === "broadcast" && " (Broadcast)"}
          </div>
        )}

        {message.content}

        <div className="text-[10px] opacity-70 mt-1 text-right">
          {message.timestamp}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
