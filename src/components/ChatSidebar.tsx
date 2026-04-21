import type { ChatRoom, User } from ".././types/chat";
import { getRelativeTime } from ".././utils/time";

type Props = {
  rooms: ChatRoom[];
  activeRoomId: string;
  onSelect: (room: ChatRoom) => void;
  currentUser?: User;
};

const ChatSidebar = ({ rooms, activeRoomId, onSelect, currentUser }: Props) => {
  const getRoomIcon = (room: ChatRoom) => {
    if (room.type === "broadcast" && room.isAdminOnly) return "🔒";
    if (room.type === "broadcast") return "📢";
    if (room.type === "group") return "👥";
    return "💬";
  };

  const getRoomBadge = (room: ChatRoom) => {
    if (room.isAdminOnly && !currentUser?.isAdmin) {
      return (
        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
          View Only
        </span>
      );
    }
    if (room.unreadCount > 0) {
      return (
        <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center animate-pulse">
          {room.unreadCount}
        </span>
      );
    }
    return null;
  };

  const getLastMessagePreview = (room: ChatRoom) => {
    if (room.messages.length === 0) return "No messages yet";
    const lastMessage = room.messages[room.messages.length - 1];
    if (typeof lastMessage.content === "string") {
      return lastMessage.content.substring(0, 50);
    }
    if (lastMessage.content.type === "text") {
      return lastMessage.content.text.substring(0, 50);
    }
    if (lastMessage.content.type === "image") return "📷 Photo";
    if (lastMessage.content.type === "file")
      return `📎 ${lastMessage.content.name}`;
    return "New message";
  };

  const getLastMessageTime = (room: ChatRoom) => {
    if (room.messages.length === 0) return "";
    const lastMessage = room.messages[room.messages.length - 1];
    return getRelativeTime(lastMessage.timestamp);
  };

  return (
    <div className="w-80 bg-white border-r flex flex-col shadow-lg">
      <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-white">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <span className="text-2xl">💬</span>
          Messages
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          {rooms.length} conversation{rooms.length !== 1 && "s"}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto">
        {rooms.map((room) => (
          <button
            key={room.id}
            onClick={() => onSelect(room)}
            className={`w-full text-left p-4 hover:bg-gray-50 transition-all duration-200 border-b ${
              activeRoomId === room.id
                ? "bg-blue-50 border-r-4 border-r-blue-600"
                : "border-gray-100 hover:bg-gray-50"
            }`}
          >
            <div className="flex justify-between items-start gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{getRoomIcon(room)}</span>
                  <h3 className="font-semibold text-gray-800 truncate">
                    {room.name}
                  </h3>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-xs text-gray-500 capitalize px-2 py-0.5 bg-gray-100 rounded-full">
                    {room.type}
                  </p>
                  {room.isAdminOnly && (
                    <span className="text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded-full">
                      Admin Only
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-sm text-gray-500 truncate flex-1">
                    {getLastMessagePreview(room)}
                  </p>
                  {getLastMessageTime(room) && (
                    <span className="text-xs text-gray-400 ml-2 flex-shrink-0">
                      {getLastMessageTime(room)}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex-shrink-0">{getRoomBadge(room)}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChatSidebar;
