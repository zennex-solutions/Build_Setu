import type { Field } from "@/components/CrudForm";
import BaseCrudPage from "../components/BaseCrudPage";
import MainLayout from "../components/MainLayout";

// =====================
// Project Form Fields
// =====================
const projectFields: Field[] = [
  { name: "name", label: "Project Name", type: "text" },
  { name: "location", label: "Site Location", type: "text" },
  {
    name: "manager",
    label: "Assigned Manager",
    type: "select",
    options: ["Ali Khan", "Sarah Ahmed", "John Smith", "Unassigned"],
  },
  { name: "taskTime", label: "Site Start Time", type: "text" },
  { name: "budget", label: "Budget ($)", type: "number" },
  {
    name: "status",
    label: "Status",
    type: "select",
    options: ["Planning", "On Site", "Completed"],
  },
  { name: "description", label: "Description", type: "textarea" },
];

// =====================
// Sample Data
// =====================
const initialProjects = [
  {
    id: 1,
    name: "Skyline Villa",
    location: "Sector 4",
    manager: "Ali Khan",
    taskTime: "08:00 AM",
    budget: 50000,
    status: "On Site",
    description: "Residential villa construction project",
  },
];

// =====================
// Status Badge Template
// =====================
const statusTemplate = (props: any) => {
  const styles: Record<string, string> = {
    Planning: "bg-yellow-100 text-yellow-800",
    "On Site": "bg-blue-100 text-blue-800",
    Completed: "bg-green-100 text-green-800",
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
const projectGridColumns = [
  { field: "name", headerText: "Project", width: 200 },
  { field: "location", headerText: "Site Location", width: 150 },
  { field: "manager", headerText: "Manager", width: 150 },
  { field: "taskTime", headerText: "Start Time", width: 120 },
  { field: "budget", headerText: "Budget ($)", width: 120 },
  { field: "status", headerText: "Status", width: 130, template: statusTemplate },
];

// =====================
// Summary Cards
// =====================
const ProjectSummaryCards = ({ projects }: { projects: any[] }) => (
  <>
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-sm text-gray-500">Total Projects</h3>
      <p className="text-2xl font-bold">{projects.length}</p>
    </div>
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-sm text-gray-500">Active on Site</h3>
      <p className="text-2xl font-bold text-blue-600">
        {projects.filter((p) => p.status === "On Site").length}
      </p>
    </div>
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-sm text-gray-500">Planning</h3>
      <p className="text-2xl font-bold text-yellow-600">
        {projects.filter((p) => p.status === "Planning").length}
      </p>
    </div>
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-sm text-gray-500">Completed</h3>
      <p className="text-2xl font-bold text-green-600">
        {projects.filter((p) => p.status === "Completed").length}
      </p>
    </div>
  </>
);

// =====================
// Projects Page
// =====================
const ProjectsPage = () => {
  return (
    <MainLayout role="SUPER_ADMIN" pageTitle="Project Management" showLogout={true}>
      <BaseCrudPage
        title="Projects"
        description="Manage construction projects, assign managers, and track progress"
        fields={projectFields}
        initialData={initialProjects}
        gridColumns={projectGridColumns}
        summaryCards={<ProjectSummaryCards projects={initialProjects} />}
      />
    </MainLayout>
  );
};

export default ProjectsPage;
