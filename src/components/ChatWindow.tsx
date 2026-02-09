import { useState } from "react";
import type { ChatRoom, Message } from "../types/chat";
import MessageBubble from "./MessageBubble";

type Props = {
  room: ChatRoom;
  currentUserId: string;
  onSend: (message: Message) => void;
};

const ChatWindow = ({ room, currentUserId, onSend }: Props) => {
  const [text, setText] = useState("");

  const sendMessage = () => {
    if (!text.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      senderId: currentUserId,
      senderName: "You",
      content: text,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      target: {
        type: room.type,
        toUserId: room.type === "direct" ? room.participants[0]?.id : undefined,
        toGroupId: room.type === "group" ? room.id : undefined,
        toAll: room.type === "broadcast",
      },
    };

    onSend(message);
    setText("");
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {room.messages.map(msg => (
          <MessageBubble
            key={msg.id}
            message={msg}
            currentUserId={currentUserId}
          />
        ))}
      </div>

      <div className="border-t p-4 flex gap-2">
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendMessage()}
          placeholder={
            room.type === "broadcast"
              ? "Message everyone..."
              : "Type a message..."
          }
          className="flex-1 border rounded px-3 py-2"
        />
        <button
          onClick={sendMessage}
          className="bg-[var(--bs-primary)] text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
