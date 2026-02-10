import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface User {
  id: number;
  Username: string;
  Email: string;
  Role: string;
  Status: "PENDING" | "APPROVED" | "REJECTED";
  created_at: string;
  is_active: number;
}

const UserApproval: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [filter, setFilter] = useState<"ALL" | "PENDING" | "APPROVED" | "REJECTED">("ALL");
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    active: 0
  });

  useEffect(() => {
    // Get current user from localStorage
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setCurrentUser(parsedUser);
      
      // Check if user is SUPER_ADMIN
      if (parsedUser.role !== "SUPER_ADMIN") {
        setError("Access denied. Only SUPER_ADMIN can access this page.");
        setLoading(false);
        return;
      }
    } else {
      setError("You must be logged in to access this page.");
      setLoading(false);
      return;
    }
    
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch("http://localhost:5000/api/admin/users");
      if (!response.ok) {
        throw new Error(`Failed to load users: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setUsers(data.users || []);
        calculateStats(data.users || []);
      } else {
        throw new Error(data.message || "Failed to fetch users");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to fetch users");
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (usersList: User[]) => {
    const stats = {
      total: usersList.length,
      pending: usersList.filter(u => u.Status === "PENDING").length,
      approved: usersList.filter(u => u.Status === "APPROVED").length,
      rejected: usersList.filter(u => u.Status === "REJECTED").length,
      active: usersList.filter(u => u.is_active === 1).length
    };
    setStats(stats);
  };

  const updateUserStatus = async (userId: number, status: "APPROVED" | "REJECTED") => {
    if (!currentUser) {
      alert("You must be logged in as admin to perform this action");
      return;
    }

    const action = status === "APPROVED" ? "approve" : "reject";
    const confirmed = window.confirm(
      `Are you sure you want to ${action} this user?`
    );
    
    if (!confirmed) return;

    try {
      const response = await fetch(`http://localhost:5000/api/admin/users/${userId}/status`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          status, 
          adminId: currentUser.id 
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        // Update local state
        const updatedUsers = users.map(user =>
          user.id === userId ? { ...user, Status: status } : user
        );
        setUsers(updatedUsers);
        calculateStats(updatedUsers);
        
        alert(`User ${status.toLowerCase()} successfully!`);
      } else {
        alert(`Failed to update user: ${data.message}`);
      }
    } catch (err) {
      console.error("Error updating user status:", err);
      alert("Failed to update user status. Please try again.");
    }
  };

  const toggleUserActiveStatus = async (userId: number, currentStatus: number) => {
    if (!currentUser) {
      alert("You must be logged in as admin to perform this action");
      return;
    }

    const newStatus = currentStatus === 1 ? 0 : 1;
    const action = newStatus === 1 ? "activate" : "deactivate";
    const confirmed = window.confirm(
      `Are you sure you want to ${action} this user?`
    );
    
    if (!confirmed) return;

    try {
      const response = await fetch(`http://localhost:5000/api/admin/users/${userId}/active`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          is_active: newStatus,
          adminId: currentUser.id 
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        // Update local state
        const updatedUsers = users.map(user =>
          user.id === userId ? { ...user, is_active: newStatus } : user
        );
        setUsers(updatedUsers);
        calculateStats(updatedUsers);
        
        alert(`User ${action}d successfully!`);
      } else {
        alert(`Failed to update user: ${data.message}`);
      }
    } catch (err) {
      console.error("Error updating user active status:", err);
      alert("Failed to update user status. Please try again.");
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
      APPROVED: "bg-green-100 text-green-800 border-green-200",
      REJECTED: "bg-red-100 text-red-800 border-red-200"
    };
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${styles[status as keyof typeof styles]}`}>
        {status}
      </span>
    );
  };

  const getRoleBadge = (role: string) => {
    const roleColors: Record<string, string> = {
      "SUPER_ADMIN": "bg-purple-100 text-purple-800 border-purple-200",
      "PROJECT_MANAGER": "bg-blue-100 text-blue-800 border-blue-200",
      "SITE_ENGINEER": "bg-cyan-100 text-cyan-800 border-cyan-200",
      "SUPERVISOR": "bg-orange-100 text-orange-800 border-orange-200",
      "ACCOUNTANT": "bg-emerald-100 text-emerald-800 border-emerald-200",
      "CONTRACTOR": "bg-amber-100 text-amber-800 border-amber-200",
      "CLIENT": "bg-gray-100 text-gray-800 border-gray-200"
    };
    
    return (
      <span className={`px-3 py-1 rounded text-xs font-medium border ${roleColors[role] || "bg-gray-100 text-gray-800 border-gray-200"}`}>
        {role.replace("_", " ")}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  const filteredUsers = users.filter(user => {
    if (filter === "ALL") return true;
    return user.Status === filter;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading user approvals...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center">
              <svg className="w-6 h-6 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-lg font-medium text-red-800">Access Error</h3>
            </div>
            <p className="mt-2 text-red-700">{error}</p>
            <div className="mt-4">
              <button
                onClick={() => navigate("/login")}
                className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Go to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                User Approval Management
              </h1>
              <p className="text-gray-600 mt-2">
                Welcome, {currentUser?.username} (SUPER_ADMIN)
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-3">
              <button
                onClick={fetchUsers}
                className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
              <button
                onClick={() => navigate("/dashboard")}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Back to Dashboard
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-sm text-gray-500">Total Users</div>
              <div className="text-2xl font-bold mt-1">{stats.total}</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-sm text-gray-500">Pending</div>
              <div className="text-2xl font-bold mt-1 text-yellow-600">{stats.pending}</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-sm text-gray-500">Approved</div>
              <div className="text-2xl font-bold mt-1 text-green-600">{stats.approved}</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-sm text-gray-500">Rejected</div>
              <div className="text-2xl font-bold mt-1 text-red-600">{stats.rejected}</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-sm text-gray-500">Active</div>
              <div className="text-2xl font-bold mt-1 text-blue-600">{stats.active}</div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setFilter("ALL")}
              className={`px-4 py-2 rounded-lg ${filter === "ALL" ? "bg-amber-500 text-white" : "bg-white text-gray-700 hover:bg-gray-50"}`}
            >
              All Users
            </button>
            <button
              onClick={() => setFilter("PENDING")}
              className={`px-4 py-2 rounded-lg ${filter === "PENDING" ? "bg-yellow-500 text-white" : "bg-white text-gray-700 hover:bg-gray-50"}`}
            >
              Pending ({stats.pending})
            </button>
            <button
              onClick={() => setFilter("APPROVED")}
              className={`px-4 py-2 rounded-lg ${filter === "APPROVED" ? "bg-green-500 text-white" : "bg-white text-gray-700 hover:bg-gray-50"}`}
            >
              Approved ({stats.approved})
            </button>
            <button
              onClick={() => setFilter("REJECTED")}
              className={`px-4 py-2 rounded-lg ${filter === "REJECTED" ? "bg-red-500 text-white" : "bg-white text-gray-700 hover:bg-gray-50"}`}
            >
              Rejected ({stats.rejected})
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Registered
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Active
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="text-gray-400">
                        <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-lg font-medium text-gray-500">No users found</p>
                        <p className="text-gray-400 mt-1">Try changing your filter or register new users</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-900">{user.Username}</div>
                          <div className="text-sm text-gray-500">{user.Email}</div>
                          <div className="text-xs text-gray-400 mt-1">ID: {user.id}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {getRoleBadge(user.Role)}
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(user.Status)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {formatDate(user.created_at)}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => toggleUserActiveStatus(user.id, user.is_active)}
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            user.is_active === 1
                              ? "bg-green-100 text-green-800 hover:bg-green-200"
                              : "bg-red-100 text-red-800 hover:bg-red-200"
                          }`}
                        >
                          {user.is_active === 1 ? "Active" : "Inactive"}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-2">
                          {user.Status === "PENDING" && (
                            <>
                              <button
                                onClick={() => updateUserStatus(user.id, "APPROVED")}
                                className="px-3 py-1.5 bg-green-100 text-green-700 rounded hover:bg-green-200 text-sm font-medium flex items-center transition"
                              >
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Approve
                              </button>
                              <button
                                onClick={() => updateUserStatus(user.id, "REJECTED")}
                                className="px-3 py-1.5 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm font-medium flex items-center transition"
                              >
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                Reject
                              </button>
                            </>
                          )}
                          {user.Status !== "PENDING" && (
                            <div className="space-y-2">
                              <span className={`text-sm font-medium ${user.Status === "APPROVED" ? "text-green-600" : "text-red-600"}`}>
                                {user.Status === "APPROVED" ? "✓ Approved" : "✗ Rejected"}
                              </span>
                              <div className="text-xs text-gray-500">
                                {user.Status === "APPROVED" && user.is_active === 0 && "User is inactive"}
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Admin Instructions */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-900 mb-3">Admin Instructions</h3>
          <ul className="space-y-2 text-blue-800">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span><strong>Pending Users:</strong> These are new registrations awaiting approval. Review their details before approving or rejecting.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span><strong>Approved Users:</strong> Can access the system based on their assigned roles and permissions.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span><strong>Rejected Users:</strong> Will not be able to access the system. You can review and approve them later if needed.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span><strong>Active/Inactive Toggle:</strong> Even approved users can be temporarily deactivated without rejecting them.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span><strong>Role Assignment:</strong> Each role has specific permissions. Ensure users receive appropriate roles for their responsibilities.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span><strong>Audit Trail:</strong> All approval actions are logged with admin ID and timestamp for accountability.</span>
            </li>
          </ul>
          <div className="mt-4 p-4 bg-white rounded border border-blue-100">
            <h4 className="font-medium text-blue-900 mb-2">Quick Actions:</h4>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  const pendingUsers = users.filter(u => u.Status === "PENDING");
                  if (pendingUsers.length > 0) {
                    alert(`You have ${pendingUsers.length} pending users to review.`);
                  } else {
                    alert("No pending users at the moment.");
                  }
                }}
                className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200"
              >
                Check Pending Users
              </button>
              <button
                onClick={() => {
                  const inactiveUsers = users.filter(u => u.is_active === 0 && u.Status === "APPROVED");
                  if (inactiveUsers.length > 0) {
                    alert(`You have ${inactiveUsers.length} approved but inactive users.`);
                  } else {
                    alert("All approved users are active.");
                  }
                }}
                className="px-3 py-1.5 bg-yellow-100 text-yellow-700 rounded text-sm hover:bg-yellow-200"
              >
                Check Inactive Users
              </button>
              <button
                onClick={fetchUsers}
                className="px-3 py-1.5 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200"
              >
                Refresh Data
              </button>
            </div>
          </div>
        </div>

        {/* Footer Notes */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>
            This panel is accessible only to SUPER_ADMIN users. All actions are logged and monitored.
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserApproval;