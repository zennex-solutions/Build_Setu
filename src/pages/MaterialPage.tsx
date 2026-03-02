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
import suppliersApi from '../services/suppliersApi';

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
// Stock Status Template
// =====================
const getStockStatus = (quantity: number, min: number, max: number) => {
  if (quantity <= min) return { label: "Low", color: "bg-red-100 text-red-800" };
  if (quantity >= max * 0.9) return { label: "Full", color: "bg-green-100 text-green-800" };
  return { label: "Normal", color: "bg-blue-100 text-blue-800" };
};

const stockStatusTemplate = (props: any) => {
  const rowData = props.rowData || props;
  const { label, color } = getStockStatus(
    rowData.quantity,
    rowData.minQuantity,
    rowData.maxQuantity
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
const materialGridColumns = [
  { field: "code", headerText: "Code", width: 110 },
  { field: "name", headerText: "Material", width: 180 },
  { field: "category", headerText: "Category", width: 120 },
  { field: "unit", headerText: "Unit", width: 80 },
  { 
    field: "unitPrice", 
    headerText: "Unit Price ($)", 
    width: 120,
    template: (props: any) => <span>${props.unitPrice?.toFixed(2)}</span>
  },
  { 
    field: "quantity", 
    headerText: "Stock", 
    width: 100,
    template: (props: any) => <span>{props.quantity?.toFixed(2)}</span>
  },
  { 
    headerText: "Stock Status", 
    width: 120, 
    template: stockStatusTemplate 
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

  const totalValue = materials.reduce((sum, m) => sum + (m.quantity * m.unitPrice), 0);
  const lowStock = materials.filter(m => m.quantity <= m.minQuantity).length;
  const categories = [...new Set(materials.map(m => m.category))].length;
  const supplierCount = [...new Set(materials.map(m => m.supplier_id).filter(Boolean))].length;

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
        <h3 className="text-sm text-gray-500">Suppliers</h3>
        <p className="text-2xl font-bold text-purple-600">{supplierCount}</p>
        <div className="text-xs text-gray-500">Active suppliers</div>
      </div>
    </>
  );
};

// =====================
// Material Page
// =====================
const MaterialPage = () => {
  const [materials, setMaterials] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [supplierNames, setSupplierNames] = useState<string[]>([]);
  const [supplierMap, setSupplierMap] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load suppliers for dropdown
  useEffect(() => {
    const loadSuppliers = async () => {
      try {
        const data = await suppliersApi.getSuppliers();
        console.log('✅ Suppliers loaded:', data);
        setSuppliers(data);
        
        setSupplierNames(data.map((s: any) => s.name));
        
        const map: Record<number, string> = {};
        data.forEach((s: any) => {
          map[s.id] = s.name;
        });
        setSupplierMap(map);
      } catch (err) {
        console.error('Error loading suppliers:', err);
      }
    };
    loadSuppliers();
  }, []);

  // Fetch materials
  const loadMaterials = useCallback(async (): Promise<any[]> => {
    try {
      setLoading(true);
      console.log('Fetching materials...');
      const data = await fetchMaterials();
      
      const transformed = data.map((item: any) => 
        mapDbToForm(item, supplierMap)
      );
      
      console.log('Transformed materials:', transformed);
      setMaterials(transformed);
      setError(null);
      return transformed;
    } catch (err: any) {
      console.error('Error fetching materials:', err);
      setError('Failed to load materials');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [supplierMap]);

  // Load data on mount
  useEffect(() => {
    if (Object.keys(supplierMap).length > 0) {
      loadMaterials();
    }
  }, [loadMaterials, supplierMap]);

  // Get dynamic fields with supplier options
  const getMaterialFields = (): Field[] => {
    return [
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

      {
        name: "supplier_id",
        label: "Supplier",
        type: "select",
        options: supplierNames,
      },
      { name: "supplierContact", label: "Supplier Contact", type: "text" },
      { name: "location", label: "Storage Location", type: "text" },
      { name: "description", label: "Description", type: "textarea" },
      { name: "isActive", label: "Active", type: "checkbox" },
    ];
  };

  // Handle add
  const handleAdd = async (values: any) => {
    try {
      const selectedSupplier = suppliers.find(s => s.name === values.supplier_id);
      
      const dbValues = {
        ...values,
        supplier_id: selectedSupplier?.id || null
      };
      
      console.log('Adding material:', dbValues);
      await addMaterial(dbValues);
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
    console.log('Edit form values:', values);
    
    const selectedSupplier = suppliers.find(s => s.name === values.supplier_id);
    console.log('Selected supplier:', selectedSupplier);
    
    const dbValues = {
      ...values,
      supplier_id: selectedSupplier?.id || null
    };
    
    console.log('Sending to API:', dbValues);
    await updateMaterial(values.id, dbValues);
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

  // Handle view
  const handleView = (item: any) => {
    console.log('Viewing item:', item);
    const viewItem = {
      ...item,
      supplier_id: item.supplier_name || 'No Supplier'
    };
    return viewItem;
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
        fields={getMaterialFields()}
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