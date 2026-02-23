import { useState, useEffect, useCallback } from "react";
import type { Field } from "@/components/CrudForm";
import BaseCrudPage from "../components/BaseCrudPage";
import MainLayout from "../components/MainLayout";

// =====================
// Data Transformers - IMPORTANT: Map between DB snake_case and Form camelCase
// =====================
const mapDbToForm = (dbRecord: any) => {
  if (!dbRecord) return {};
  
  return {
    id: dbRecord.id,
    labourId: dbRecord.labour_id || '',
    name: dbRecord.name || '',
    contactNumber: dbRecord.contact_number || '',
    email: dbRecord.email || '',
    category: dbRecord.category || 'Semi-skilled',
    trade: dbRecord.trade || 'Helper',
    dailyRate: dbRecord.daily_rate ? Number(dbRecord.daily_rate) : '',
    contractType: dbRecord.contract_type || 'Daily',
    status: dbRecord.status || 'Active',
    assignedProject: dbRecord.assigned_project || '',
    address: dbRecord.address || '',
    notes: dbRecord.notes || '',
  };
};

const mapFormToDb = (formValues: any) => {
  return {
    labourId: formValues.labourId,
    name: formValues.name,
    contactNumber: formValues.contactNumber,
    email: formValues.email,
    category: formValues.category,
    trade: formValues.trade,
    dailyRate: formValues.dailyRate ? parseFloat(formValues.dailyRate) : null,
    contractType: formValues.contractType,
    status: formValues.status,
    assignedProject: formValues.assignedProject,
    address: formValues.address,
    notes: formValues.notes,
  };
};

// =====================
// Labour Fields (Form Fields - using camelCase)
// =====================
const labourFields: Field[] = [
  { name: "labourId", label: "Labour ID", type: "text" },
  { name: "name", label: "Full Name", type: "text" },
  { name: "contactNumber", label: "Contact Number", type: "text" },
  { name: "email", label: "Email", type: "text" },

  {
    name: "category",
    label: "Category",
    type: "select",
    options: ["Skilled", "Semi-skilled", "Unskilled", "Foreman", "Supervisor"],
  },

  {
    name: "trade",
    label: "Trade",
    type: "select",
    options: [
      "Carpenter",
      "Mason",
      "Electrician",
      "Plumber",
      "Painter",
      "Welder",
      "Helper",
      "Operator",
      "Steel Fixer",
    ],
  },

  { name: "dailyRate", label: "Daily Rate (₹)", type: "number" },

  {
    name: "contractType",
    label: "Contract Type",
    type: "select",
    options: ["Daily", "Weekly", "Monthly", "Project-based"],
  },

  {
    name: "status",
    label: "Employment Status",
    type: "select",
    options: ["Active", "On Leave", "Terminated", "Inactive"],
  },

  { name: "assignedProject", label: "Assigned Project", type: "text" },
  { name: "address", label: "Address", type: "textarea" },
  { name: "notes", label: "Notes", type: "textarea" },
];

// =====================
// Status Badge Template
// =====================
const statusTemplate = (props: any) => {
  const colors: Record<string, string> = {
    Active: "bg-green-100 text-green-800",
    "On Leave": "bg-yellow-100 text-yellow-800",
    Terminated: "bg-red-100 text-red-800",
    Inactive: "bg-gray-100 text-gray-800",
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[props.status] || "bg-gray-100 text-gray-800"}`}>
      {props.status}
    </span>
  );
};

// =====================
// Grid Columns (using snake_case for database fields)
// =====================
const labourGridColumns = [
  { field: "labour_id", headerText: "Labour ID", width: 100 },
  { field: "name", headerText: "Name", width: 150 },
  { field: "contact_number", headerText: "Contact", width: 120 },
  { field: "email", headerText: "Email", width: 180 },
  { field: "trade", headerText: "Trade", width: 120 },
  { field: "category", headerText: "Category", width: 120 },
  { field: "daily_rate", headerText: "Daily Rate (₹)", width: 120 },
  { field: "contract_type", headerText: "Contract", width: 100 },
  { field: "status", headerText: "Status", width: 100, template: statusTemplate },
  { field: "assigned_project", headerText: "Project", width: 150 },
];

// =====================
// API Service Functions
// =====================
const API_BASE = 'http://localhost:5000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
};

// =====================
// Summary Cards Component
// =====================
const LabourSummaryCards = ({ labour }: { labour: any[] }) => {
  // Helper function to get value from either camelCase or snake_case property
  const getValue = (item: any, camelProp: string, snakeProp: string) => {
    return item[camelProp] !== undefined ? item[camelProp] : item[snakeProp];
  };

  // Calculate statistics with fallback for both naming conventions
  const activeLabour = labour.filter(l => 
    getValue(l, 'status', 'status') === "Active"
  ).length;
  
  const onLeaveLabour = labour.filter(l => 
    getValue(l, 'status', 'status') === "On Leave"
  ).length;
  
  const terminatedLabour = labour.filter(l => 
    getValue(l, 'status', 'status') === "Terminated"
  ).length;
  
  const skilledLabour = labour.filter(l => 
    getValue(l, 'category', 'category') === "Skilled"
  ).length;
  
  // Get unique trades - check both possible field names
  const uniqueTrades = new Set(
    labour.map(l => getValue(l, 'trade', 'trade')).filter(Boolean)
  ).size;
  
  // Calculate monthly cost - check both possible field names for daily_rate
  const monthlyCost = labour
    .filter(l => getValue(l, 'status', 'status') === "Active")
    .reduce((sum, l) => {
      const dailyRate = Number(getValue(l, 'dailyRate', 'daily_rate')) || 0;
      return sum + (dailyRate * 26);
    }, 0);

  return (
    <>
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-sm text-gray-500">Total Labour</h3>
        <p className="text-2xl font-bold">{labour.length}</p>
        <div className="text-sm text-gray-600 mt-1">
          {skilledLabour} skilled • {labour.length - skilledLabour} others
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-sm text-gray-500">Active</h3>
        <p className="text-2xl font-bold text-green-600">{activeLabour}</p>
        <div className="text-sm text-gray-600 mt-1">
          {onLeaveLabour} on leave
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-sm text-gray-500">Terminated</h3>
        <p className="text-2xl font-bold text-red-600">{terminatedLabour}</p>
        <div className="text-sm text-gray-600 mt-1">
          {uniqueTrades} trades
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-sm text-gray-500">Monthly Cost</h3>
        <p className="text-2xl font-bold text-purple-600">
          ₹{monthlyCost.toLocaleString('en-IN')}
        </p>
        <div className="text-sm text-gray-600 mt-1">
          Approx. labour cost
        </div>
      </div>
    </>
  );
};

// =====================
// Labour Page
// =====================
const LabourPage = () => {
  const [labourData, setLabourData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Memoize fetchLabour to prevent unnecessary re-renders
  const fetchLabour = useCallback(async (): Promise<any[]> => {
    try {
      setLoading(true);
      console.log('Fetching labour data...');
      const response = await fetch(`${API_BASE}/labour`, {
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch labour data');
      }
      
      const data = await response.json();
      console.log('Fetched labour data:', data.labour);
      setLabourData(data.labour || []);
      setError(null);
      return data.labour || [];
    } catch (err) {
      console.error('Error fetching labour:', err);
      setError('Failed to load labour data');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Load data on component mount
  useEffect(() => {
    fetchLabour();
  }, [fetchLabour]);

  // Handle add labour - Transform form data to DB format
  const handleAdd = async (values: any) => {
    try {
      const dbData = mapFormToDb(values);
      console.log('Adding labour - transformed data:', dbData);
      
      const response = await fetch(`${API_BASE}/labour`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(dbData),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to add labour');
      }
      
      const newLabour = await response.json();
      console.log('Add successful, refreshing data...');
      
      // Optimistic update
      setLabourData(prev => [...prev, newLabour.labour || newLabour]);
      
      // Still fetch to ensure consistency with server
      fetchLabour();
      
      return { success: true };
    } catch (err: any) {
      console.error('Error adding labour:', err);
      alert(err.message);
      return { success: false };
    }
  };

  // Handle edit labour - Transform form data to DB format
  const handleEdit = async (values: any) => {
    try {
      const dbData = mapFormToDb(values);
      console.log('Editing labour - transformed data:', dbData);
      
      const response = await fetch(`${API_BASE}/labour/${values.id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(dbData),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update labour');
      }
      
      const updatedLabour = await response.json();
      console.log('Edit successful, refreshing data...');
      
      // Optimistic update
      setLabourData(prev => prev.map(l => 
        l.id === values.id ? (updatedLabour.labour || updatedLabour) : l
      ));
      
      // Still fetch to ensure consistency with server
      fetchLabour();
      
      return { success: true };
    } catch (err: any) {
      console.error('Error updating labour:', err);
      alert(err.message);
      return { success: false };
    }
  };

  // Handle delete labour
  const handleDelete = async (id: number) => {
    try {
      console.log('Deleting labour with id:', id);
      const response = await fetch(`${API_BASE}/labour/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete labour');
      }
      
      console.log('Delete successful, refreshing data...');
      
      // Optimistic update
      setLabourData(prev => prev.filter(l => l.id !== id));
      
      // Still fetch to ensure consistency with server
      fetchLabour();
      
      return { success: true };
    } catch (err: any) {
      console.error('Error deleting labour:', err);
      alert(err.message);
      return { success: false };
    }
  };

  // Handle view labour - Transform DB data to form format
  const handleView = (item: any) => {
    console.log('Viewing item:', item);
    const transformed = mapDbToForm(item);
    console.log('Transformed for view:', transformed);
    return transformed;
  };

  if (loading && labourData.length === 0) {
    return (
      <MainLayout role="SUPER_ADMIN" pageTitle="Labour Management" showLogout={true}>
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Loading labour data...</div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout role="SUPER_ADMIN" pageTitle="Labour Management" showLogout={true}>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </MainLayout>
    );
  }

  console.log('Rendering LabourPage with labourData:', labourData);

  return (
    <MainLayout
      role="SUPER_ADMIN"
      pageTitle="Labour Management"
      showLogout={true}
    >
      <BaseCrudPage
        title="Labour Management"
        description="Manage workforce, attendance and payroll"
        fields={labourFields}
        initialData={labourData}
        gridColumns={labourGridColumns}
        summaryCards={<LabourSummaryCards labour={labourData} />}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        onDataChange={fetchLabour}
      />
    </MainLayout>
  );
};

export default LabourPage;