import type { Field } from "@/components/CrudForm";
import BaseCrudPage from "../components/BaseCrudPage";
import MainLayout from "../components/MainLayout";

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


// Sample data (same as before)
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

];

// Status template
const statusTemplate = (props: any) => {
  const colors: Record<string, string> = {
    Available: "bg-green-100 text-green-800",
    "In Use": "bg-blue-100 text-blue-800",
    "Under Maintenance": "bg-yellow-100 text-yellow-800",
  };



  return (
    <span className={`px-2 py-1 rounded-full text-xs ${colors[props.status] || 'bg-gray-100'}`}>
      {props.status}
    </span>
  );
};
  const equipmentGridColumns = [
  { field: "name", headerText: "Equipment" },
  { field: "category", headerText: "Category" },
  { field: "quantity", headerText: "Qty", width: 80 },
  { field: "ownershipType", headerText: "Ownership" },
  { field: "status", headerText: "Status", template: statusTemplate },
  { field: "assignedProject", headerText: "Project" },
];
// Summary Cards component
const EquipmentSummaryCards = ({ equipment }: { equipment: any[] }) => (
  <>
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
      <h3 className="text-sm text-gray-500">Total Value</h3>
      <p className="text-2xl font-bold text-purple-600">
        $
        {equipment
          .reduce((sum, e) => sum + e.price * e.quantity, 0)
          .toLocaleString()}
      </p>
    </div>
  </>
);

const EquipmentPage = () => {
  return (
    <MainLayout 
      role="SUPER_ADMIN" 
      pageTitle="Equipment Management"
      showLogout={true}
    >
<BaseCrudPage
  title="Equipment Management"
  description="Manage owned, rented, and leased construction equipment"
  fields={equipmentFields}
  initialData={initialEquipment}
  gridColumns={equipmentGridColumns}   // <-- IMPORTANT
  summaryCards={<EquipmentSummaryCards equipment={initialEquipment} />}
/>


    </MainLayout>
  );
};

export default EquipmentPage;