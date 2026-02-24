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
//   Edit,
//   CommandColumn,
// } from "@syncfusion/ej2-react-grids";
// import { DialogComponent } from "@syncfusion/ej2-react-popups";
// import useCrudOperations from "../hooks/useCrudOperations";
// // Material fields definition
// const materialFields: Field[] = [
//   { name: "code", label: "Material Code", type: "text" },
//   { name: "name", label: "Material Name", type: "text" },
//   { name: "category", label: "Category", type: "select", 
//     options: ["Structural", "Finishing", "Plumbing", "Electrical", "Hardware", "Other"] },
//   { name: "unit", label: "Unit of Measure", type: "select", 
//     options: ["kg", "m", "m²", "m³", "pcs", "L", "bag", "roll", "set"] },
//   { name: "unitPrice", label: "Unit Price ($)", type: "number" },
//   { name: "quantity", label: "Current Stock", type: "number" },
//   { name: "minQuantity", label: "Minimum Stock Level", type: "number" },
//   { name: "maxQuantity", label: "Maximum Stock Level", type: "number" },
//   { name: "supplier", label: "Supplier", type: "text" },
//   { name: "supplierContact", label: "Supplier Contact", type: "text" },
//   { name: "location", label: "Storage Location", type: "text" },
//   { name: "description", label: "Description", type: "textarea" },
//   { name: "isActive", label: "Active", type: "checkbox" },
// ];

// // Sample initial data
// const initialMaterials = [
//   { 
//     id: 1, 
//     code: "MAT-001", 
//     name: "Portland Cement", 
//     category: "Structural", 
//     unit: "bag", 
//     unitPrice: 8.50, 
//     quantity: 500, 
//     minQuantity: 100, 
//     maxQuantity: 1000,
//     supplier: "ABC Suppliers",
//     supplierContact: "123-456-7890",
//     location: "Warehouse A, Rack 3",
//     description: "High-quality Portland cement for structural work",
//     isActive: true 
//   },
//   { 
//     id: 2, 
//     code: "MAT-002", 
//     name: "Steel Rebar", 
//     category: "Structural", 
//     unit: "kg", 
//     unitPrice: 0.85, 
//     quantity: 2500, 
//     minQuantity: 500, 
//     maxQuantity: 5000,
//     supplier: "Steel Corp",
//     supplierContact: "987-654-3210",
//     location: "Yard Storage",
//     description: "12mm diameter steel reinforcement bars",
//     isActive: true 
//   },
// ];

// const MaterialPage = () => {
//   const {
//     data: materials,
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
//   } = useCrudOperations(initialMaterials);

//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [selectedForDelete, setSelectedForDelete] = useState<any>(null);

//   const handleSubmit = (values: any) => {
//     if (mode === "add") {
//       handleAdd(values);
//     } else if (mode === "edit" && selectedItem) {
//       handleEdit({ ...selectedItem, ...values });
//     }
//   };

//   const openDelete = (material: any) => {
//     setSelectedForDelete(material);
//     setDeleteDialogOpen(true);
//   };

//   const confirmDelete = () => {
//     if (selectedForDelete) {
//       handleDelete(selectedForDelete.id);
//       setDeleteDialogOpen(false);
//       setSelectedForDelete(null);
//     }
//   };

//   // Stock status calculation
//   const getStockStatus = (quantity: number, minQuantity: number, maxQuantity: number) => {
//     if (quantity <= minQuantity) return { status: "Low", color: "bg-red-100 text-red-800" };
//     if (quantity >= maxQuantity * 0.9) return { status: "Full", color: "bg-green-100 text-green-800" };
//     return { status: "Normal", color: "bg-blue-100 text-blue-800" };
//   };

//   // Grid templates
//   const stockStatusTemplate = (props: any) => {
//     const { quantity, minQuantity, maxQuantity } = props;
//     const { status, color } = getStockStatus(quantity, minQuantity, maxQuantity);
//     return (
//       <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>
//         {status}
//       </span>
//     );
//   };

//   const actionTemplate = (props: any) => {
//     const material = props;
//     return (
//       <div className="flex gap-2">
//         <button 
//           className="text-blue-600 hover:underline text-sm"
//           onClick={() => openView(material)}
//         >
//           View
//         </button>
//         <button 
//           className="text-green-600 hover:underline text-sm"
//           onClick={() => openEdit(material)}
//         >
//           Edit
//         </button>
//         <button 
//           className="text-red-600 hover:underline text-sm"
//           onClick={() => openDelete(material)}
//         >
//           Delete
//         </button>
//       </div>
//     );
//   };

//   // Toolbar actions
//   const toolbarOptions = [
//     { text: 'Add Material', tooltipText: 'Add Material', prefixIcon: 'e-add', id: 'add' },
//     { text: 'Print', tooltipText: 'Print', prefixIcon: 'e-print', id: 'print' },
//     { text: 'Excel Export', tooltipText: 'Excel Export', prefixIcon: 'e-excelexport', id: 'excelexport' }
//   ];

//   const toolbarClick = (args: any) => {
//     if (args.item.id === 'add') {
//       openAdd();
//     }
//   };

//   return (
//     <div className="p-4 space-y-6">
//       {/* Header with Stats */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//         <div className="bg-white p-4 rounded-lg shadow">
//           <h3 className="text-gray-500 text-sm">Total Materials</h3>
//           <p className="text-2xl font-bold text-gray-800">{materials.length}</p>
//         </div>
//         <div className="bg-white p-4 rounded-lg shadow">
//           <h3 className="text-gray-500 text-sm">Low Stock</h3>
//           <p className="text-2xl font-bold text-red-600">
//             {materials.filter(m => m.quantity <= m.minQuantity).length}
//           </p>
//         </div>
//         <div className="bg-white p-4 rounded-lg shadow">
//           <h3 className="text-gray-500 text-sm">Categories</h3>
//           <p className="text-2xl font-bold text-gray-800">
//             {[...new Set(materials.map(m => m.category))].length}
//           </p>
//         </div>
//         <div className="bg-white p-4 rounded-lg shadow">
//           <h3 className="text-gray-500 text-sm">Total Value</h3>
//           <p className="text-2xl font-bold text-green-600">
//             ${materials.reduce((sum, m) => sum + (m.quantity * m.unitPrice), 0).toLocaleString()}
//           </p>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="bg-white rounded-lg shadow">
//         <div className="p-4 border-b">
//           <div className="flex justify-between items-center">
//             <div>
//               <h1 className="text-2xl font-bold text-gray-800">Material Management</h1>
//               <p className="text-gray-600">Manage construction materials, stock levels, and suppliers</p>
//             </div>
//             <div className="flex gap-3">
//               <button
//                 onClick={openAdd}
//                 className="bg-[var(--bs-primary)] hover:bg-[#162b4a] text-white px-4 py-2 rounded-lg transition-colors"
//               >
//                 + Add Material
//               </button>
//               <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition-colors">
//                 Export
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Data Grid */}
//         <div className="p-4">
//           <GridComponent
//             dataSource={materials}
//             allowPaging={true}
//             pageSettings={{ pageSize: 10 }}
//             allowSorting={true}
//             allowFiltering={true}
//             toolbar={toolbarOptions}
//             toolbarClick={toolbarClick}
//             height="auto"
//           >
//             <ColumnsDirective>
//               <ColumnDirective field="code" headerText="Code" width={120} />
//               <ColumnDirective field="name" headerText="Material Name" width={180} />
//               <ColumnDirective field="category" headerText="Category" width={120} />
//               <ColumnDirective field="unit" headerText="Unit" width={80} />
//               <ColumnDirective field="unitPrice" headerText="Unit Price" width={100} format="C2" />
//               <ColumnDirective field="quantity" headerText="Stock" width={100} />
//               <ColumnDirective 
//                 headerText="Stock Status" 
//                 width={120} 
//                 template={stockStatusTemplate}
//               />
//               <ColumnDirective field="supplier" headerText="Supplier" width={150} />
//               <ColumnDirective field="location" headerText="Location" width={150} />
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

//       {/* Quick Actions Panel */}
//       <div className="bg-white rounded-lg shadow p-4">
//         <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//           <button className="p-3 bg-blue-50 hover:bg-blue-100 rounded-lg text-blue-700">
//             <div className="font-medium">Generate PO</div>
//             <div className="text-sm text-blue-600">Create Purchase Order</div>
//           </button>
//           <button className="p-3 bg-green-50 hover:bg-green-100 rounded-lg text-green-700">
//             <div className="font-medium">Stock Report</div>
//             <div className="text-sm text-green-600">View Stock Report</div>
//           </button>
//           <button className="p-3 bg-yellow-50 hover:bg-yellow-100 rounded-lg text-yellow-700">
//             <div className="font-medium">Low Stock Alert</div>
//             <div className="text-sm text-yellow-600">{materials.filter(m => m.quantity <= m.minQuantity).length} items</div>
//           </button>
//           <button className="p-3 bg-purple-50 hover:bg-purple-100 rounded-lg text-purple-700">
//             <div className="font-medium">Supplier List</div>
//             <div className="text-sm text-purple-600">Manage Suppliers</div>
//           </button>
//         </div>
//       </div>

//       {/* Recent Activities */}
//       <div className="bg-white rounded-lg shadow p-4">
//         <h2 className="text-lg font-semibold mb-4">Recent Material Activities</h2>
//         <div className="space-y-3">
//           {materials.slice(0, 3).map(material => (
//             <div key={material.id} className="flex items-center justify-between p-3 border rounded-lg">
//               <div>
//                 <span className="font-medium">{material.name}</span>
//                 <span className="text-sm text-gray-600 ml-2">({material.code})</span>
//                 <div className="text-sm text-gray-500">
//                   Stock: {material.quantity} {material.unit} • Last updated: Today
//                 </div>
//               </div>
//               <span className={`px-3 py-1 rounded-full text-sm ${
//                 getStockStatus(material.quantity, material.minQuantity, material.maxQuantity).color
//               }`}>
//                 {getStockStatus(material.quantity, material.minQuantity, material.maxQuantity).status}
//               </span>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Add/Edit/View Dialog */}
//       <DialogComponent
//         visible={isDialogOpen}
//         width="800px"
//         header={`${mode === "add" ? "Add" : mode === "edit" ? "Edit" : "View"} Material`}
//         showCloseIcon={true}
//         isModal={true}
//         close={() => setIsDialogOpen(false)}
//       >
//         <div className="p-4">
//           <CrudForm
//             mode={mode}
//             fields={materialFields}
//             initialValues={selectedItem || {}}
//             onSubmit={handleSubmit}
//             onCancel={() => setIsDialogOpen(false)}
//           />
//         </div>
//       </DialogComponent>

//       {/* Delete Confirmation Dialog */}
//       <DialogComponent
//         visible={deleteDialogOpen}
//         width="400px"
//         header="Delete Material"
//         isModal={true}
//         showCloseIcon={true}
//         close={() => setDeleteDialogOpen(false)}
//       >
//         <div className="p-4">
//           <p className="text-gray-700 mb-4">
//             Are you sure you want to delete material <strong>{selectedForDelete?.name}</strong>?
//             <br />
//             <span className="text-red-600 text-sm">
//               This action cannot be undone.
//             </span>
//           </p>
//           <div className="flex justify-end gap-3">
//             <button
//               className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
//               onClick={() => setDeleteDialogOpen(false)}
//             >
//               Cancel
//             </button>
//             <button
//               className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
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

// export default MaterialPage;





import { useState, useEffect, useCallback } from "react";
import type { Field } from "@/components/CrudForm";
import BaseCrudPage from "../components/BaseCrudPage";
import MainLayout from "../components/MainLayout";
import { 
  fetchMaterials, 
  addMaterial, 
  updateMaterial, 
  deleteMaterial, 
  mapDbToForm,
  getMaterialStats 
} from "../services/MaterialService";

// =====================
// Material Fields (Full Form)
// =====================
const materialFields: Field[] = [
  { name: "code", label: "Material Code", type: "text", required: true },
  { name: "name", label: "Material Name", type: "text", required: true },

  {
    name: "category",
    label: "Category",
    type: "select",
    options: ["Structural", "Finishing", "Plumbing", "Electrical", "Hardware", "Other"],
    required: true
  },

  {
    name: "unit",
    label: "Unit of Measure",
    type: "select",
    options: ["kg", "m", "m²", "m³", "pcs", "L", "bag", "roll", "set"],
    required: true
  },

  { name: "unitPrice", label: "Unit Price ($)", type: "number" },
  { name: "quantity", label: "Current Stock", type: "number", required: true },
  { name: "minQuantity", label: "Minimum Stock Level", type: "number" },
  { name: "maxQuantity", label: "Maximum Stock Level", type: "number" },

  { name: "supplier", label: "Supplier", type: "text", required: true },
  { name: "supplierContact", label: "Supplier Contact", type: "text" },
  { name: "location", label: "Storage Location", type: "text" },
  { name: "description", label: "Description", type: "textarea" },
  { name: "isActive", label: "Active", type: "checkbox" },
];

// =====================
// Stock Status Template
// =====================
const getStockStatus = (quantity: number, min: number, max: number) => {
  if (quantity <= min) return { label: "Low", color: "bg-red-100 text-red-800" };
  if (quantity >= max * 0.9) return { label: "Full", color: "bg-green-100 text-green-800" };
  return { label: "Normal", color: "bg-blue-100 text-blue-800" };
};

const stockStatusTemplate = (props: any) => {
  const { label, color } = getStockStatus(
    props.quantity,
    props.minQuantity,
    props.maxQuantity
  );

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>
      {label}
    </span>
  );
};

// =====================
// Grid Columns
// =====================
// =====================
// =====================
// Grid Columns
// =====================
const materialGridColumns = [
  { field: "code", headerText: "Code", width: 110 },
  { field: "name", headerText: "Material", width: 180 },
  { field: "category", headerText: "Category", width: 120 },
  { field: "unit", headerText: "Unit", width: 80 },
  { 
    field: "unitPrice", 
    headerText: "Unit Price ($)", 
    width: 120,
    // Add formatting to ensure number displays
    format: 'C2' 
  },
  { 
    field: "quantity", 
    headerText: "Stock", 
    width: 100,
    format: 'N2' 
  },
  { 
    headerText: "Stock Status", 
    width: 120, 
    template: stockStatusTemplate 
  },
  { field: "supplier", headerText: "Supplier", width: 150 },
];

// =====================
// Summary Cards Component
// =====================
const MaterialSummaryCards = ({ materials }: { materials: any[] }) => {
  const [stats, setStats] = useState({
    total_materials: 0,
    low_stock_items: 0,
    total_categories: 0,
    total_inventory_value: 0
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await getMaterialStats();
        setStats(data);
      } catch (error) {
        console.error('Error loading stats:', error);
      }
    };
    loadStats();
  }, [materials]);

  // Calculate from materials if stats not available
  const totalValue = materials.reduce((sum, m) => sum + (m.quantity * m.unitPrice), 0);
  const lowStock = materials.filter(m => m.quantity <= m.minQuantity).length;
  const categories = [...new Set(materials.map(m => m.category))].length;

  return (
    <>
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-sm text-gray-500">Total Materials</h3>
        <p className="text-2xl font-bold">{stats.total_materials || materials.length}</p>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-sm text-gray-500">Low Stock</h3>
        <p className="text-2xl font-bold text-red-600">
          {stats.low_stock_items || lowStock}
        </p>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-sm text-gray-500">Categories</h3>
        <p className="text-2xl font-bold">
          {stats.total_categories || categories}
        </p>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-sm text-gray-500">Total Value</h3>
        <p className="text-2xl font-bold text-green-600">
          ${(stats.total_inventory_value || totalValue).toLocaleString()}
        </p>
      </div>
    </>
  );
};

// =====================
// Material Page
// =====================
const MaterialPage = () => {
  const [materials, setMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch materials
  const loadMaterials = useCallback(async (): Promise<any[]> => {
    try {
      setLoading(true);
      console.log('Fetching materials...');
      const data = await fetchMaterials();
      console.log('Fetched materials:', data);
      setMaterials(data);
      setError(null);
      return data;
    } catch (err: any) {
      console.error('Error fetching materials:', err);
      setError('Failed to load materials');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Load data on mount
  useEffect(() => {
    loadMaterials();
  }, [loadMaterials]);

  // Handle add
  const handleAdd = async (values: any) => {
    try {
      console.log('Adding material:', values);
      await addMaterial(values);
      await loadMaterials();
      return { success: true };
    } catch (err: any) {
      console.error('Error adding material:', err);
      alert(err.message);
      return { success: false };
    }
  };

  // Handle edit
  const handleEdit = async (values: any) => {
    try {
      console.log('Editing material:', values);
      await updateMaterial(values.id, values);
      await loadMaterials();
      return { success: true };
    } catch (err: any) {
      console.error('Error updating material:', err);
      alert(err.message);
      return { success: false };
    }
  };

  // Handle delete
  const handleDelete = async (id: number) => {
    try {
      console.log('Deleting material:', id);
      await deleteMaterial(id);
      await loadMaterials();
      return { success: true };
    } catch (err: any) {
      console.error('Error deleting material:', err);
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

  if (loading && materials.length === 0) {
    return (
      <MainLayout role="SUPER_ADMIN" pageTitle="Material Management" showLogout={true}>
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Loading materials...</div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout role="SUPER_ADMIN" pageTitle="Material Management" showLogout={true}>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout
      role="SUPER_ADMIN"
      pageTitle="Material Management"
      showLogout={true}
    >
      <BaseCrudPage
        title="Material Management"
        description="Manage construction materials, stock levels, and suppliers"
        fields={materialFields}
        initialData={materials}
        gridColumns={materialGridColumns}
        summaryCards={<MaterialSummaryCards materials={materials} />}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        onDataChange={loadMaterials}
      />
    </MainLayout>
  );
};

export default MaterialPage;

