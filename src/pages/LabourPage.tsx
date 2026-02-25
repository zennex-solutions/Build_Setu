import { useState, useEffect, useCallback } from "react";
import type { Field } from "@/components/CrudForm";
import BaseCrudPage from "../components/BaseCrudPage";
import MainLayout from "../components/MainLayout";
import projectsApi from '../services/projectsApi';

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
// Data Transformers
// =====================
// =====================
// Data Transformers - FIXED
// =====================
// =====================
// Data Transformers - FIXED
// =====================
const mapDbToForm = (dbRecord: any, projectMap: Record<number, string>) => {
  if (!dbRecord) return {};
  
  console.log('Mapping labour DB record:', {
    id: dbRecord.id,
    labour_id: dbRecord.labour_id,  // Check this value
    name: dbRecord.name,
  });
  
  return {
    id: dbRecord.id,
    labourId: dbRecord.labour_id || '',  // Map to camelCase for form
    labour_id: dbRecord.labour_id || '',  // Keep snake_case for grid
    name: dbRecord.name || '',
    contactNumber: dbRecord.contact_number || '',
    contact_number: dbRecord.contact_number || '',
    email: dbRecord.email || '',
    category: dbRecord.category || 'Semi-skilled',
    trade: dbRecord.trade || 'Helper',
    dailyRate: dbRecord.daily_rate ? Number(dbRecord.daily_rate) : '',
    daily_rate: dbRecord.daily_rate,
    contractType: dbRecord.contract_type || 'Daily',
    contract_type: dbRecord.contract_type || 'Daily',
    status: dbRecord.status || 'Active',
    project_id: dbRecord.project_id,
    project_name: projectMap[dbRecord.project_id] || dbRecord.project_name || 'No Project',
    address: dbRecord.address || '',
    notes: dbRecord.notes || '',
  };
};

const mapFormToDb = (formValues: any) => {
  console.log('Mapping form to DB - form values:', formValues);
  
  return {
    labourId: formValues.labourId,
    name: formValues.name,
    contactNumber: formValues.contactNumber,  // Will be mapped to contact_number in API
    email: formValues.email,
    category: formValues.category,
    trade: formValues.trade,
    dailyRate: formValues.dailyRate ? parseFloat(formValues.dailyRate) : null,  // Will be mapped to daily_rate
    contractType: formValues.contractType,  // Will be mapped to contract_type
    status: formValues.status,
    project_id: formValues.project_id,
    address: formValues.address,
    notes: formValues.notes,
  };
};

// =====================
// Status Badge Template
// =====================
const statusTemplate = (props: any) => {
  const rowData = props.rowData || props;
  const status = rowData.status;
  
  const colors: Record<string, string> = {
    Active: "bg-green-100 text-green-800",
    "On Leave": "bg-yellow-100 text-yellow-800",
    Terminated: "bg-red-100 text-red-800",
    Inactive: "bg-gray-100 text-gray-800",
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status] || "bg-gray-100 text-gray-800"}`}>
      {status}
    </span>
  );
};

// =====================
// Project Template
// =====================
const projectTemplate = (props: any) => {
  const rowData = props.rowData || props;
  const projectName = rowData.project_name;
  
  if (!projectName || projectName === 'No Project') {
    return <span className="text-gray-400 italic">Not Assigned</span>;
  }
  
  return <span className="font-medium text-blue-600">{projectName}</span>;
};


// =====================
// Grid Columns - Make sure project_name field is included
// =====================
// =====================
// Grid Columns
// =====================
const labourGridColumns = [
  { field: "labour_id", headerText: "Labour ID", width: 100 },  // This should match the field name
  { field: "name", headerText: "Name", width: 150 },
  { field: "contact_number", headerText: "Contact", width: 120 },
  { field: "email", headerText: "Email", width: 180 },
  { field: "trade", headerText: "Trade", width: 120 },
  { field: "category", headerText: "Category", width: 120 },
  { field: "daily_rate", headerText: "Daily Rate (₹)", width: 120 },
  { field: "contract_type", headerText: "Contract", width: 100 },
  { field: "status", headerText: "Status", width: 100, template: statusTemplate },
  { field: "project_name", headerText: "Project", width: 150, template: projectTemplate },
];
// =====================
// Summary Cards Component
// =====================
const LabourSummaryCards = ({ labour }: { labour: any[] }) => {
  const activeLabour = labour.filter(l => l.status === "Active").length;
  const onLeaveLabour = labour.filter(l => l.status === "On Leave").length;
  const terminatedLabour = labour.filter(l => l.status === "Terminated").length;
  const skilledLabour = labour.filter(l => l.category === "Skilled").length;
  
  const uniqueTrades = new Set(labour.map(l => l.trade).filter(Boolean)).size;
  
  const monthlyCost = labour
    .filter(l => l.status === "Active")
    .reduce((sum, l) => {
      const dailyRate = Number(l.daily_rate) || 0;
      return sum + (dailyRate * 26);
    }, 0);

  const assignedToProject = labour.filter(l => l.project_id).length;

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
        <h3 className="text-sm text-gray-500">On Projects</h3>
        <p className="text-2xl font-bold text-blue-600">{assignedToProject}</p>
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
  const [projects, setProjects] = useState<any[]>([]);
  const [projectNames, setProjectNames] = useState<string[]>([]);
  const [projectMap, setProjectMap] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load projects for dropdown
  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await projectsApi.getProjects();
        console.log('✅ Projects loaded:', data);
        setProjects(data);
        
        // Create project names array for dropdown
        setProjectNames(data.map((p: any) => p.name));
        
        // Create project map for quick lookup
        const map: Record<number, string> = {};
        data.forEach((p: any) => {
          map[p.id] = p.name;
        });
        setProjectMap(map);
      } catch (err) {
        console.error('Error loading projects:', err);
      }
    };
    loadProjects();
  }, []);

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
      
      // Transform with project map
      const transformedLabour = (data.labour || []).map((item: any) => 
        mapDbToForm(item, projectMap)
      );
      
      setLabourData(transformedLabour);
      setError(null);
      return transformedLabour;
    } catch (err) {
      console.error('Error fetching labour:', err);
      setError('Failed to load labour data');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [projectMap]);

  // Load data on component mount
  useEffect(() => {
    if (Object.keys(projectMap).length > 0) {
      fetchLabour();
    }
  }, [fetchLabour, projectMap]);

  // Get dynamic fields with project options
  // Get dynamic fields with project options
const getLabourFields = (): Field[] => {
  return [
    { name: "labourId", label: "Labour ID", type: "text", required: true },
    { name: "name", label: "Full Name", type: "text", required: true },
    { name: "contactNumber", label: "Contact Number", type: "text" }, // This maps to contact_number
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

    { name: "dailyRate", label: "Daily Rate (₹)", type: "number" }, // This maps to daily_rate

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

    {
      name: "project_id",
      label: "Assigned Project",
      type: "select",
      options: projectNames,
    },

    { name: "address", label: "Address", type: "textarea" },
    { name: "notes", label: "Notes", type: "textarea" },
  ];
};

  // Handle add labour
  const handleAdd = async (values: any) => {
    try {
      // Find project ID from selected project name
      const selectedProject = projects.find(p => p.name === values.project_id);
      
      const dbData = {
        ...mapFormToDb(values),
        project_id: selectedProject?.id || null
      };
      
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
      
      await fetchLabour();
      return { success: true };
    } catch (err: any) {
      console.error('Error adding labour:', err);
      alert(err.message);
      return { success: false };
    }
  };

  // Handle edit labour
  const handleEdit = async (values: any) => {
    try {
      // Find project ID from selected project name
      const selectedProject = projects.find(p => p.name === values.project_id);
      
      const dbData = {
        ...mapFormToDb(values),
        project_id: selectedProject?.id || null
      };
      
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
      
      await fetchLabour();
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
      
      await fetchLabour();
      return { success: true };
    } catch (err: any) {
      console.error('Error deleting labour:', err);
      alert(err.message);
      return { success: false };
    }
  };

  // Handle view labour
  const handleView = (item: any) => {
    console.log('Viewing item:', item);
    // For view mode, show project name instead of ID
    const viewItem = {
      ...item,
      project_id: item.project_name || 'Not Assigned'
    };
    console.log('Transformed for view:', viewItem);
    return viewItem;
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
        fields={getLabourFields()}
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