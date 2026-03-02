import { useState, useEffect, useCallback } from "react";
import type { Field } from "@/components/CrudForm";
import BaseCrudPage from "../components/BaseCrudPage";
import MainLayout from "../components/MainLayout";
import { 
  fetchEquipment, 
  addEquipment, 
  updateEquipment, 
  deleteEquipment, 
  mapDbToForm,
  getEquipmentStats 
} from "../services/EquipmentService";
import suppliersApi from '../services/suppliersApi';
import projectsApi from '../services/projectsApi';

// =====================
// Supplier Template
// =====================
const supplierTemplate = (props: any) => {
  const rowData = props.rowData || props;
  const supplierName = rowData.supplier_name;
  
  if (!supplierName || supplierName === 'No Supplier') {
    return <span className="text-gray-400 italic">No Supplier</span>;
  }
  
  return <span className="font-medium text-blue-600">{supplierName}</span>;
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
  
  return <span className="font-medium text-green-600">{projectName}</span>;
};

// =====================
// Status Template
// =====================
const statusTemplate = (props: any) => {
  const rowData = props.rowData || props;
  const status = rowData.status;
  
  const colors: Record<string, string> = {
    Available: "bg-green-100 text-green-800",
    "In Use": "bg-blue-100 text-blue-800",
    "Under Maintenance": "bg-yellow-100 text-yellow-800",
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status] || 'bg-gray-100'}`}>
      {status}
    </span>
  );
};

// =====================
// Ownership Type Template
// =====================
const ownershipTemplate = (props: any) => {
  const rowData = props.rowData || props;
  const type = rowData.ownership_type;
  
  const colors: Record<string, string> = {
    Owned: "bg-purple-100 text-purple-800",
    Rental: "bg-orange-100 text-orange-800",
    Lease: "bg-cyan-100 text-cyan-800",
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[type] || 'bg-gray-100'}`}>
      {type}
    </span>
  );
};

// =====================
// Price Template
// =====================
const priceTemplate = (props: any) => {
  const rowData = props.rowData || props;
  const price = rowData.price || 0;
  const rateType = rowData.rate_type;
  
  return (
    <span className="font-medium">
      ${price.toLocaleString()}
      {rateType && <span className="text-xs text-gray-500 ml-1">/{rateType.toLowerCase()}</span>}
    </span>
  );
};

// =====================
// Grid Columns
// =====================
const equipmentGridColumns = [
  { field: "name", headerText: "Equipment", width: 180 },
  { field: "category", headerText: "Category", width: 130 },
  { field: "quantity", headerText: "Qty", width: 80 },
  { 
    field: "ownership_type", 
    headerText: "Ownership", 
    width: 120,
    template: ownershipTemplate 
  },
  { 
    field: "price", 
    headerText: "Price/Rate", 
    width: 130,
    template: priceTemplate 
  },
  { 
    field: "status", 
    headerText: "Status", 
    width: 140,
    template: statusTemplate 
  },
  { 
    field: "project_name", 
    headerText: "Project", 
    width: 150,
    template: projectTemplate 
  },
  { 
    field: "supplier_name", 
    headerText: "Supplier", 
    width: 150,
    template: supplierTemplate 
  },
];

// =====================
// Summary Cards Component
// =====================
const EquipmentSummaryCards = ({ equipment }: { equipment: any[] }) => {
  const [stats, setStats] = useState({
    total_equipment: 0,
    available: 0,
    in_use: 0,
    under_maintenance: 0,
    total_categories: 0,
    total_suppliers: 0,
    active_projects: 0,
    total_value: 0
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await getEquipmentStats();
        setStats(data);
      } catch (error) {
        console.error('Error loading stats:', error);
      }
    };
    loadStats();
  }, [equipment]);

  const totalValue = equipment.reduce((sum, e) => sum + (e.price * e.quantity), 0);
  const inUse = equipment.filter(e => e.status === "In Use").length;
  const available = equipment.filter(e => e.status === "Available").length;
  const projectCount = [...new Set(equipment.map(e => e.project_id).filter(Boolean))].length;
  const supplierCount = [...new Set(equipment.map(e => e.supplier_id).filter(Boolean))].length;

  return (
    <>
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-sm text-gray-500">Total Equipment</h3>
        <p className="text-2xl font-bold">{stats.total_equipment || equipment.length}</p>
      </div>
      
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-sm text-gray-500">In Use</h3>
        <p className="text-2xl font-bold text-blue-600">
          {stats.in_use || inUse}
        </p>
      </div>
      
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-sm text-gray-500">Available</h3>
        <p className="text-2xl font-bold text-green-600">
          {stats.available || available}
        </p>
      </div>
      
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-sm text-gray-500">Total Value</h3>
        <p className="text-2xl font-bold text-purple-600">
          ${(stats.total_value || totalValue).toLocaleString()}
        </p>
        <div className="text-xs text-gray-500 mt-1">
          {projectCount} projects • {supplierCount} suppliers
        </div>
      </div>
    </>
  );
};

// =====================
// Equipment Page
// =====================
const EquipmentPage = () => {
  const [equipment, setEquipment] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [supplierNames, setSupplierNames] = useState<string[]>([]);
  const [projectNames, setProjectNames] = useState<string[]>([]);
  const [supplierMap, setSupplierMap] = useState<Record<number, string>>({});
  const [projectMap, setProjectMap] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load suppliers and projects for dropdowns
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load suppliers
        const suppliersData = await suppliersApi.getSuppliers();
        console.log('✅ Suppliers loaded:', suppliersData);
        setSuppliers(suppliersData);
        setSupplierNames(suppliersData.map((s: any) => s.name));
        
        const sMap: Record<number, string> = {};
        suppliersData.forEach((s: any) => {
          sMap[s.id] = s.name;
        });
        setSupplierMap(sMap);
        
        // Load projects
        const projectsData = await projectsApi.getProjects();
        console.log('✅ Projects loaded:', projectsData);
        setProjects(projectsData);
        setProjectNames(projectsData.map((p: any) => p.name));
        
        const pMap: Record<number, string> = {};
        projectsData.forEach((p: any) => {
          pMap[p.id] = p.name;
        });
        setProjectMap(pMap);
        
      } catch (err) {
        console.error('Error loading data:', err);
      }
    };
    loadData();
  }, []);

  // Fetch equipment
  const loadEquipment = useCallback(async (): Promise<any[]> => {
    try {
      setLoading(true);
      console.log('Fetching equipment...');
      const data = await fetchEquipment();
      
      const transformed = data.map((item: any) => 
        mapDbToForm(item, supplierMap, projectMap)
      );
      
      console.log('Transformed equipment:', transformed);
      setEquipment(transformed);
      setError(null);
      return transformed;
    } catch (err: any) {
      console.error('Error fetching equipment:', err);
      setError('Failed to load equipment');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [supplierMap, projectMap]);

  // Load data on mount
  useEffect(() => {
    if (Object.keys(supplierMap).length > 0 && Object.keys(projectMap).length > 0) {
      loadEquipment();
    }
  }, [loadEquipment, supplierMap, projectMap]);

  // Get dynamic fields with supplier and project options
  const getEquipmentFields = (): Field[] => {
    return [
      {
        name: "name",
        label: "Equipment Name",
        type: "text",
        required: true
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
        required: true
      },
      {
        name: "quantity",
        label: "Quantity",
        type: "number",
        required: true
      },
      {
        name: "ownershipType",
        label: "Ownership Type",
        type: "select",
        options: ["Owned", "Rental", "Lease"],
        required: true
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
        required: true
      },
      {
        name: "status",
        label: "Status",
        type: "select",
        options: ["Available", "In Use", "Under Maintenance"],
      },
      {
        name: "supplier_id",
        label: "Supplier / Rental Company",
        type: "select",
        options: supplierNames,
      },
      {
        name: "project_id",
        label: "Assigned Project",
        type: "select",
        options: projectNames,
      },
      {
        name: "description",
        label: "Description / Notes",
        type: "textarea",
      },
    ];
  };

  // Handle add
  const handleAdd = async (values: any) => {
    try {
      const selectedSupplier = suppliers.find(s => s.name === values.supplier_id);
      const selectedProject = projects.find(p => p.name === values.project_id);
      
      const dbValues = {
        ...values,
        supplier_id: selectedSupplier?.id || null,
        project_id: selectedProject?.id || null
      };
      
      console.log('Adding equipment:', dbValues);
      await addEquipment(dbValues);
      await loadEquipment();
      return { success: true };
    } catch (err: any) {
      console.error('Error adding equipment:', err);
      alert(err.message);
      return { success: false };
    }
  };

  // Handle edit
  const handleEdit = async (values: any) => {
    try {
      const selectedSupplier = suppliers.find(s => s.name === values.supplier_id);
      const selectedProject = projects.find(p => p.name === values.project_id);
      
      const dbValues = {
        ...values,
        supplier_id: selectedSupplier?.id || null,
        project_id: selectedProject?.id || null
      };
      
      console.log('Editing equipment:', values.id, dbValues);
      await updateEquipment(values.id, dbValues);
      await loadEquipment();
      return { success: true };
    } catch (err: any) {
      console.error('Error updating equipment:', err);
      alert(err.message);
      return { success: false };
    }
  };

  // Handle delete
  const handleDelete = async (id: number) => {
    try {
      console.log('Deleting equipment:', id);
      await deleteEquipment(id);
      await loadEquipment();
      return { success: true };
    } catch (err: any) {
      console.error('Error deleting equipment:', err);
      alert(err.message);
      return { success: false };
    }
  };

  // Handle view
  const handleView = (item: any) => {
    console.log('Viewing item:', item);
    const viewItem = {
      ...item,
      supplier_id: item.supplier_name || 'No Supplier',
      project_id: item.project_name || 'No Project'
    };
    return viewItem;
  };

  if (loading && equipment.length === 0) {
    return (
      <MainLayout role="SUPER_ADMIN" pageTitle="Equipment Management" showLogout={true}>
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Loading equipment...</div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout role="SUPER_ADMIN" pageTitle="Equipment Management" showLogout={true}>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout 
      role="SUPER_ADMIN" 
      pageTitle="Equipment Management"
      showLogout={true}
    >
      <BaseCrudPage
        title="Equipment Management"
        description="Manage owned, rented, and leased construction equipment"
        fields={getEquipmentFields()}
        initialData={equipment}
        gridColumns={equipmentGridColumns}
        summaryCards={<EquipmentSummaryCards equipment={equipment} />}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        onDataChange={loadEquipment}
      />
    </MainLayout>
  );
};

export default EquipmentPage;