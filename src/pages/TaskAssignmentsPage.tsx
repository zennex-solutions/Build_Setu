import React, { useState, useEffect } from 'react';
import type { Field } from "@/components/CrudForm";
import BaseCrudPage from "../components/BaseCrudPage";
import MainLayout from "../components/MainLayout";
import { useNavigate } from "react-router-dom";
import tasksApi from '../services/tasksApi';

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
  { name: "dueDate", label: "Due Date", type: "date" },
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
  { name: "description", label: "Task Description", type: "textarea", spanFull: true },
];

// =====================
// Status Badge Template
// =====================
const statusTemplate = (props: any) => {
  const status = props.status || props.rowData?.status;
  
  const styles: Record<string, string> = {
    "Pending": "bg-yellow-100 text-yellow-800",
    "In Progress": "bg-blue-100 text-blue-800",
    "Completed": "bg-green-100 text-green-800",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs ${
        styles[status] || "bg-gray-100"
      }`}
    >
      {status}
    </span>
  );
};

// =====================
// Priority Badge Template
// =====================
const priorityTemplate = (props: any) => {
  const priority = props.priority || props.rowData?.priority;
  
  const styles: Record<string, string> = {
    High: "bg-red-100 text-red-800",
    Medium: "bg-yellow-100 text-yellow-800",
    Low: "bg-green-100 text-green-800",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs ${
        styles[priority] || "bg-gray-100"
      }`}
    >
      {priority}
    </span>
  );
};

// =====================
// Due Date Template (shows overdue in red)
// =====================
const dueDateTemplate = (props: any) => {
  const dueDate = props.dueDate || props.rowData?.due_date || props.rowData?.dueDate;
  const status = props.status || props.rowData?.status;
  
  if (!dueDate) return <span>-</span>;
  
  const today = new Date();
  const due = new Date(dueDate);
  const isOverdue = due < today && status !== 'Completed';
  
  return (
    <span className={isOverdue ? "text-red-600 font-semibold" : ""}>
      {dueDate}
      {isOverdue && <span className="ml-1 text-xs">⚠️</span>}
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
  { field: "dueDate", headerText: "Due Date", width: 120, template: dueDateTemplate },
  { field: "priority", headerText: "Priority", width: 120, template: priorityTemplate },
  { field: "status", headerText: "Status", width: 130, template: statusTemplate },
];

// =====================
// Summary Cards
// =====================
const TaskSummaryCards = ({ tasks }: { tasks: any[] }) => {
  const pendingCount = tasks.filter((t) => t.status === "Pending").length;
  const inProgressCount = tasks.filter((t) => t.status === "In Progress").length;
  const completedCount = tasks.filter((t) => t.status === "Completed").length;
  const overdueCount = tasks.filter((t) => {
    if (!t.dueDate || t.status === 'Completed') return false;
    const today = new Date();
    const due = new Date(t.dueDate);
    return due < today;
  }).length;

  return (
    <>
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-sm text-gray-500">Total Tasks</h3>
        <p className="text-2xl font-bold">{tasks.length}</p>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-sm text-gray-500">Pending</h3>
        <p className="text-2xl font-bold text-yellow-600">
          {pendingCount}
        </p>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-sm text-gray-500">In Progress</h3>
        <p className="text-2xl font-bold text-blue-600">
          {inProgressCount}
        </p>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-sm text-gray-500">Overdue</h3>
        <p className="text-2xl font-bold text-red-600">
          {overdueCount}
        </p>
      </div>
    </>
  );
};

// =====================
// Page Component
// =====================
const TaskAssignmentsPage = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (!token || !userStr) {
      navigate('/');
      return;
    }

    try {
      setUser(JSON.parse(userStr));
    } catch (e) {
      console.error('Failed to parse user data');
    }

    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const data = await tasksApi.getTasks();
      setTasks(data);
    } catch (err: any) {
      console.error('Fetch tasks error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (values: any) => {
    try {
      const newTask = await tasksApi.createTask(values);
      await fetchTasks();
      return newTask;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const handleEditTask = async (values: any) => {
    try {
      const updatedTask = await tasksApi.updateTask(values.id, values);
      await fetchTasks();
      return updatedTask;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const handleDeleteTask = async (id: number) => {
    try {
      await tasksApi.deleteTask(id);
      await fetchTasks();
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading tasks...</div>
      </div>
    );
  }

  return (
    <MainLayout
      role={user?.role || "USER"}
      pageTitle="Task Assignments"
      showLogout={true}
      onLogout={handleLogout}
    >
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Error: {error}
        </div>
      )}
      
      <BaseCrudPage
        title="Task Assignment"
        description="Assign tasks to crews or individuals and track progress"
        fields={taskFields}
        initialData={tasks}
        gridColumns={taskGridColumns}
        summaryCards={<TaskSummaryCards tasks={tasks} />}
        onAdd={handleAddTask}
        onEdit={handleEditTask}
        onDelete={handleDeleteTask}
      />
    </MainLayout>
  );
};

export default TaskAssignmentsPage;