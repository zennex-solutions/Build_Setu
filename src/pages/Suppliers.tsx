import { useState } from "react";
import CrudForm, { type Field } from "../components/CrudForm";

import {
  GridComponent,
  ColumnsDirective,
  ColumnDirective,
  Page,
  Sort,
  Filter,
  Inject,
  Toolbar,
} from "@syncfusion/ej2-react-grids";
import { DialogComponent } from "@syncfusion/ej2-react-popups";
import useCrudOperations from "../hooks/useCrudOperations";

// Supplier fields definition
const supplierFields: Field[] = [
  { name: "code", label: "Supplier Code", type: "text" },
  { name: "name", label: "Supplier Name", type: "text" },
  { name: "contactPerson", label: "Contact Person", type: "text" },
  { name: "email", label: "Email", type: "text" },
  { name: "phone", label: "Phone Number", type: "text" },
  { name: "address", label: "Address", type: "textarea" },
  { 
    name: "category", 
    label: "Supplier Category", 
    type: "select",
    options: ["Material", "Equipment", "Services", "Subcontractor", "Other"]
  },
  { name: "rating", label: "Rating (1–5)", type: "number" },
  { name: "isActive", label: "Active", type: "checkbox" },
  { name: "notes", label: "Notes", type: "textarea" },
];

// Sample initial data
const initialSuppliers = [
  {
    id: 1,
    code: "SUP-001",
    name: "ABC Suppliers",
    contactPerson: "John Smith",
    email: "contact@abcsuppliers.com",
    phone: "123-456-7890",
    address: "123 Industrial Road, City",
    category: "Material",
    rating: 4,
    isActive: true,
    notes: "Reliable supplier for cement and aggregates",
  },
  {
    id: 2,
    code: "SUP-002",
    name: "Steel Corp",
    contactPerson: "Maria Johnson",
    email: "sales@steelcorp.com",
    phone: "987-654-3210",
    address: "45 Steel Park, Industrial Zone",
    category: "Material",
    rating: 5,
    isActive: true,
    notes: "High-quality steel products",
  },
];

const Suppliers = () => {
  const {
    data: suppliers,
    selectedItem,
    mode,
    isDialogOpen,
    setIsDialogOpen,
    openAdd,
    openEdit,
    openView,
    handleAdd,
    handleEdit,
    handleDelete,
  } = useCrudOperations(initialSuppliers);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedForDelete, setSelectedForDelete] = useState<any>(null);

  const handleSubmit = (values: any) => {
    if (mode === "add") {
      handleAdd(values);
    } else if (mode === "edit" && selectedItem) {
      handleEdit({ ...selectedItem, ...values });
    }
  };

  const openDelete = (supplier: any) => {
    setSelectedForDelete(supplier);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedForDelete) {
      handleDelete(selectedForDelete.id);
      setDeleteDialogOpen(false);
      setSelectedForDelete(null);
    }
  };

  // Rating template
  const ratingTemplate = (props: any) => {
    return (
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} className={i < props.rating ? "text-yellow-500" : "text-gray-300"}>
            ★
          </span>
        ))}
      </div>
    );
  };

  // Actions template
  const actionTemplate = (props: any) => {
    const supplier = props;
    return (
      <div className="flex gap-2">
        <button
          className="text-blue-600 hover:underline text-sm"
          onClick={() => openView(supplier)}
        >
          View
        </button>
        <button
          className="text-green-600 hover:underline text-sm"
          onClick={() => openEdit(supplier)}
        >
          Edit
        </button>
        <button
          className="text-red-600 hover:underline text-sm"
          onClick={() => openDelete(supplier)}
        >
          Delete
        </button>
      </div>
    );
  };

  const toolbarOptions = [
    { text: "Add Supplier", prefixIcon: "e-add", id: "add" },
    { text: "Print", prefixIcon: "e-print", id: "print" },
    { text: "Excel Export", prefixIcon: "e-excelexport", id: "excelexport" },
  ];

  const toolbarClick = (args: any) => {
    if (args.item.id === "add") {
      openAdd();
    }
  };

  return (
    <div className="p-4 space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Total Suppliers</h3>
          <p className="text-2xl font-bold">{suppliers.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Active Suppliers</h3>
          <p className="text-2xl font-bold text-green-600">
            {suppliers.filter(s => s.isActive).length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Categories</h3>
          <p className="text-2xl font-bold">
            {[...new Set(suppliers.map(s => s.category))].length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Top Rated</h3>
          <p className="text-2xl font-bold text-yellow-600">
            {suppliers.filter(s => s.rating >= 4).length}
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Supplier Management</h1>
              <p className="text-gray-600">
                Manage suppliers, contacts, and performance
              </p>
            </div>
            <button
              onClick={openAdd}
              className="bg-[var(--bs-primary)] hover:bg-[#162b4a] text-white px-4 py-2 rounded-lg"
            >
              + Add Supplier
            </button>
          </div>
        </div>

        <div className="p-4">
          <GridComponent
            dataSource={suppliers}
            allowPaging
            pageSettings={{ pageSize: 10 }}
            allowSorting
            allowFiltering
            toolbar={toolbarOptions}
            toolbarClick={toolbarClick}
          >
            <ColumnsDirective>
              <ColumnDirective field="code" headerText="Code" width={120} />
              <ColumnDirective field="name" headerText="Supplier Name" width={180} />
              <ColumnDirective field="category" headerText="Category" width={130} />
              <ColumnDirective field="contactPerson" headerText="Contact" width={150} />
              <ColumnDirective field="phone" headerText="Phone" width={140} />
              <ColumnDirective
                headerText="Rating"
                width={120}
                template={ratingTemplate}
              />
              <ColumnDirective
                headerText="Actions"
                width={180}
                template={actionTemplate}
              />
            </ColumnsDirective>
            <Inject services={[Page, Sort, Filter, Toolbar]} />
          </GridComponent>
        </div>
      </div>

      {/* Add/Edit/View Dialog */}
      <DialogComponent
        visible={isDialogOpen}
        width="700px"
        header={`${mode === "add" ? "Add" : mode === "edit" ? "Edit" : "View"} Supplier`}
        showCloseIcon
        isModal
        close={() => setIsDialogOpen(false)}
      >
        <div className="p-4">
          <CrudForm
            mode={mode}
            fields={supplierFields}
            initialValues={selectedItem || {}}
            onSubmit={handleSubmit}
            onCancel={() => setIsDialogOpen(false)}
          />
        </div>
      </DialogComponent>

      {/* Delete Confirmation */}
      <DialogComponent
        visible={deleteDialogOpen}
        width="400px"
        header="Delete Supplier"
        isModal
        showCloseIcon
        close={() => setDeleteDialogOpen(false)}
      >
        <div className="p-4">
          <p className="mb-4">
            Are you sure you want to delete{" "}
            <strong>{selectedForDelete?.name}</strong>?
          </p>
          <div className="flex justify-end gap-3">
            <button
              className="px-4 py-2 border rounded"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-red-600 text-white rounded"
              onClick={confirmDelete}
            >
              Delete
            </button>
          </div>
        </div>
      </DialogComponent>
    </div>
  );
};

export default Suppliers;
