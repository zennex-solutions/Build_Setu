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

// =====================
// Equipment Fields
// =====================
const equipmentFields: Field[] = [
  {
    name: "name",
    label: "Equipment Name",
    type: "text",
  },
  {
    name: "category",
    label: "Category",
    type: "select",
    options: [
      "Earth Moving",
      "Lifting",
      "Concrete",
      "Transport",
      "Power Tools",
      "Other",
    ],
  },
  {
    name: "quantity",
    label: "Quantity",
    type: "number",
  },
  {
    name: "ownershipType",
    label: "Ownership Type",
    type: "select",
    options: ["Owned", "Rental", "Lease"],
  },
  {
    name: "rateType",
    label: "Rate Type",
    type: "select",
    options: ["Fixed", "Hourly", "Daily", "Monthly"],
  },
  {
    name: "price",
    label: "Unit Price / Rate ($)",
    type: "number",
  },
  {
    name: "status",
    label: "Status",
    type: "select",
    options: ["Available", "In Use", "Under Maintenance"],
  },
  {
    name: "supplier",
    label: "Supplier / Rental Company",
    type: "text",
  },
  {
    name: "assignedProject",
    label: "Assigned Project",
    type: "select",
    options: ["None", "Project Alpha", "Project Beta", "Project Gamma"],
  },
  {
    name: "description",
    label: "Description / Notes",
    type: "textarea",
  },
];

// =====================
// Sample Data
// =====================
const initialEquipment = [
  {
    id: 1,
    name: "Excavator",
    category: "Earth Moving",
    quantity: 2,
    ownershipType: "Rental",
    rateType: "Daily",
    price: 450,
    status: "In Use",
    supplier: "HeavyEquip Rentals",
    assignedProject: "Project Alpha",
    description: "20-ton excavator for excavation works",
  },
  {
    id: 2,
    name: "Concrete Mixer",
    category: "Concrete",
    quantity: 1,
    ownershipType: "Owned",
    rateType: "Fixed",
    price: 12000,
    status: "Available",
    supplier: "",
    assignedProject: "None",
    description: "Owned concrete mixer",
  },
];

const EquipmentPage = () => {
  const {
    data: equipment,
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
  } = useCrudOperations(initialEquipment);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedForDelete, setSelectedForDelete] = useState<any>(null);

  const handleSubmit = (values: any) => {
    if (mode === "add") {
      handleAdd(values);
    } else if (mode === "edit" && selectedItem) {
      handleEdit({ ...selectedItem, ...values });
    }
  };

  const openDelete = (item: any) => {
    setSelectedForDelete(item);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedForDelete) {
      handleDelete(selectedForDelete.id);
      setDeleteDialogOpen(false);
      setSelectedForDelete(null);
    }
  };

  // =====================
  // Status Badge
  // =====================
  const statusTemplate = (props: any) => {
    const colors: Record<string, string> = {
      Available: "bg-green-100 text-green-800",
      "In Use": "bg-blue-100 text-blue-800",
      "Under Maintenance": "bg-yellow-100 text-yellow-800",
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs ${colors[props.status]}`}>
        {props.status}
      </span>
    );
  };

  // =====================
  // Action Buttons
  // =====================
  const actionTemplate = (props: any) => (
    <div className="flex gap-2">
      <button
        className="text-blue-600 hover:underline text-sm"
        onClick={() => openView(props)}
      >
        View
      </button>
      <button
        className="text-green-600 hover:underline text-sm"
        onClick={() => openEdit(props)}
      >
        Edit
      </button>
      <button
        className="text-red-600 hover:underline text-sm"
        onClick={() => openDelete(props)}
      >
        Delete
      </button>
    </div>
  );

  const toolbarOptions = [
    { text: "Add Equipment", prefixIcon: "e-add", id: "add" },
    { text: "Print", prefixIcon: "e-print", id: "print" },
    { text: "Excel Export", prefixIcon: "e-excelexport", id: "excelexport" },
  ];

  const toolbarClick = (args: any) => {
    if (args.item.id === "add") openAdd();
  };

  return (
    <div className="p-4 space-y-6">
      {/* =====================
          Summary Cards
      ===================== */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-sm text-gray-500">Total Equipment</h3>
          <p className="text-2xl font-bold">{equipment.length}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-sm text-gray-500">In Use</h3>
          <p className="text-2xl font-bold text-blue-600">
            {equipment.filter(e => e.status === "In Use").length}
          </p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-sm text-gray-500">Available</h3>
          <p className="text-2xl font-bold text-green-600">
            {equipment.filter(e => e.status === "Available").length}
          </p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-sm text-gray-500">Total Equipment Value</h3>
          <p className="text-2xl font-bold text-purple-600">
            $
            {equipment
              .reduce((sum, e) => sum + e.price * e.quantity, 0)
              .toLocaleString()}
          </p>
        </div>
      </div>

      {/* =====================
          Grid Section
      ===================== */}
      <div className="bg-white rounded shadow">
        <div className="p-4 border-b flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Equipment Management</h1>
            <p className="text-gray-600">
              Manage owned, rented, and leased construction equipment
            </p>
          </div>
          <button
            onClick={openAdd}
            className="bg-[var(--bs-primary)] text-white px-4 py-2 rounded"
          >
            + Add Equipment
          </button>
        </div>

        <div className="p-4">
          <GridComponent
            dataSource={equipment}
            allowPaging
            allowSorting
            allowFiltering
            pageSettings={{ pageSize: 10 }}
            toolbar={toolbarOptions}
            toolbarClick={toolbarClick}
          >
            <ColumnsDirective>
              <ColumnDirective field="name" headerText="Equipment" width={160} />
              <ColumnDirective field="category" headerText="Category" width={130} />
              <ColumnDirective field="quantity" headerText="Qty" width={80} />
              <ColumnDirective field="ownershipType" headerText="Type" width={120} />
              <ColumnDirective field="rateType" headerText="Rate" width={100} />
              <ColumnDirective
                field="price"
                headerText="Price"
                width={120}
                format="C2"
              />
              <ColumnDirective
                field="status"
                headerText="Status"
                width={140}
                template={statusTemplate}
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

      {/* =====================
          Add / Edit / View Dialog
      ===================== */}
      <DialogComponent
       cssClass="no-scroll-dialog"
        visible={isDialogOpen}
        width="750px"
        header={`${mode === "add" ? "Add" : mode === "edit" ? "Edit" : "View"} Equipment`}
        isModal
        showCloseIcon
        close={() => setIsDialogOpen(false)}
      >
        <div className="p-4">
          <CrudForm
            mode={mode}
            fields={equipmentFields}
            initialValues={selectedItem || {}}
            onSubmit={handleSubmit}
            onCancel={() => setIsDialogOpen(false)}
          />
        </div>
      </DialogComponent>

      {/* =====================
          Delete Confirmation
      ===================== */}
      <DialogComponent
        visible={deleteDialogOpen}
        width="400px"
        header="Delete Equipment"
        isModal
        showCloseIcon
        close={() => setDeleteDialogOpen(false)}
      >
        <div className="p-4">
          <p className="mb-4">
            Are you sure you want to delete this equipment record?
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

export default EquipmentPage;
