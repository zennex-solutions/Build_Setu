import { useState } from "react";
import type { Message } from ".././types/chat";
import { formatMessageTime } from ".././utils/time";

type Props = {
  message: Message;
  currentUserId: string;
};

const MessageBubble = ({ message, currentUserId }: Props) => {
  const isMe = message.senderId === currentUserId;
  const [imageLoaded, setImageLoaded] = useState(false);

  const renderContent = () => {
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
            {!imageLoaded && (
              <div className="w-full h-40 bg-gray-200 rounded-lg animate-pulse"></div>
            )}
            <img
              src={message.content.url}
              alt="sent"
              className={`rounded-lg max-w-full mb-1 max-h-64 object-cover ${
                !imageLoaded ? "hidden" : ""
              }`}
              onLoad={() => setImageLoaded(true)}
            />
            {message.content.caption && (
              <div className="text-sm mt-1">{message.content.caption}</div>
            )}
          </div>
        );

      case "file":
        const fileSize = message.content.size
          ? `${(message.content.size / 1024 / 1024).toFixed(2)} MB`
          : "";
        return (
          <a
            href={message.content.url}
            target="_blank"
            rel="noopener noreferrer"
            className="underline flex items-center gap-2 hover:text-blue-600 transition-colors"
          >
            <span className="text-2xl">📎</span>
            <div>
              <div className="font-medium">{message.content.name}</div>
              {fileSize && <div className="text-xs opacity-70">{fileSize}</div>}
            </div>
          </a>
        );

      default:
        return <div>Unsupported message</div>;
    }
  };

  return (
    <div className={`flex mb-3 ${isMe ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[70%] px-4 py-2 rounded-lg shadow-sm transition-all ${
          isMe
            ? "bg-blue-600 text-white rounded-br-none"
            : "bg-white text-gray-800 rounded-bl-none border border-gray-200"
        }`}
      >
        {!isMe && (
          <div className="flex items-center gap-2 mb-1">
            {message.senderAvatar && (
              <span className="text-sm">{message.senderAvatar}</span>
            )}
            <div className="text-xs font-semibold text-blue-600">
              {message.senderDisplayName || "Unknown"}
              {message.target.type === "broadcast" && (
                <span className="ml-1 text-xs font-normal">(Broadcast)</span>
              )}
            </div>
          </div>
        )}

        {renderContent()}

        <div
          className={`text-[10px] mt-1 flex items-center justify-end gap-1 ${
            isMe ? "text-blue-100" : "text-gray-400"
          }`}
        >
          <span>{formatMessageTime(message.timestamp)}</span>
          {isMe && message.delivered && <span className="text-xs">✓✓</span>}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
