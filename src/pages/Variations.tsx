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



import React, { useState, useEffect, useCallback } from 'react';
import type { Field } from "@/components/CrudForm";
import BaseCrudPage from "../components/BaseCrudPage";
import MainLayout from "../components/MainLayout";
import { useNavigate } from "react-router-dom";
import variationsApi from '../services/variationsApi';
import projectsApi from '../services/projectsApi';

// =====================
// Helper function to format date for display
// =====================
const formatDateForDisplay = (dateString: string): string => {
  if (!dateString) return '';
  
  // If it's already in YYYY-MM-DD format
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  }
  
  // Try to parse as date
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  } catch {
    return '';
  }
};

// =====================
// Helper function to format date for input (YYYY-MM-DD)
// =====================
const formatDateForInput = (dateString: string): string => {
  if (!dateString) return '';
  
  // If it's already in YYYY-MM-DD format
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return dateString;
  }
  
  // Try to parse as date
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  } catch {
    return '';
  }
};

// =====================
// Status Badge Template
// =====================
const statusTemplate = (props: any) => {
  const status = props.status;
  const styles: Record<string, string> = {
    "Requested": "bg-yellow-100 text-yellow-800",
    "Approved": "bg-green-100 text-green-800",
    "Rejected": "bg-red-100 text-red-800",
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status] || "bg-gray-100"}`}>
      {status}
    </span>
  );
};

// =====================
// Amount Template
// =====================
const amountTemplate = (props: any) => {
  const amount = props.amount || 0;
  const isNegative = amount < 0;
  return (
    <span className={isNegative ? "text-red-600" : "text-green-600 font-medium"}>
      ${Math.abs(amount).toLocaleString()}
      {isNegative && <span className="ml-1 text-xs">(Credit)</span>}
    </span>
  );
};

// =====================
// Date Template
// =====================
const dateTemplate = (props: any) => {
  const rowData = props.rowData || props;
  const dateStr = rowData.request_date;
  
  if (!dateStr) return <span className="text-gray-400">Not set</span>;
  
  const formattedDate = formatDateForDisplay(dateStr);
  return formattedDate ? <span>{formattedDate}</span> : <span className="text-gray-400">Invalid date</span>;
};

// =====================
// Project Template
// =====================
const projectTemplate = (props: any) => {
  const projectName = props.project_name;
  if (!projectName) return <span className="text-gray-400">Unknown</span>;
  return <span className="font-medium text-blue-600">{projectName}</span>;
};

// =====================
// Data Transformers
// =====================
const mapApiToForm = (apiData: any) => {
  if (!apiData) return {};
  
  console.log('Mapping API data:', {
    id: apiData.id,
    project: apiData.project_name,
    request_date: apiData.request_date,
    amount: apiData.amount
  });
  
  // Format date for input field
  const formattedDate = formatDateForInput(apiData.request_date);
  
  return {
    id: apiData.id,
    project_id: apiData.project_id,
    project_name: apiData.project_name,
    amount: Number(apiData.amount) || 0,
    description: apiData.description || '',
    date: formattedDate, // This is for the form input (YYYY-MM-DD)
    status: apiData.status,
    requestedBy: apiData.requested_by,
    requested_by: apiData.requested_by,
    approvedBy: apiData.approved_by,
    approvalDate: apiData.approval_date,
    rejectionReason: apiData.rejection_reason,
    // Keep original for grid
    request_date: apiData.request_date,
  };
};

const mapFormToApi = (formData: any) => {
  return {
    project_id: formData.project_id,
    amount: parseFloat(formData.amount) || 0,
    description: formData.description,
    date: formData.date,
    status: formData.status,
    requestedBy: formData.requestedBy,
  };
};

// =====================
// Grid Columns
// =====================
const variationGridColumns = [
  { field: "project_name", headerText: "Project", width: 180, template: projectTemplate },
  { field: "amount", headerText: "Amount ($)", width: 130, template: amountTemplate },
  { field: "request_date", headerText: "Date", width: 120, template: dateTemplate },
  { field: "status", headerText: "Status", width: 130, template: statusTemplate },
  { field: "requested_by", headerText: "Requested By", width: 150 },
  { field: "description", headerText: "Description", width: 200 },
];

// =====================
// Summary Cards
// =====================
const VariationSummaryCards = ({ variations }: { variations: any[] }) => {
  const pending = variations.filter(v => v.status === "Requested").length;
  const approved = variations.filter(v => v.status === "Approved").length;
  const rejected = variations.filter(v => v.status === "Rejected").length;
  
  const total = variations.reduce((sum, v) => {
    const amount = Number(v.amount) || 0;
    return sum + amount;
  }, 0);
  
  const approvedAmount = variations
    .filter(v => v.status === "Approved")
    .reduce((sum, v) => {
      const amount = Number(v.amount) || 0;
      return sum + amount;
    }, 0);
  
  return (
    <>
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-sm text-gray-500">Total Requests</h3>
        <p className="text-2xl font-bold">{variations.length}</p>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-sm text-gray-500">Pending</h3>
        <p className="text-2xl font-bold text-yellow-600">{pending}</p>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-sm text-gray-500">Approved</h3>
        <p className="text-2xl font-bold text-green-600">{approved}</p>
        <div className="text-xs text-gray-500">${approvedAmount.toLocaleString()}</div>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-sm text-gray-500">Total Value</h3>
        <p className="text-2xl font-bold text-blue-600">${total.toLocaleString()}</p>
      </div>
    </>
  );
};

// =====================
// Main Page Component
// =====================
const VariationsPage = () => {
  const [variations, setVariations] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [projectNames, setProjectNames] = useState<string[]>([]);
  const navigate = useNavigate();

  // Load projects for dropdown
  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await projectsApi.getProjects();
        console.log('✅ Projects loaded:', data);
        setProjects(data);
        setProjectNames(data.map((p: any) => p.name));
      } catch (err) {
        console.error('Error loading projects:', err);
      }
    };
    loadProjects();
  }, []);

  // Load variations
  const loadVariations = useCallback(async (): Promise<any[]> => {
    setLoading(true);
    try {
      console.log('📡 Loading variations...');
      const data = await variationsApi.getVariations();
      console.log('✅ Variations loaded:', data);
      
      const mapped = data.map(mapApiToForm);
      console.log('✅ Mapped variations:', mapped.map((v: any) => ({
        id: v.id,
        project: v.project_name,
        date: v.date,
        amount: v.amount
      })));
      
      setVariations(mapped);
      setError('');
      return mapped;
    } catch (err: any) {
      console.error('❌ Error:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }
    loadVariations();
  }, [navigate, loadVariations]);

  // Dynamic fields
  const getFields = (): Field[] => {
    return [
      {
        name: "project_id",
        label: "Project",
        type: "select",
        options: projectNames,
        required: true
      },
      {
        name: "amount",
        label: "Amount ($)",
        type: "number",
        required: true
      },
      {
        name: "description",
        label: "Description",
        type: "textarea"
      },
      {
        name: "date",
        label: "Request Date",
        type: "date",
        required: true
      },
      {
        name: "status",
        label: "Status",
        type: "select",
        options: ["Requested", "Approved", "Rejected"],
        required: true
      },
      {
        name: "requestedBy",
        label: "Requested By",
        type: "text",
        required: true
      }
    ];
  };

  const handleAdd = async (values: any) => {
    try {
      const selectedProject = projects.find(p => p.name === values.project_id);
      if (!selectedProject) {
        throw new Error('Please select a valid project');
      }
      
      const apiData = {
        project_id: selectedProject.id,
        amount: parseFloat(values.amount) || 0,
        description: values.description,
        date: values.date,
        status: values.status,
        requestedBy: values.requestedBy,
      };
      
      console.log('Adding variation with data:', apiData);
      await variationsApi.createVariation(apiData);
      await loadVariations();
      return { success: true };
    } catch (err: any) {
      console.error('Add error:', err);
      alert(err.message);
      return { success: false };
    }
  };

  const handleEdit = async (values: any) => {
    try {
      const selectedProject = projects.find(p => p.name === values.project_id);
      if (!selectedProject) {
        throw new Error('Please select a valid project');
      }
      
      const apiData = {
        project_id: selectedProject.id,
        amount: parseFloat(values.amount) || 0,
        description: values.description,
        date: values.date,
        status: values.status,
        requestedBy: values.requestedBy,
      };
      
      console.log('Editing variation ID:', values.id, 'with data:', apiData);
      await variationsApi.updateVariation(values.id, apiData);
      await loadVariations();
      return { success: true };
    } catch (err: any) {
      console.error('Edit error:', err);
      alert(err.message);
      return { success: false };
    }
  };

  const handleDelete = async (id: number) => {
    try {
      console.log('Deleting variation ID:', id);
      await variationsApi.deleteVariation(id);
      await loadVariations();
      return { success: true };
    } catch (err: any) {
      console.error('Delete error:', err);
      alert(err.message);
      return { success: false };
    }
  };

  // FIXED: Handle view mode - ensure date is properly formatted for display
  // FIXED: Handle view mode - ensure date is properly formatted
const handleView = (item: any) => {
  console.log('Viewing item - raw:', item);
  
  const projectName = projects.find(p => p.id === item.project_id)?.name || item.project_name;
  
  // For view mode, we need to return the date in the format expected by the form
  // The form might be expecting YYYY-MM-DD for the date input
  const viewItem = {
    id: item.id,
    project_id: projectName, // Show project name instead of ID
    amount: item.amount,
    description: item.description,
    date: item.date, // Keep the original YYYY-MM-DD format for the input
    status: item.status,
    requestedBy: item.requestedBy,
    // Add display version if needed
    displayDate: item.date ? formatDateForDisplay(item.date) : '',
  };
  
  console.log('Viewing item - formatted for view:', viewItem);
  return viewItem;
};

  // Add debug effect
  useEffect(() => {
    if (variations.length > 0) {
      console.log('Current variations in state:', variations);
    }
  }, [variations]);

  if (loading && variations.length === 0) {
    return (
      <MainLayout role="SUPER_ADMIN" pageTitle="Project Variations" showLogout={true}>
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Loading variations...</div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout role="SUPER_ADMIN" pageTitle="Project Variations" showLogout={true}>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Error: {error}
        </div>
      )}
      
      <BaseCrudPage
        title="Project Variation"
        description="Request and manage additional works during ongoing projects"
        fields={getFields()}
        initialData={variations}
        gridColumns={variationGridColumns}
        summaryCards={<VariationSummaryCards variations={variations} />}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        onDataChange={loadVariations}
      />
    </MainLayout>
  );
};

export default VariationsPage;