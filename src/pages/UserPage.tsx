// import React from 'react';
// import CrudForm, { type Field } from '../components/CrudForm';


// const fields: Field[] = [
//   { name: 'name', label: 'Name', type: 'text' },
//   { name: 'email', label: 'Email', type: 'text' },
//   { name: 'role', label: 'Role', type: 'select', options: ['Admin', 'User', 'Guest'] },
//   { name: 'isActive', label: 'Active', type: 'checkbox' },
// ];

// const UserPage = () => {
//   const handleSubmit = (values: Record<string, any>) => {
//     console.log('Form submitted:', values);
//     // Call API for add/edit here
//   };

//   return (
//     <div className="p-4">
//       <h1 className="text-2xl font-bold mb-4">Add/Edit User</h1>
//       <CrudForm mode="add" fields={fields} onSubmit={handleSubmit} />
//     </div>
//   );
// };

// export default UserPage;



import type { Field } from "@/components/CrudForm";
import BaseCrudPage from "../components/BaseCrudPage";
import MainLayout from "../components/MainLayout";

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
// Sample Data
// =====================
const initialUsers = [
  {
    id: 1,
    name: "John Smith",
    email: "john@company.com",
    phone: "123-456-7890",
    role: "SUPER_ADMIN",
    status: "Active",
    department: "Management",
  },
  {
    id: 2,
    name: "Maria Johnson",
    email: "maria@company.com",
    phone: "987-654-3210",
    role: "PROJECT_MANAGER",
    status: "Active",
    department: "Projects",
  },
  {
    id: 3,
    name: "David Lee",
    email: "david@company.com",
    phone: "555-123-4567",
    role: "ACCOUNTANT",
    status: "Inactive",
    department: "Finance",
  },
];

// =====================
// Status Badge Template
// =====================
const statusTemplate = (props: any) => {
  const styles: Record<string, string> = {
    Active: "bg-green-100 text-green-800",
    Inactive: "bg-red-100 text-red-800",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs ${
        styles[props.status] || "bg-gray-100"
      }`}
    >
      {props.status}
    </span>
  );
};

// =====================
// Role Badge Template
// =====================
const roleTemplate = (props: any) => {
  const colors: Record<string, string> = {
    SUPER_ADMIN: "bg-purple-100 text-purple-800",
    PROJECT_MANAGER: "bg-blue-100 text-blue-800",
    SITE_ENGINEER: "bg-yellow-100 text-yellow-800",
    ACCOUNTANT: "bg-green-100 text-green-800",
    PROCUREMENT: "bg-indigo-100 text-indigo-800",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs ${
        colors[props.role] || "bg-gray-100"
      }`}
    >
      {props.role.replace("_", " ")}
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
const UserSummaryCards = ({ users }: { users: any[] }) => (
  <>
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-sm text-gray-500">Total Users</h3>
      <p className="text-2xl font-bold">{users.length}</p>
    </div>

    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-sm text-gray-500">Active Users</h3>
      <p className="text-2xl font-bold text-green-600">
        {users.filter((u) => u.status === "Active").length}
      </p>
    </div>

    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-sm text-gray-500">Inactive Users</h3>
      <p className="text-2xl font-bold text-red-600">
        {users.filter((u) => u.status === "Inactive").length}
      </p>
    </div>

    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-sm text-gray-500">Admins</h3>
      <p className="text-2xl font-bold text-purple-600">
        {users.filter((u) => u.role === "SUPER_ADMIN").length}
      </p>
    </div>
  </>
);

// =====================
// Page Component
// =====================
const UsersPage = () => {
  return (
    <MainLayout
      role="SUPER_ADMIN"
      pageTitle="User Management"
      showLogout={true}
    >
      <BaseCrudPage
        title="Users"
        description="Manage system users, roles, and access control"
        fields={userFields}
        initialData={initialUsers}
        gridColumns={userGridColumns}
        summaryCards={<UserSummaryCards users={initialUsers} />}
      />
    </MainLayout>
  );
};

export default UsersPage;
