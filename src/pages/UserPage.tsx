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



import Layout from "../components/Layout";
import UserPageContent from "../components/UserPageContent";

const UserPage = () => {
  const role = "SUPER_ADMIN"; // get dynamically after login
  return (
    <Layout role={role}>
      <UserPageContent />
    </Layout>
  );
};

export default UserPage;
