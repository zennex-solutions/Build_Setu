import type { ChatType, User } from "../types/chat";


type Props = {
  type: ChatType;
  users: User[];
};

const ParticipantsPanel = ({ type, users }: Props) => {
  return (
    <div className="space-y-2">
      <div className="text-sm font-semibold">
        {type === "direct"
          ? "Direct Chat"
          : type === "group"
          ? "Group Members"
          : "Everyone"}
      </div>

      {users.map(user => (
        <div
          key={user.id}
          className="flex justify-between items-center border p-2 rounded"
        >
          <div>
            <div className="font-medium">{user.name}</div>
            <div className="text-xs text-gray-500">{user.role}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ParticipantsPanel;
