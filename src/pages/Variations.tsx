// import { useState } from "react";
// import CrudForm, { type Field } from "../components/CrudForm";

// import {
//   GridComponent,
//   ColumnsDirective,
//   ColumnDirective,
//   Page,
//   Sort,
//   Filter,
//   Inject,
//   Toolbar,
// } from "@syncfusion/ej2-react-grids";
// import { DialogComponent } from "@syncfusion/ej2-react-popups";
// import useCrudOperations from "../hooks/useCrudOperations";

// // =====================
// // Variation Form Fields
// // =====================
// const variationFields: Field[] = [
//   {
//     name: "project",
//     label: "Project",
//     type: "select",
//     options: ["Project Alpha", "Project Beta", "Project Gamma"],
//   },
//   {
//     name: "amount",
//     label: "Variation Amount ($)",
//     type: "number",
//   },
//   {
//     name: "description",
//     label: "Variation Description",
//     type: "textarea",
//   },
//   {
//     name: "date",
//     label: "Request Date",
//     type: "text",
//   },
//   {
//     name: "status",
//     label: "Status",
//     type: "select",
//     options: ["Requested", "Approved", "Rejected"],
//   },
//   {
//     name: "requestedBy",
//     label: "Requested By",
//     type: "text",
//   },
// ];

// // =====================
// // Sample Data
// // =====================
// const initialVariations = [
//   {
//     id: 1,
//     project: "Project Alpha",
//     amount: 12000,
//     description: "Additional excavation due to unexpected rock layer",
//     date: "2025-01-18",
//     status: "Requested",
//     requestedBy: "Site Engineer",
//   },
//   {
//     id: 2,
//     project: "Project Beta",
//     amount: -4500,
//     description: "Removal of optional landscape lighting",
//     date: "2025-01-10",
//     status: "Approved",
//     requestedBy: "Project Manager",
//   },
// ];

// const VariationsPage = () => {
//   const {
//     data: variations,
//     selectedItem,
//     mode,
//     isDialogOpen,
//     setIsDialogOpen,
//     openAdd,
//     openEdit,
//     openView,
//     handleAdd,
//     handleEdit,
//     handleDelete,
//   } = useCrudOperations(initialVariations);

//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [selectedForDelete, setSelectedForDelete] = useState<any>(null);

//   const handleSubmit = (values: any) => {
//     if (mode === "add") {
//       handleAdd({ ...values, status: "Requested" });
//     } else if (mode === "edit" && selectedItem) {
//       handleEdit({ ...selectedItem, ...values });
//     }
//   };

//   const openDelete = (variation: any) => {
//     setSelectedForDelete(variation);
//     setDeleteDialogOpen(true);
//   };

//   const confirmDelete = () => {
//     if (selectedForDelete) {
//       handleDelete(selectedForDelete.id);
//       setDeleteDialogOpen(false);
//       setSelectedForDelete(null);
//     }
//   };

//   // =====================
//   // Status Badge
//   // =====================
//   const statusTemplate = (props: any) => {
//     const styles: Record<string, string> = {
//       Requested: "bg-yellow-100 text-yellow-800",
//       Approved: "bg-green-100 text-green-800",
//       Rejected: "bg-red-100 text-red-800",
//     };

//     return (
//       <span className={`px-3 py-1 rounded-full text-xs ${styles[props.status]}`}>
//         {props.status}
//       </span>
//     );
//   };

//   // =====================
//   // Action Buttons
//   // =====================
//   const actionTemplate = (props: any) => (
//     <div className="flex gap-2">
//       <button
//         className="text-blue-600 hover:underline text-sm"
//         onClick={() => openView(props)}
//       >
//         View
//       </button>
//       <button
//         className="text-green-600 hover:underline text-sm"
//         onClick={() => openEdit(props)}
//       >
//         Edit
//       </button>
//       <button
//         className="text-red-600 hover:underline text-sm"
//         onClick={() => openDelete(props)}
//       >
//         Delete
//       </button>
//     </div>
//   );

//   const toolbarOptions = [
//     { text: "Add Variation", prefixIcon: "e-add", id: "add" },
//     { text: "Print", prefixIcon: "e-print", id: "print" },
//     { text: "Excel Export", prefixIcon: "e-excelexport", id: "excelexport" },
//   ];

//   const toolbarClick = (args: any) => {
//     if (args.item.id === "add") openAdd();
//   };

//   return (
//     <div className="p-4 space-y-6">
//       {/* =====================
//           Summary Cards
//       ===================== */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//         <div className="bg-white p-4 rounded shadow">
//           <h3 className="text-sm text-gray-500">Total Requests</h3>
//           <p className="text-2xl font-bold">{variations.length}</p>
//         </div>
//         <div className="bg-white p-4 rounded shadow">
//           <h3 className="text-sm text-gray-500">Pending Approval</h3>
//           <p className="text-2xl font-bold text-yellow-600">
//             {variations.filter(v => v.status === "Requested").length}
//           </p>
//         </div>
//         <div className="bg-white p-4 rounded shadow">
//           <h3 className="text-sm text-gray-500">Approved</h3>
//           <p className="text-2xl font-bold text-green-600">
//             {variations.filter(v => v.status === "Approved").length}
//           </p>
//         </div>
//         <div className="bg-white p-4 rounded shadow">
//           <h3 className="text-sm text-gray-500">Net Variation Value</h3>
//           <p className="text-2xl font-bold text-blue-600">
//             $
//             {variations.reduce((sum, v) => sum + Number(v.amount), 0).toLocaleString()}
//           </p>
//         </div>
//       </div>

//       {/* =====================
//           Grid Section
//       ===================== */}
//       <div className="bg-white rounded shadow">
//         <div className="p-4 border-b flex justify-between items-center">
//           <div>
//             <h1 className="text-2xl font-bold">Project Variations</h1>
//             <p className="text-gray-600">
//               Request and manage additional works during ongoing projects
//             </p>
//           </div>
//           <button
//             onClick={openAdd}
//             className="bg-[var(--bs-primary)] text-white px-4 py-2 rounded"
//           >
//             + New Variation Request
//           </button>
//         </div>

//         <div className="p-4">
//           <GridComponent
//             dataSource={variations}
//             allowPaging
//             allowSorting
//             allowFiltering
//             pageSettings={{ pageSize: 10 }}
//             toolbar={toolbarOptions}
//             toolbarClick={toolbarClick}
//           >
//             <ColumnsDirective>
//               <ColumnDirective field="project" headerText="Project" width={150} />
//               <ColumnDirective
//                 field="amount"
//                 headerText="Amount"
//                 width={120}
//                 format="C2"
//               />
//               <ColumnDirective field="date" headerText="Date" width={120} />
//               <ColumnDirective
//                 field="status"
//                 headerText="Status"
//                 width={120}
//                 template={statusTemplate}
//               />
//               <ColumnDirective
//                 field="requestedBy"
//                 headerText="Requested By"
//                 width={150}
//               />
//               <ColumnDirective
//                 headerText="Actions"
//                 width={180}
//                 template={actionTemplate}
//               />
//             </ColumnsDirective>
//             <Inject services={[Page, Sort, Filter, Toolbar]} />
//           </GridComponent>
//         </div>
//       </div>

//       {/* =====================
//           Add / Edit / View Dialog
//       ===================== */}
//       <DialogComponent
//         visible={isDialogOpen}
//         width="700px"
//         header={`${mode === "add" ? "Add" : mode === "edit" ? "Edit" : "View"} Variation`}
//         isModal
//         showCloseIcon
//         close={() => setIsDialogOpen(false)}
//       >
//         <div className="p-4">
//           <CrudForm
//             mode={mode}
//             fields={variationFields}
//             initialValues={selectedItem || {}}
//             onSubmit={handleSubmit}
//             onCancel={() => setIsDialogOpen(false)}
//           />
//         </div>
//       </DialogComponent>

//       {/* =====================
//           Delete Confirmation
//       ===================== */}
//       <DialogComponent
//         visible={deleteDialogOpen}
//         width="400px"
//         header="Delete Variation"
//         isModal
//         showCloseIcon
//         close={() => setDeleteDialogOpen(false)}
//       >
//         <div className="p-4">
//           <p className="mb-4">
//             Are you sure you want to delete this variation request?
//           </p>
//           <div className="flex justify-end gap-3">
//             <button
//               className="px-4 py-2 border rounded"
//               onClick={() => setDeleteDialogOpen(false)}
//             >
//               Cancel
//             </button>
//             <button
//               className="px-4 py-2 bg-red-600 text-white rounded"
//               onClick={confirmDelete}
//             >
//               Delete
//             </button>
//           </div>
//         </div>
//       </DialogComponent>
//     </div>
//   );
// };

// export default VariationsPage;



import type { Field } from "@/components/CrudForm";
import BaseCrudPage from "../components/BaseCrudPage";
import MainLayout from "../components/MainLayout";

// =====================
// Variation Fields
// =====================
const variationFields: Field[] = [
  {
    name: "project",
    label: "Project",
    type: "select",
    options: ["Project Alpha", "Project Beta", "Project Gamma"],
    required : true
  },
  {
    name: "amount",
    label: "Variation Amount ($)",
    type: "number",
    required : true
  },
  {
    name: "description",
    label: "Variation Description",
    type: "textarea",
  },
  {
    name: "date",
    label: "Request Date",
    type: "text",
    required : true
  },
  {
    name: "status",
    label: "Status",
    type: "select",
    options: ["Requested", "Approved", "Rejected"],
    required : true
  },
  {
    name: "requestedBy",
    label: "Requested By",
    type: "text",
    required : true
  },
];

// =====================
// Sample Data
// =====================
const initialVariations = [
  {
    id: 1,
    project: "Project Alpha",
    amount: 12000,
    description: "Additional excavation due to unexpected rock layer",
    date: "2025-01-18",
    status: "Requested",
    requestedBy: "Site Engineer",
  },
  {
    id: 2,
    project: "Project Beta",
    amount: -4500,
    description: "Removal of optional landscape lighting",
    date: "2025-01-10",
    status: "Approved",
    requestedBy: "Project Manager",
  },
];

// =====================
// Status Badge Template
// =====================
const statusTemplate = (props: any) => {
  const styles: Record<string, string> = {
    Requested: "bg-yellow-100 text-yellow-800",
    Approved: "bg-green-100 text-green-800",
    Rejected: "bg-red-100 text-red-800",
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
// Grid Columns
// =====================
const variationGridColumns = [
  { field: "project", headerText: "Project", width: 150 },
  {
    field: "amount",
    headerText: "Amount ($)",
    width: 130,
  },
  { field: "date", headerText: "Date", width: 120 },
  {
    field: "status",
    headerText: "Status",
    template: statusTemplate,
    width: 130,
  },
  { field: "requestedBy", headerText: "Requested By", width: 150 },
];

// =====================
// Summary Cards
// =====================
const VariationSummaryCards = ({ variations }: { variations: any[] }) => (
  <>
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-sm text-gray-500">Total Requests</h3>
      <p className="text-2xl font-bold">{variations.length}</p>
    </div>

    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-sm text-gray-500">Pending Approval</h3>
      <p className="text-2xl font-bold text-yellow-600">
        {variations.filter((v) => v.status === "Requested").length}
      </p>
    </div>

    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-sm text-gray-500">Approved</h3>
      <p className="text-2xl font-bold text-green-600">
        {variations.filter((v) => v.status === "Approved").length}
      </p>
    </div>

    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-sm text-gray-500">Net Variation Value</h3>
      <p className="text-2xl font-bold text-blue-600">
        $
        {variations
          .reduce((sum, v) => sum + Number(v.amount), 0)
          .toLocaleString()}
      </p>
    </div>
  </>
);

// =====================
// Page Component
// =====================
const VariationsPage = () => {
  return (
    <MainLayout
      role="SUPER_ADMIN"
      pageTitle="Project Variations"
      showLogout={true}
    >
      <BaseCrudPage
        title="Project Variations"
        description="Request and manage additional works during ongoing projects"
        fields={variationFields}
        initialData={initialVariations}
        gridColumns={variationGridColumns}
        summaryCards={
          <VariationSummaryCards variations={initialVariations} />
        }
      />
    </MainLayout>
  );
};

export default VariationsPage;
