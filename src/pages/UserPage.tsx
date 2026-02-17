import React, { useState, useEffect } from 'react';
import type { Field } from "../components/CrudForm";
import BaseCrudPage from "../components/BaseCrudPage";
import MainLayout from "../components/MainLayout";
import { useNavigate } from "react-router-dom";

// =====================
// User Fields
// =====================
const userFields: Field[] = [
  {
    name: "name",
    label: "Full Name",
    type: "text",
  },
  {
    name: "email",
    label: "Email",
    type: "text",
  },
  {
    name: "phone",
    label: "Phone Number",
    type: "text",
  },
  {
    name: "role",
    label: "Role",
    type: "select",
    options: [
      "SUPER_ADMIN",
      "PROJECT_MANAGER",
      "SITE_ENGINEER",
      "ACCOUNTANT",
      "PROCUREMENT",
    ],
  },
  {
    name: "status",
    label: "Status",
    type: "select",
    options: ["Active", "Inactive"],
  },
  {
    name: "department",
    label: "Department",
    type: "text",
  },
];

// =====================
// Status Badge Template
// =====================
const statusTemplate = (props: any) => {
  // Handle both direct props and rowData
  const status = props.status || (props.rowData && props.rowData.status);
  
  if (!status) {
    return (
      <span className="px-3 py-1 rounded-full text-xs bg-gray-100">
        Unknown
      </span>
    );
  }

  const styles: Record<string, string> = {
    Active: "bg-green-100 text-green-800",
    Inactive: "bg-red-100 text-red-800",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs ${
        styles[status] || "bg-gray-100"
      }`}
    >
      {status}
    </span>
  );
};

// =====================
// Role Badge Template
// =====================
const roleTemplate = (props: any) => {
  // Handle both direct props and rowData
  const role = props.role || (props.rowData && props.rowData.role);
  
  if (!role) {
    return (
      <span className="px-3 py-1 rounded-full text-xs bg-gray-100">
        No Role
      </span>
    );
  }

  const colors: Record<string, string> = {
    SUPER_ADMIN: "bg-purple-100 text-purple-800",
    PROJECT_MANAGER: "bg-blue-100 text-blue-800",
    SITE_ENGINEER: "bg-yellow-100 text-yellow-800",
    ACCOUNTANT: "bg-green-100 text-green-800",
    PROCUREMENT: "bg-indigo-100 text-indigo-800",
  };

  // Safely format the role name
  const formattedRole = role.replace ? role.replace("_", " ") : role;

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs ${
        colors[role] || "bg-gray-100"
      }`}
    >
      {formattedRole}
    </span>
  );
};

// =====================
// Grid Columns
// =====================
const userGridColumns = [
  { field: "name", headerText: "Name", width: 160 },
  { field: "email", headerText: "Email", width: 200 },
  { field: "phone", headerText: "Phone", width: 140 },
  {
    field: "role",
    headerText: "Role",
    template: roleTemplate,
    width: 160,
  },
  {
    field: "status",
    headerText: "Status",
    template: statusTemplate,
    width: 120,
  },
  { field: "department", headerText: "Department", width: 150 },
];

// =====================
// Summary Cards
// =====================
const UserSummaryCards = ({ users }: { users: any[] }) => {
  const activeUsers = users.filter(u => u && u.status === "Active").length;
  const inactiveUsers = users.filter(u => u && u.status === "Inactive").length;
  const admins = users.filter(u => u && u.role === "SUPER_ADMIN").length;

  return (
    <>
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-sm text-gray-500">Total Users</h3>
        <p className="text-2xl font-bold">{users.length || 0}</p>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-sm text-gray-500">Active Users</h3>
        <p className="text-2xl font-bold text-green-600">
          {activeUsers}
        </p>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-sm text-gray-500">Inactive Users</h3>
        <p className="text-2xl font-bold text-red-600">
          {inactiveUsers}
        </p>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-sm text-gray-500">Admins</h3>
        <p className="text-2xl font-bold text-purple-600">
          {admins}
        </p>
      </div>
    </>
  );
};

// =====================
// Page Component
// =====================
const UsersPage = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get user from localStorage
    const userStr = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (!token || !userStr) {
      console.log('No token or user found, redirecting to login');
      navigate('/');
      return;
    }

    try {
      const userData = JSON.parse(userStr);
      setUser(userData);
    } catch (e) {
      console.error('Failed to parse user data');
    }

    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Fetching users with token:', token);
      
      const response = await fetch('http://localhost:5000/api/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        if (response.status === 401) {
          console.log('Unauthorized - clearing localStorage');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/');
          return;
        }
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      console.log('API response:', data);

      if (data.success && data.users) {
        setUsers(data.users);
      } else {
        setUsers([]);
      }
    } catch (err: any) {
      console.error('Fetch error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (values: any) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(values)
      });

      if (!response.ok) {
        throw new Error('Failed to add user');
      }

      const data = await response.json();
      console.log('User added:', data);
      
      // Refresh the user list
      await fetchUsers();
      
      return data;
    } catch (err: any) {
      console.error('Add user error:', err);
      setError(err.message);
      throw err;
    }
  };

  const handleEditUser = async (values: any) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/users/${values.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(values)
      });

      if (!response.ok) {
        throw new Error('Failed to update user');
      }

      const data = await response.json();
      console.log('User updated:', data);
      
      // Refresh the user list
      await fetchUsers();
      
      return data;
    } catch (err: any) {
      console.error('Edit user error:', err);
      setError(err.message);
      throw err;
    }
  };

  const handleDeleteUser = async (id: number) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/users/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      console.log('User deleted:', id);
      
      // Refresh the user list
      await fetchUsers();
    } catch (err: any) {
      console.error('Delete user error:', err);
      setError(err.message);
      throw err;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading users...</div>
      </div>
    );
  }

  return (
    <MainLayout
      role={user?.role || "USER"}
      pageTitle="User Management"
      showLogout={true}
      onLogout={handleLogout}
    >
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Error: {error}
        </div>
      )}
      
      {users.length === 0 && !error && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
          No users found. Click "Add" to create your first user.
        </div>
      )}
      
      <BaseCrudPage
        title="Users"
        description="Manage system users, roles, and access control"
        fields={userFields}
        initialData={users}
        gridColumns={userGridColumns}
        summaryCards={<UserSummaryCards users={users} />}
        onAdd={handleAddUser}
        onEdit={handleEditUser}
        onDelete={handleDeleteUser}
      />
    </MainLayout>
  );
};

export default UsersPage;