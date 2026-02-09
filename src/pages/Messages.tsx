// import { useState } from "react";
// import { DialogComponent } from "@syncfusion/ej2-react-popups";

// type Message = {
//   id: number;
//   sender: string;
//   text: string;
//   time: string;
//   isMe?: boolean;
// };

// type ChatRoom = {
//   id: number;
//   name: string;
//   type: "project" | "meeting";
//   unread: number;
//   messages: Message[];
// };

// const initialChats: ChatRoom[] = [
//   {
//     id: 1,
//     name: "Project Alpha – Site Team",
//     type: "project",
//     unread: 2,
//     messages: [
//       { id: 1, sender: "Engineer", text: "Foundation work starts tomorrow.", time: "09:10 AM" },
//       { id: 2, sender: "You", text: "Materials are ready on site.", time: "09:12 AM", isMe: true },
//     ],
//   },
//   {
//     id: 2,
//     name: "Weekly Coordination Meeting",
//     type: "meeting",
//     unread: 0,
//     messages: [
//       { id: 1, sender: "PM", text: "Please share progress updates.", time: "Yesterday 4:30 PM" },
//     ],
//   },
// ];

// const MessagesPage = () => {
//   const [chats, setChats] = useState<ChatRoom[]>(initialChats);
//   const [activeChat, setActiveChat] = useState<ChatRoom | null>(chats[0]);
//   const [newMessage, setNewMessage] = useState("");
//   const [participantsOpen, setParticipantsOpen] = useState(false);

//   const sendMessage = () => {
//     if (!newMessage.trim() || !activeChat) return;

//     const message: Message = {
//       id: Date.now(),
//       sender: "You",
//       text: newMessage,
//       time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
//       isMe: true,
//     };

//     setChats(prev =>
//       prev.map(chat =>
//         chat.id === activeChat.id
//           ? { ...chat, messages: [...chat.messages, message] }
//           : chat
//       )
//     );

//     setActiveChat(prev =>
//       prev ? { ...prev, messages: [...prev.messages, message] } : prev
//     );

//     setNewMessage("");
//   };

//   return (
//     <div className="h-[calc(100vh-64px)] bg-gray-100 flex">
//       {/* Sidebar */}
//       <div className="w-80 bg-white border-r flex flex-col">
//         <div className="p-4 border-b">
//           <h2 className="text-xl font-bold">Messages</h2>
//         </div>

//         <div className="flex-1 overflow-y-auto">
//           {chats.map(chat => (
//             <div
//               key={chat.id}
//               onClick={() => {
//                 setActiveChat(chat);
//                 chat.unread = 0;
//               }}
//               className={`p-4 cursor-pointer border-b hover:bg-gray-50 ${
//                 activeChat?.id === chat.id ? "bg-gray-100" : ""
//               }`}
//             >
//               <div className="flex justify-between items-center">
//                 <div>
//                   <div className="font-medium">{chat.name}</div>
//                   <div className="text-xs text-gray-500">
//                     {chat.type === "meeting" ? "Meeting Chat" : "Project Chat"}
//                   </div>
//                 </div>
//                 {chat.unread > 0 && (
//                   <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full">
//                     {chat.unread}
//                   </span>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Chat Window */}
//       <div className="flex-1 flex flex-col">
//         {/* Header */}
//         <div className="bg-white p-4 border-b flex justify-between items-center">
//           <div>
//             <h3 className="font-semibold text-lg">{activeChat?.name}</h3>
//             <p className="text-sm text-gray-500">Meeting chat</p>
//           </div>
//           <button
//             className="text-blue-600 hover:underline"
//             onClick={() => setParticipantsOpen(true)}
//           >
//             Participants
//           </button>
//         </div>

//         {/* Messages */}
//         <div className="flex-1 overflow-y-auto p-4 space-y-3">
//           {activeChat?.messages.map(msg => (
//             <div
//               key={msg.id}
//               className={`flex ${msg.isMe ? "justify-end" : "justify-start"}`}
//             >
//               <div
//                 className={`max-w-xs px-4 py-2 rounded-lg text-sm ${
//                   msg.isMe
//                     ? "bg-blue-600 text-white"
//                     : "bg-gray-200 text-gray-800"
//                 }`}
//               >
//                 {!msg.isMe && (
//                   <div className="text-xs font-semibold mb-1">{msg.sender}</div>
//                 )}
//                 {msg.text}
//                 <div className="text-[10px] opacity-70 mt-1 text-right">
//                   {msg.time}
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Input */}
//         <div className="bg-white p-4 border-t flex gap-2">
//           <input
//             value={newMessage}
//             onChange={e => setNewMessage(e.target.value)}
//             onKeyDown={e => e.key === "Enter" && sendMessage()}
//             placeholder="Type a message..."
//             className="flex-1 border rounded-lg px-3 py-2 focus:outline-none"
//           />
//           <button
//             onClick={sendMessage}
//             className="bg-[var(--bs-primary)] text-white px-4 py-2 rounded-lg"
//           >
//             Send
//           </button>
//         </div>
//       </div>

//       {/* Participants Dialog */}
//       <DialogComponent
//         visible={participantsOpen}
//         width="400px"
//         header="Participants"
//         isModal
//         showCloseIcon
//         close={() => setParticipantsOpen(false)}
//       >
//         <div className="p-4 space-y-2">
//           <div className="border p-2 rounded">Project Manager</div>
//           <div className="border p-2 rounded">Site Engineer</div>
//           <div className="border p-2 rounded">Procurement Officer</div>
//         </div>
//       </DialogComponent>
//     </div>
//   );
// };

// export default MessagesPage;





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
