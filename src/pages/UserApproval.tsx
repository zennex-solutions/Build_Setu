import React, { useEffect, useState } from "react";

type UserStatus = "PENDING" | "APPROVED" | "REJECTED";

interface PendingUser {
  id: string;
  name: string;
  email: string;
  company: string;
  requestedRole: string;
  project: string;
  requestedAt: string;
  status: UserStatus;
}

const UserApproval: React.FC = () => {
  const [users, setUsers] = useState<PendingUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const fetchPendingUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/users/pending");
      if (!response.ok) throw new Error("Failed to load users");

      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError("Unable to fetch pending users");
    } finally {
      setLoading(false);
    }
  };

  const updateUserStatus = async (userId: string, status: UserStatus) => {
    try {
      await fetch(`/api/users/${userId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      setUsers(prev =>
        prev.map(user =>
          user.id === userId ? { ...user, status } : user
        )
      );
    } catch {
      alert("Failed to update user status");
    }
  };

  if (loading) return <p>Loading pending approvals...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: "24px" }}>
      <h2>User Approval</h2>

      {users.length === 0 ? (
        <p>No pending user requests.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Company</th>
              <th>Role</th>
              <th>Project</th>
              <th>Requested</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.company}</td>
                <td>{user.requestedRole}</td>
                <td>{user.project}</td>
                <td>{new Date(user.requestedAt).toLocaleDateString()}</td>
                <td>{user.status}</td>
                <td>
                  {user.status === "PENDING" ? (
                    <>
                      <button
                        onClick={() => updateUserStatus(user.id, "APPROVED")}
                        style={{ marginRight: "8px" }}
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => updateUserStatus(user.id, "REJECTED")}
                      >
                        Reject
                      </button>
                    </>
                  ) : (
                    <span>-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserApproval;
