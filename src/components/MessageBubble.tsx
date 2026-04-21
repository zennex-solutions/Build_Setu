import type { Message } from "../types/chat";
import { formatMessageTime } from "../Utils/time";

type Props = {
  message: Message;
  currentUserId: string;
};

const MessageBubble = ({ message, currentUserId }: Props) => {
  const isMe = message.senderId === currentUserId;

  const renderContent = () => {
    // ✅ backward compatibility
    if (typeof message.content === "string") {
      return (
        <div className="whitespace-pre-wrap break-words">{message.content}</div>
      );
    }

    switch (message.content.type) {
      case "text":
        return (
          <div className="whitespace-pre-wrap break-words">
            {message.content.text}
          </div>
        );

      case "image":
        return (
          <div>
            <img
              src={message.content.url}
              alt="sent"
              className="rounded-lg max-w-full mb-1"
            />
            {message.content.caption && (
              <div className="text-sm">{message.content.caption}</div>
            )}
          </div>
        );

      case "file":
        return (
          <a
            href={message.content.url}
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            📎 {message.content.name}
          </a>
        );

      default:
        return <div>Unsupported message</div>;
    }
  };

  return (
    <div className={`flex mb-2 ${isMe ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-xs px-4 py-2 rounded-lg text-sm shadow ${
          isMe ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"
        }`}
      >
        {!isMe && (
          <div className="text-xs font-semibold mb-1">
            {message.senderDisplayName || "Unknown"}
            {message.target.type === "broadcast" && " (Broadcast)"}
          </div>
        )}

        {renderContent()}

        <div className="text-[10px] opacity-70 mt-1 text-right">
          {formatMessageTime(message.timestamp)}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
