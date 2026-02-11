// pages/TaskAssignmentsPage.tsx
import type { Field } from "@/components/CrudForm";
import BaseCrudPage from "../components/BaseCrudPage";
import MainLayout from "../components/MainLayout";

// =====================
// Task Assignment Fields
// =====================
const taskFields: Field[] = [
  { name: "title", label: "Task Title", type: "text" },
  {
    name: "assignedTo",
    label: "Assigned To",
    type: "select",
    options: ["Alpha Masonry", "Sparkies Group", "John Doe", "Jane Smith"], // could be crew or user
  },
  {
    name: "project",
    label: "Project",
    type: "select",
    options: ["Alpha Tower", "Skyline Villa", "Main Road Bridge"],
  },
  { name: "dueDate", label: "Due Date", type: "text" },
  {
    name: "priority",
    label: "Priority",
    type: "select",
    options: ["High", "Medium", "Low"],
  },
  {
    name: "status",
    label: "Status",
    type: "select",
    options: ["Pending", "In Progress", "Completed"],
  },
  { name: "description", label: "Task Description", type: "textarea" },
];

// =====================
// Sample Data
// =====================
const initialTasks = [
  {
    id: 1,
    title: "Excavation Work",
    assignedTo: "Alpha Masonry",
    project: "Alpha Tower",
    dueDate: "2026-02-20",
    priority: "High",
    status: "Pending",
    description: "Excavate foundation for tower base",
  },
  {
    id: 2,
    title: "Electrical Wiring",
    assignedTo: "Sparkies Group",
    project: "Skyline Villa",
    dueDate: "2026-02-25",
    priority: "Medium",
    status: "In Progress",
    description: "Install main power lines",
  },
];

// =====================
// Status Badge Template
// =====================
const statusTemplate = (props: any) => {
  const styles: Record<string, string> = {
    Pending: "bg-yellow-100 text-yellow-800",
    "In Progress": "bg-blue-100 text-blue-800",
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
// Priority Badge Template
// =====================
const priorityTemplate = (props: any) => {
  const styles: Record<string, string> = {
    High: "bg-red-100 text-red-800",
    Medium: "bg-yellow-100 text-yellow-800",
    Low: "bg-green-100 text-green-800",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs ${
        styles[props.priority] || "bg-gray-100"
      }`}
    >
      {props.priority}
    </span>
  );
};

// =====================
// Grid Columns
// =====================
const taskGridColumns = [
  { field: "title", headerText: "Task Title", width: 200 },
  { field: "assignedTo", headerText: "Assigned To", width: 160 },
  { field: "project", headerText: "Project", width: 150 },
  { field: "dueDate", headerText: "Due Date", width: 120 },
  { field: "priority", headerText: "Priority", width: 120, template: priorityTemplate },
  { field: "status", headerText: "Status", width: 130, template: statusTemplate },
];

// =====================
// Summary Cards
// =====================
const TaskSummaryCards = ({ tasks }: { tasks: any[] }) => (
  <>
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-sm text-gray-500">Total Tasks</h3>
      <p className="text-2xl font-bold">{tasks.length}</p>
    </div>

    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-sm text-gray-500">Pending</h3>
      <p className="text-2xl font-bold text-yellow-600">
        {tasks.filter((t) => t.status === "Pending").length}
      </p>
    </div>

    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-sm text-gray-500">In Progress</h3>
      <p className="text-2xl font-bold text-blue-600">
        {tasks.filter((t) => t.status === "In Progress").length}
      </p>
    </div>

    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-sm text-gray-500">Completed</h3>
      <p className="text-2xl font-bold text-green-600">
        {tasks.filter((t) => t.status === "Completed").length}
      </p>
    </div>
  </>
);

// =====================
// Page Component
// =====================
const TaskAssignmentsPage = () => {
  return (
    <MainLayout
      role="SUPER_ADMIN"
      pageTitle="Task Assignments"
      showLogout={true}
    >
      <BaseCrudPage
        title="Task Assignment"
        description="Assign tasks to crews or individuals and track progress"
        fields={taskFields}
        initialData={initialTasks}
        gridColumns={taskGridColumns}
        summaryCards={<TaskSummaryCards tasks={initialTasks} />}
      />
    </MainLayout>
  );
};

export default TaskAssignmentsPage;
