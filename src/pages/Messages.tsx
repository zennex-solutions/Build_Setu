import { useState, useEffect } from "react";
import ChatSidebar from "../components/ChatSidebar";
import ChatWindow from "../components/ChatWindow";
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
        senderDisplayName: "Project Manager",
        content: "Morning team, site update?",
        timestamp: Date.now(),
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
  // ✅ Load from localStorage
  const [rooms, setRooms] = useState<ChatRoom[]>(() => {
    const stored = localStorage.getItem("chat_rooms");
    return stored ? JSON.parse(stored) : initialRooms;
  });

  const [activeRoomId, setActiveRoomId] = useState<string>(() => {
    const stored = localStorage.getItem("active_room_id");
    return stored || initialRooms[0].id;
  });

  // ✅ Always derive active room
  const activeRoom = rooms.find((r) => r.id === activeRoomId) || rooms[0];

  // ✅ Persist rooms
  useEffect(() => {
    localStorage.setItem("chat_rooms", JSON.stringify(rooms));
  }, [rooms]);

  // ✅ Persist active room
  useEffect(() => {
    localStorage.setItem("active_room_id", activeRoomId);
  }, [activeRoomId]);

  // Select room
  const handleSelectRoom = (room: ChatRoom) => {
    setActiveRoomId(room.id);

    setRooms((prev) =>
      prev.map((r) => (r.id === room.id ? { ...r, unreadCount: 0 } : r)),
    );
  };

  // Send message
  const handleSendMessage = (message: Message) => {
    setRooms((prev) =>
      prev.map((room) =>
        room.id === activeRoomId
          ? { ...room, messages: [...room.messages, message] }
          : room,
      ),
    );
  };

  // Users not in current room
  const availableUsers = users.filter(
    (u) => !activeRoom.participants.some((p) => p.id === u.id),
  );

  // Add participants
  const handleAddParticipants = () => {
    if (!selectedUsers.length) return;

    const newUsers = users.filter((u) => selectedUsers.includes(u.id));

    setRooms((prev) =>
      prev.map((room) => {
        if (room.id !== activeRoomId) return room;

        const existingIds = room.participants.map((p) => p.id);

        return {
          ...room,
          participants: [
            ...room.participants,
            ...newUsers.filter((u) => !existingIds.includes(u.id)),
          ],
        };
      }),
    );

    setSelectedUsers([]);
    setParticipantsOpen(false);
  };

  const [participantsOpen, setParticipantsOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  return (
    <div className="h-[calc(100vh-64px)] flex bg-gray-100">
      {/* Sidebar */}
      <ChatSidebar
        rooms={rooms}
        activeRoomId={activeRoom.id}
        onSelect={handleSelectRoom}
      />

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b p-4 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold">{activeRoom.name}</h2>
            <p className="text-sm text-gray-500 capitalize">
              {activeRoom.type} chat • {activeRoom.participants.length}{" "}
              participants
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

      {/* Participants Modal */}
      <DialogComponent
        visible={participantsOpen}
        width="400px"
        header="Manage Participants"
        isModal
        showCloseIcon
        close={() => setParticipantsOpen(false)}
      >
        <div className="p-4">
          {/* Current */}
          <h3 className="font-semibold mb-2">Current Participants</h3>
          <div className="mb-4 space-y-1">
            {activeRoom.participants.map((user) => (
              <div key={user.id} className="text-sm">
                {user.name}
              </div>
            ))}
          </div>

          {/* Add */}
          {activeRoom.type === "direct" ? (
            <p className="text-sm text-gray-500">
              Cannot add participants to direct chat
            </p>
          ) : (
            <>
              <h3 className="font-semibold mb-2">Add Participants</h3>

              {availableUsers.length === 0 ? (
                <p className="text-sm text-gray-500">No users available</p>
              ) : (
                <div className="space-y-2">
                  {availableUsers.map((user) => (
                    <label key={user.id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => {
                          setSelectedUsers((prev) =>
                            prev.includes(user.id)
                              ? prev.filter((id) => id !== user.id)
                              : [...prev, user.id],
                          );
                        }}
                      />
                      {user.name}
                    </label>
                  ))}
                </div>
              )}

              <div className="flex justify-end mt-4">
                <button
                  onClick={handleAddParticipants}
                  className="bg-blue-600 text-white px-3 py-1 rounded"
                >
                  Add Selected
                </button>
              </div>
            </>
          )}
        </div>
      </DialogComponent>
    </div>
  );
};

export default MessagesPage;
