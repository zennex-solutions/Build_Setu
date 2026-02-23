import React, { useState, useEffect, useCallback } from 'react';
import type { Field } from "@/components/CrudForm";
import BaseCrudPage from "../components/BaseCrudPage";
import MainLayout from "../components/MainLayout";
import { useNavigate } from "react-router-dom";
import tasksApi from '../services/tasksApi';

// =====================
// Task Assignment Fields
// =====================
const taskFields: Field[] = [
  { name: "title", label: "Task Title", type: "text", required: true },
  {
    name: "assignedTo",
    label: "Assigned To",
    type: "select",
    options: ["Alpha Masonry", "Sparkies Group", "John Doe", "Jane Smith"],
    required: true
  },
  {
    name: "project",
    label: "Project",
    type: "select",
    options: ["Alpha Tower", "Skyline Villa", "Main Road Bridge"],
    required: true
  },
  { name: "dueDate", label: "Due Date", type: "date", required: false },
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
// Helper function to format date for input (YYYY-MM-DD) without timezone shift
// =====================
const formatDateForInput = (dateString: string): string => {
  if (!dateString) return '';
  
  try {
    // If it's already in YYYY-MM-DD format, return as is
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return dateString;
    }
    
    // Parse the date string
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    
    // Get local date components to avoid timezone shifts
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  } catch (e) {
    console.error('Error formatting date for input:', e);
    return '';
  }
};

// =====================
// Status Badge Template
// =====================
const statusTemplate = (props: any) => {
  const rowData = props.rowData || props;
  const status = rowData.status;
  
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
      {status || 'Unknown'}
    </span>
  );
};

// =====================
// Priority Badge Template
// =====================
const priorityTemplate = (props: any) => {
  const rowData = props.rowData || props;
  const priority = rowData.priority;
  
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
      {priority || 'Unknown'}
    </span>
  );
};

// =====================
// Due Date Template (for grid)
// =====================
const dueDateTemplate = (props: any) => {
  const rowData = props.rowData || props;
  // Check both camelCase and snake_case
  const dueDate = rowData.due_date || rowData.dueDate;
  const status = rowData.status;
  
  if (!dueDate) return <span className="text-gray-400">Not set</span>;
  
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);
    
    if (isNaN(due.getTime())) {
      return <span className="text-gray-400">Invalid date</span>;
    }
    
    const isOverdue = due < today && status !== 'Completed';
    
    // Format date as dd/mm/yyyy using local timezone
    const day = String(due.getDate()).padStart(2, '0');
    const month = String(due.getMonth() + 1).padStart(2, '0');
    const year = due.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;
    
    return (
      <span className={isOverdue ? "text-red-600 font-semibold" : ""}>
        {formattedDate}
        {isOverdue && <span className="ml-1 text-xs">⚠️</span>}
      </span>
    );
  } catch (e) {
    return <span className="text-gray-400">Invalid date</span>;
  }
};

// =====================
// Assigned To Template
// =====================
const assignedToTemplate = (props: any) => {
  const rowData = props.rowData || props;
  // Check both camelCase and snake_case
  const assignedTo = rowData.assigned_to || rowData.assignedTo;
  const taskId = rowData.id;
  const taskTitle = rowData.title;
  
  // Log each task to see what's coming through
  console.log(`Task ID ${taskId} (${taskTitle}) - assigned_to:`, assignedTo, typeof assignedTo);
  
  // Handle empty string, null, undefined
  if (assignedTo === null || assignedTo === undefined || assignedTo === '') {
    return <span className="text-gray-400 italic">Unassigned</span>;
  }
  
  return <span className="font-medium text-gray-700">{assignedTo}</span>;
};

// =====================
// Title Template
// =====================
const titleTemplate = (props: any) => {
  const rowData = props.rowData || props;
  return <span className="font-medium">{rowData.title}</span>;
};

// =====================
// Data Transformers - FIXED DATE HANDLING
// =====================
const mapApiToForm = (apiData: any) => {
  if (!apiData) return {};
  
  console.log('Mapping API to form - raw API data:', apiData);
  
  // Format date for input field without timezone shift
  let formattedDueDate = '';
  if (apiData.due_date) {
    formattedDueDate = formatDateForInput(apiData.due_date);
  }
  
  const formData = {
    id: apiData.id,
    title: apiData.title || '',
    assignedTo: apiData.assigned_to || '',
    project: apiData.project || '',
    dueDate: formattedDueDate,
    priority: apiData.priority || 'Medium',
    status: apiData.status || 'Pending',
    description: apiData.description || '',
  };
  
  console.log('Mapped form data:', formData);
  return formData;
};

const mapFormToApi = (formData: any) => {
  if (!formData) return {};
  
  console.log('Mapping form to API - raw form data:', formData);
  
  // Send the date exactly as it is from the form (YYYY-MM-DD)
  const apiData = {
    title: formData.title,
    assignedTo: formData.assignedTo,
    project: formData.project,
    dueDate: formData.dueDate || null,
    priority: formData.priority,
    status: formData.status,
    description: formData.description,
  };
  
  console.log('Mapped API data:', apiData);
  return apiData;
};

// =====================
// Grid Columns
// =====================
const taskGridColumns = [
  { 
    field: "title", 
    headerText: "Task Title", 
    width: 200,
    template: titleTemplate 
  },
  { 
    field: "assigned_to", 
    headerText: "Assigned To", 
    width: 160,
    template: assignedToTemplate 
  },
  { field: "project", headerText: "Project", width: 150 },
  { 
    field: "due_date", 
    headerText: "Due Date", 
    width: 120, 
    template: dueDateTemplate 
  },
  { 
    field: "priority", 
    headerText: "Priority", 
    width: 120, 
    template: priorityTemplate 
  },
  { 
    field: "status", 
    headerText: "Status", 
    width: 130, 
    template: statusTemplate 
  },
];

// =====================
// Summary Cards
// =====================
const TaskSummaryCards = ({ tasks }: { tasks: any[] }) => {
  const pendingCount = tasks.filter((t) => t?.status === "Pending").length;
  const inProgressCount = tasks.filter((t) => t?.status === "In Progress").length;
  const completedCount = tasks.filter((t) => t?.status === "Completed").length;
  const overdueCount = tasks.filter((t) => {
    const dueDate = t.due_date || t.dueDate;
    if (!dueDate || t?.status === 'Completed') return false;
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const due = new Date(dueDate);
      due.setHours(0, 0, 0, 0);
      
      return due < today;
    } catch (e) {
      return false;
    }
  }).length;

  const unassignedCount = tasks.filter((t) => {
    const assigned = t.assigned_to || t.assignedTo;
    return !assigned || assigned === '';
  }).length;
  const assignedCount = tasks.length - unassignedCount;

  return (
    <>
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-sm text-gray-500">Total Tasks</h3>
        <p className="text-2xl font-bold">{tasks.length}</p>
        <div className="text-sm text-gray-600 mt-1">
          {assignedCount} assigned • {unassignedCount} unassigned
        </div>
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

  const fetchTasks = useCallback(async (): Promise<any[]> => {
    setLoading(true);
    try {
      console.log('📡 Fetching tasks from API...');
      const data = await tasksApi.getTasks();
      
      let tasksArray = [];
      
      if (Array.isArray(data)) {
        tasksArray = data;
      } else if (data && data.tasks && Array.isArray(data.tasks)) {
        tasksArray = data.tasks;
      } else if (data && data.data && Array.isArray(data.data)) {
        tasksArray = data.data;
      } else {
        tasksArray = [];
      }
      
      console.log(`✅ Loaded ${tasksArray.length} tasks from API`);
      
      // Transform API data to form format
      const transformedTasks = tasksArray.map(task => mapApiToForm(task));
      
      console.log('✅ Transformed tasks for UI:', transformedTasks.map(t => ({ 
        id: t.id, 
        title: t.title, 
        assignedTo: t.assignedTo,
        dueDate: t.dueDate 
      })));
      
      setTasks(transformedTasks);
      setError('');
      return transformedTasks;
    } catch (err: any) {
      console.error('❌ Fetch tasks error:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

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
  }, [navigate, fetchTasks]);

  const handleAddTask = async (values: any) => {
    try {
      console.log('📝 Adding task (form values):', values);
      
      const apiData = mapFormToApi(values);
      console.log('📝 Adding task (API data):', apiData);
      
      const newTask = await tasksApi.createTask(apiData);
      console.log('✅ Add response:', newTask);
      
      await fetchTasks();
      return { success: true, data: newTask };
    } catch (err: any) {
      console.error('❌ Add task error:', err);
      setError(err.message);
      throw err;
    }
  };

  const handleEditTask = async (values: any) => {
    try {
      console.log('📝 Editing task ID:', values.id);
      console.log('Edit values (form):', values);
      
      const apiData = mapFormToApi(values);
      console.log('Edit values (API):', apiData);
      
      const updatedTask = await tasksApi.updateTask(values.id, apiData);
      console.log('✅ Edit response:', updatedTask);
      
      await fetchTasks();
      return { success: true, data: updatedTask };
    } catch (err: any) {
      console.error('❌ Edit task error:', err);
      setError(err.message);
      throw err;
    }
  };

  const handleDeleteTask = async (id: number) => {
    try {
      console.log('🗑️ Deleting task ID:', id);
      await tasksApi.deleteTask(id);
      await fetchTasks();
      return { success: true };
    } catch (err: any) {
      console.error('❌ Delete task error:', err);
      setError(err.message);
      throw err;
    }
  };

  const handleViewTask = (item: any) => {
    console.log('👁️ Viewing item - raw:', item);
    
    // For view mode, format the date for display
    const viewItem = {
      ...item,
      dueDate: item.dueDate || ''
    };
    
    console.log('👁️ Viewing item - formatted:', viewItem);
    return viewItem;
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  if (loading && tasks.length === 0) {
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
        onView={handleViewTask}
        onDataChange={fetchTasks}
      />
    </MainLayout>
  );
};

export default TaskAssignmentsPage;