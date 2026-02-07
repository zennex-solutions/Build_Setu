import { useState } from "react";
import CrudForm, { type Field } from "../components/CrudForm";
import {
  GridComponent,
  ColumnsDirective,
  ColumnDirective,
  Page,
  Inject,
} from "@syncfusion/ej2-react-grids";
import { DialogComponent } from "@syncfusion/ej2-react-popups";

const fields: Field[] = [
  { name: "name", label: "Name", type: "text" },
  { name: "email", label: "Email", type: "text" },
  { name: "role", label: "Role", type: "select", options: ["Admin", "User", "Guest"] },
  { name: "isActive", label: "Active", type: "checkbox" },
];

type Mode = "add" | "edit" | "view";

const UserPageContent = () => {
  const [users, setUsers] = useState([
    { id: 1, name: "John", email: "john@test.com", role: "Admin", isActive: true },
    { id: 2, name: "Jane", email: "jane@test.com", role: "User", isActive: false },
  ]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("add");
  const [selectedUser, setSelectedUser] = useState<any>(null);

  /* -------------------- Handlers -------------------- */

  const openAdd = () => {
    setMode("add");
    setSelectedUser(null);
    setDialogOpen(true);
  };

  const openEdit = (user: any) => {
    setMode("edit");
    setSelectedUser(user);
    setDialogOpen(true);
  };

  const openView = (user: any) => {
    setMode("view");
    setSelectedUser(user);
    setDialogOpen(true);
  };

  const openDelete = (user: any) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const handleSubmit = (values: any) => {
    if (mode === "add") {
      setUsers([...users, { ...values, id: Date.now() }]);
    } else if (mode === "edit") {
      setUsers(users.map((u) => (u.id === selectedUser.id ? { ...u, ...values } : u)));
    }
    setDialogOpen(false);
  };

  const handleDelete = () => {
    setUsers(users.filter((u) => u.id !== selectedUser.id));
    setDeleteDialogOpen(false);
  };

  /* -------------------- Grid Action Buttons -------------------- */

  const actionTemplate = (props: any) => {
    const rowData = props; // props contains the row data
    return (
      <div className="flex gap-2">
        <button className="text-blue-600 hover:underline" onClick={() => openView(rowData)}>
          View
        </button>
        <button className="text-green-600 hover:underline" onClick={() => openEdit(rowData)}>
          Edit
        </button>
        <button className="text-red-600 hover:underline" onClick={() => openDelete(rowData)}>
          Delete
        </button>
      </div>
    );
  };

  const activeTemplate = (props: any) => {
    const isActive = props.isActive;
    return (
      <input 
        type="checkbox" 
        checked={isActive} 
        disabled 
        className="scale-125"
      />
    );
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Users</h1>
        <button
          onClick={openAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
        >
          + Add User
        </button>
      </div>

      {/* -------------------- Data Grid -------------------- */}
      <div className="border rounded-lg overflow-hidden">
        <GridComponent
          dataSource={users}
          allowPaging={true}
          pageSettings={{ pageSize: 5 }}
          height="auto"
        >
          <ColumnsDirective>
            <ColumnDirective field="name" headerText="Name" width={150} />
            <ColumnDirective field="email" headerText="Email" width={200} />
            <ColumnDirective field="role" headerText="Role" width={120} />
            <ColumnDirective 
              field="isActive" 
              headerText="Active" 
              width={100} 
              template={activeTemplate}
            />
            <ColumnDirective
              headerText="Actions"
              width={180}
              template={actionTemplate}
            />
          </ColumnsDirective>
          <Inject services={[Page]} />
        </GridComponent>
      </div>

      {/* -------------------- Add / Edit / View Dialog -------------------- */}
      <DialogComponent
        visible={dialogOpen}
        width="800px"
        header={`${mode === "add" ? "Add" : mode === "edit" ? "Edit" : "View"} User`}
        showCloseIcon={true}
        isModal={true}
        close={() => setDialogOpen(false)}
      >
        <CrudForm
          mode={mode}
          fields={fields}
          initialValues={selectedUser || {}}
          onSubmit={handleSubmit}
          onCancel={() => setDialogOpen(false)}
        />
      </DialogComponent>

      {/* -------------------- Delete Confirmation Dialog -------------------- */}
      <DialogComponent
        visible={deleteDialogOpen}
        width="300px"
        header="Confirm Delete"
        isModal={true}
        showCloseIcon={true}
        close={() => setDeleteDialogOpen(false)}
        footerTemplate={() => (
          <div className="flex justify-end gap-3 p-4">
            <button
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              onClick={handleDelete}
            >
              Delete
            </button>
          </div>
        )}
      >
        <div className="p-4">
          <p className="text-gray-700">
            Are you sure you want to delete user <strong>{selectedUser?.name}</strong>?
          </p>
        </div>
      </DialogComponent>
    </div>
  );
};
    
export default UserPageContent;