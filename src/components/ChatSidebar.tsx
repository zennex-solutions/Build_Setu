import type { ChatRoom } from "../types/chat";


type Props = {
  rooms: ChatRoom[];
  activeRoomId?: string;
  onSelect: (room: ChatRoom) => void;
};

const ChatSidebar = ({ rooms, activeRoomId, onSelect }: Props) => {
  return (
    <div className="w-80 bg-white border-r flex flex-col">
      <div className="p-4 border-b font-bold text-lg">Messages</div>

      <div className="flex-1 overflow-y-auto">
        {rooms.map(room => (
          <div
            key={room.id}
            onClick={() => onSelect(room)}
            className={`p-4 cursor-pointer border-b hover:bg-gray-50 ${
              activeRoomId === room.id ? "bg-gray-100" : ""
            }`}
          >
            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium">{room.name}</div>
                <div className="text-xs text-gray-500 capitalize">
                  {room.type} chat
                </div>
              </div>

              {room.unreadCount > 0 && (
                <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full">
                  {room.unreadCount}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatSidebar;
