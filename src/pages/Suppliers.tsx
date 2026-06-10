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

