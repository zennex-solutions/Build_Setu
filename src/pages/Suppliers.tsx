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

// // Supplier fields definition
// const supplierFields: Field[] = [
//   { name: "code", label: "Supplier Code", type: "text" },
//   { name: "name", label: "Supplier Name", type: "text" },
//   { name: "contactPerson", label: "Contact Person", type: "text" },
//   { name: "email", label: "Email", type: "text" },
//   { name: "phone", label: "Phone Number", type: "text" },
//   { name: "address", label: "Address", type: "textarea" },
//   { 
//     name: "category", 
//     label: "Supplier Category", 
//     type: "select",
//     options: ["Material", "Equipment", "Services", "Subcontractor", "Other"]
//   },
//   { name: "rating", label: "Rating (1–5)", type: "number" },
//   { name: "isActive", label: "Active", type: "checkbox" },
//   { name: "notes", label: "Notes", type: "textarea" },
// ];

// // Sample initial data
// const initialSuppliers = [
//   {
//     id: 1,
//     code: "SUP-001",
//     name: "ABC Suppliers",
//     contactPerson: "John Smith",
//     email: "contact@abcsuppliers.com",
//     phone: "123-456-7890",
//     address: "123 Industrial Road, City",
//     category: "Material",
//     rating: 4,
//     isActive: true,
//     notes: "Reliable supplier for cement and aggregates",
//   },
//   {
//     id: 2,
//     code: "SUP-002",
//     name: "Steel Corp",
//     contactPerson: "Maria Johnson",
//     email: "sales@steelcorp.com",
//     phone: "987-654-3210",
//     address: "45 Steel Park, Industrial Zone",
//     category: "Material",
//     rating: 5,
//     isActive: true,
//     notes: "High-quality steel products",
//   },
// ];

// const Suppliers = () => {
//   const {
//     data: suppliers,
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
//   } = useCrudOperations(initialSuppliers);

//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [selectedForDelete, setSelectedForDelete] = useState<any>(null);

//   const handleSubmit = (values: any) => {
//     if (mode === "add") {
//       handleAdd(values);
//     } else if (mode === "edit" && selectedItem) {
//       handleEdit({ ...selectedItem, ...values });
//     }
//   };

//   const openDelete = (supplier: any) => {
//     setSelectedForDelete(supplier);
//     setDeleteDialogOpen(true);
//   };

//   const confirmDelete = () => {
//     if (selectedForDelete) {
//       handleDelete(selectedForDelete.id);
//       setDeleteDialogOpen(false);
//       setSelectedForDelete(null);
//     }
//   };

//   // Rating template
//   const ratingTemplate = (props: any) => {
//     return (
//       <div className="flex gap-1">
//         {Array.from({ length: 5 }).map((_, i) => (
//           <span key={i} className={i < props.rating ? "text-yellow-500" : "text-gray-300"}>
//             ★
//           </span>
//         ))}
//       </div>
//     );
//   };

//   // Actions template
//   const actionTemplate = (props: any) => {
//     const supplier = props;
//     return (
//       <div className="flex gap-2">
//         <button
//           className="text-blue-600 hover:underline text-sm"
//           onClick={() => openView(supplier)}
//         >
//           View
//         </button>
//         <button
//           className="text-green-600 hover:underline text-sm"
//           onClick={() => openEdit(supplier)}
//         >
//           Edit
//         </button>
//         <button
//           className="text-red-600 hover:underline text-sm"
//           onClick={() => openDelete(supplier)}
//         >
//           Delete
//         </button>
//       </div>
//     );
//   };

//   const toolbarOptions = [
//     { text: "Add Supplier", prefixIcon: "e-add", id: "add" },
//     { text: "Print", prefixIcon: "e-print", id: "print" },
//     { text: "Excel Export", prefixIcon: "e-excelexport", id: "excelexport" },
//   ];

//   const toolbarClick = (args: any) => {
//     if (args.item.id === "add") {
//       openAdd();
//     }
//   };

//   return (
//     <div className="p-4 space-y-6">
//       {/* Header Stats */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//         <div className="bg-white p-4 rounded-lg shadow">
//           <h3 className="text-gray-500 text-sm">Total Suppliers</h3>
//           <p className="text-2xl font-bold">{suppliers.length}</p>
//         </div>
//         <div className="bg-white p-4 rounded-lg shadow">
//           <h3 className="text-gray-500 text-sm">Active Suppliers</h3>
//           <p className="text-2xl font-bold text-green-600">
//             {suppliers.filter(s => s.isActive).length}
//           </p>
//         </div>
//         <div className="bg-white p-4 rounded-lg shadow">
//           <h3 className="text-gray-500 text-sm">Categories</h3>
//           <p className="text-2xl font-bold">
//             {[...new Set(suppliers.map(s => s.category))].length}
//           </p>
//         </div>
//         <div className="bg-white p-4 rounded-lg shadow">
//           <h3 className="text-gray-500 text-sm">Top Rated</h3>
//           <p className="text-2xl font-bold text-yellow-600">
//             {suppliers.filter(s => s.rating >= 4).length}
//           </p>
//         </div>
//       </div>

//       {/* Grid */}
//       <div className="bg-white rounded-lg shadow">
//         <div className="p-4 border-b">
//           <div className="flex justify-between items-center">
//             <div>
//               <h1 className="text-2xl font-bold text-gray-800">Supplier Management</h1>
//               <p className="text-gray-600">
//                 Manage suppliers, contacts, and performance
//               </p>
//             </div>
//             <button
//               onClick={openAdd}
//               className="bg-[var(--bs-primary)] hover:bg-[#162b4a] text-white px-4 py-2 rounded-lg"
//             >
//               + Add Supplier
//             </button>
//           </div>
//         </div>

//         <div className="p-4">
//           <GridComponent
//             dataSource={suppliers}
//             allowPaging
//             pageSettings={{ pageSize: 10 }}
//             allowSorting
//             allowFiltering
//             toolbar={toolbarOptions}
//             toolbarClick={toolbarClick}
//           >
//             <ColumnsDirective>
//               <ColumnDirective field="code" headerText="Code" width={120} />
//               <ColumnDirective field="name" headerText="Supplier Name" width={180} />
//               <ColumnDirective field="category" headerText="Category" width={130} />
//               <ColumnDirective field="contactPerson" headerText="Contact" width={150} />
//               <ColumnDirective field="phone" headerText="Phone" width={140} />
//               <ColumnDirective
//                 headerText="Rating"
//                 width={120}
//                 template={ratingTemplate}
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

//       {/* Add/Edit/View Dialog */}
//       <DialogComponent
//        cssClass="no-scroll-dialog"
//         visible={isDialogOpen}
//         width="700px"
//         header={`${mode === "add" ? "Add" : mode === "edit" ? "Edit" : "View"} Supplier`}
//         showCloseIcon
//         isModal
//         close={() => setIsDialogOpen(false)}
//       >
//         <div className="p-4">
//           <CrudForm
//             mode={mode}
//             fields={supplierFields}
//             initialValues={selectedItem || {}}
//             onSubmit={handleSubmit}
//             onCancel={() => setIsDialogOpen(false)}
//           />
//         </div>
//       </DialogComponent>

//       {/* Delete Confirmation */}
//       <DialogComponent
//         visible={deleteDialogOpen}
//         width="400px"
//         header="Delete Supplier"
//         isModal
//         showCloseIcon
//         close={() => setDeleteDialogOpen(false)}
//       >
//         <div className="p-4">
//           <p className="mb-4">
//             Are you sure you want to delete{" "}
//             <strong>{selectedForDelete?.name}</strong>?
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

// export default Suppliers;





import { useState, useEffect, useCallback } from "react";
import type { Field } from "@/components/CrudForm";
import BaseCrudPage from "../components/BaseCrudPage";
import MainLayout from "../components/MainLayout";
import { 
  fetchSuppliers, 
  addSupplier, 
  updateSupplier, 
  deleteSupplier, 
  mapDbToForm,
  getSupplierStats 
} from "../services/SupplierService";

// =====================
// Supplier Fields
// =====================
const supplierFields: Field[] = [
  { name: "code", label: "Supplier Code", type: "text", required: true },
  { name: "name", label: "Supplier Name", type: "text", required: true },
  { name: "contactPerson", label: "Contact Person", type: "text", required: true },
  { name: "email", label: "Email", type: "text" },
  { name: "phone", label: "Phone Number", type: "text", required: true },
  { name: "address", label: "Address", type: "textarea" },
  {
    name: "category",
    label: "Supplier Category",
    type: "select",
    options: ["Material", "Equipment", "Services", "Subcontractor", "Other"],
    required: true
  },
  { name: "rating", label: "Rating (1–5)", type: "number" },
  { name: "isActive", label: "Active", type: "checkbox" },
  { name: "notes", label: "Notes", type: "textarea" },
];

// =====================
// Rating Template
// =====================
const ratingTemplate = (props: any) => (
  <div className="flex gap-1">
    {Array.from({ length: 5 }).map((_, i) => (
      <span
        key={i}
        className={i < props.rating ? "text-yellow-500" : "text-gray-300"}
      >
        ★
      </span>
    ))}
  </div>
);

// =====================
// Active Status Template
// =====================
const statusTemplate = (props: any) => (
  <span
    className={`px-2 py-1 rounded-full text-xs font-medium ${
      props.isActive
        ? "bg-green-100 text-green-800"
        : "bg-gray-100 text-gray-600"
    }`}
  >
    {props.isActive ? "Active" : "Inactive"}
  </span>
);

// =====================
// Grid Columns
// =====================
const supplierGridColumns = [
  { field: "code", headerText: "Code", width: 120 },
  { field: "name", headerText: "Supplier Name", width: 180 },
  { field: "category", headerText: "Category", width: 130 },
  { field: "contactPerson", headerText: "Contact", width: 150 },
  { field: "phone", headerText: "Phone", width: 140 },
  { headerText: "Rating", width: 120, template: ratingTemplate },
  { headerText: "Status", width: 120, template: statusTemplate },
];

// =====================
// Summary Cards Component
// =====================
const SupplierSummaryCards = ({ suppliers }: { suppliers: any[] }) => {
  const [stats, setStats] = useState({
    total_suppliers: 0,
    active_suppliers: 0,
    total_categories: 0,
    top_rated_suppliers: 0,
    average_rating: 0
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await getSupplierStats();
        setStats(data);
      } catch (error) {
        console.error('Error loading stats:', error);
      }
    };
    loadStats();
  }, [suppliers]);

  // Calculate from suppliers if stats not available
  const activeCount = suppliers.filter(s => s.isActive).length;
  const categories = [...new Set(suppliers.map(s => s.category))].length;
  const topRated = suppliers.filter(s => s.rating >= 4).length;

  return (
    <>
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-sm text-gray-500">Total Suppliers</h3>
        <p className="text-2xl font-bold">{stats.total_suppliers || suppliers.length}</p>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-sm text-gray-500">Active</h3>
        <p className="text-2xl font-bold text-green-600">
          {stats.active_suppliers || activeCount}
        </p>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-sm text-gray-500">Categories</h3>
        <p className="text-2xl font-bold">
          {stats.total_categories || categories}
        </p>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-sm text-gray-500">Top Rated (4+)</h3>
        <p className="text-2xl font-bold text-yellow-600">
          {stats.top_rated_suppliers || topRated}
        </p>
      </div>
    </>
  );
};

// =====================
// Page Component
// =====================
const SuppliersPage = () => {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch suppliers
  const loadSuppliers = useCallback(async (): Promise<any[]> => {
    try {
      setLoading(true);
      console.log('Fetching suppliers...');
      const data = await fetchSuppliers();
      console.log('Fetched suppliers:', data);
      setSuppliers(data);
      setError(null);
      return data;
    } catch (err: any) {
      console.error('Error fetching suppliers:', err);
      setError('Failed to load suppliers');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Load data on mount
  useEffect(() => {
    loadSuppliers();
  }, [loadSuppliers]);

  // Handle add
  const handleAdd = async (values: any) => {
    try {
      console.log('Adding supplier:', values);
      await addSupplier(values);
      await loadSuppliers();
      return { success: true };
    } catch (err: any) {
      console.error('Error adding supplier:', err);
      alert(err.message);
      return { success: false };
    }
  };

  // Handle edit
  const handleEdit = async (values: any) => {
    try {
      console.log('Editing supplier:', values);
      await updateSupplier(values.id, values);
      await loadSuppliers();
      return { success: true };
    } catch (err: any) {
      console.error('Error updating supplier:', err);
      alert(err.message);
      return { success: false };
    }
  };

  // Handle delete
  const handleDelete = async (id: number) => {
    try {
      console.log('Deleting supplier:', id);
      await deleteSupplier(id);
      await loadSuppliers();
      return { success: true };
    } catch (err: any) {
      console.error('Error deleting supplier:', err);
      alert(err.message);
      return { success: false };
    }
  };

  // Handle view - transform DB to form
  const handleView = (item: any) => {
    console.log('Viewing item:', item);
    const transformed = mapDbToForm(item);
    console.log('Transformed for view:', transformed);
    return transformed;
  };

  if (loading && suppliers.length === 0) {
    return (
      <MainLayout role="SUPER_ADMIN" pageTitle="Supplier Management" showLogout={true}>
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Loading suppliers...</div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout role="SUPER_ADMIN" pageTitle="Supplier Management" showLogout={true}>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout
      role="SUPER_ADMIN"
      pageTitle="Supplier Management"
      showLogout={true}
    >
      <BaseCrudPage
        title="Supplier"
        description="Manage suppliers, contacts, and performance"
        fields={supplierFields}
        initialData={suppliers}
        gridColumns={supplierGridColumns}
        summaryCards={<SupplierSummaryCards suppliers={suppliers} />}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        onDataChange={loadSuppliers}
      />
    </MainLayout>
  );
};

export default SuppliersPage;

