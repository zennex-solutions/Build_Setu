import { useState } from "react";
import ChatSidebar from "../components/ChatSidebar";
import ChatWindow from "../components/ChatWindow";
import ParticipantsPanel from "../components/ParticipantsPanel";
import { DialogComponent } from "@syncfusion/ej2-react-popups";
import type { ChatRoom, Message, User } from "../types/chat";

// Mock users
const users: User[] = [
  { id: "u1", name: "Project Manager", role: "PM" },
  { id: "u2", name: "Site Engineer", role: "Engineer" },
  { id: "u3", name: "Procurement Officer", role: "Procurement" },
];

// Initial rooms
const initialRooms: ChatRoom[] = [
  {
    id: "dm-u2",
    name: "Site Engineer",
    type: "direct",
    participants: [users[1]],
    unreadCount: 0,
    messages: [],
  },
  {
    id: "grp-project-alpha",
    name: "Project Alpha Team",
    type: "group",
    participants: users,
    unreadCount: 1,
    messages: [
      {
        id: "m1",
        senderId: "u1",
        senderName: "Project Manager",
        content: "Morning team, site update?",
        timestamp: "09:00 AM",
        target: { type: "group", toGroupId: "grp-project-alpha" },
      },
    ],
  },
  {
    id: "broadcast-meeting",
    name: "Weekly Coordination (All)",
    type: "broadcast",
    participants: users,
    unreadCount: 0,
    messages: [],
  },
];

const CURRENT_USER_ID = "u1";

const MessagesPage = () => {
  const [rooms, setRooms] = useState<ChatRoom[]>(initialRooms);
  const [activeRoom, setActiveRoom] = useState<ChatRoom>(initialRooms[0]);
  const [participantsOpen, setParticipantsOpen] = useState(false);

  const handleSelectRoom = (room: ChatRoom) => {
    setActiveRoom(room);
    setRooms(prev =>
      prev.map(r =>
        r.id === room.id ? { ...r, unreadCount: 0 } : r
      )
    );
  };

  const handleSendMessage = (message: Message) => {
    setRooms(prev =>
      prev.map(room =>
        room.id === activeRoom.id
          ? { ...room, messages: [...room.messages, message] }
          : room
      )
    );

    setActiveRoom(prev => ({
      ...prev,
      messages: [...prev.messages, message],
    }));
  };

  return (
    <div className="h-[calc(100vh-64px)] flex bg-gray-100">
      {/* Sidebar */}
      <ChatSidebar
        rooms={rooms}
        activeRoomId={activeRoom.id}
        onSelect={handleSelectRoom}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b p-4 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold">{activeRoom.name}</h2>
            <p className="text-sm text-gray-500 capitalize">
              {activeRoom.type} chat
            </p>
          </div>

          <button
            className="text-blue-600 hover:underline"
            onClick={() => setParticipantsOpen(true)}
          >
            Participants
          </button>
        </div>

        {/* Chat Window */}
        <ChatWindow
          room={activeRoom}
          currentUserId={CURRENT_USER_ID}
          onSend={handleSendMessage}
        />
      </div>

      {/* Participants Dialog */}
      <DialogComponent
        visible={participantsOpen}
        width="400px"
        header="Participants"
        isModal
        showCloseIcon
        close={() => setParticipantsOpen(false)}
      >
        <div className="p-4">
          <ParticipantsPanel
            type={activeRoom.type}
            users={activeRoom.participants}
          />
        </div>
      </DialogComponent>
    </div>
  );
};

export default MessagesPage;
