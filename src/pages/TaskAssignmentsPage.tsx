import React, { useState, useEffect, useCallback } from 'react';
import type { Field } from "@/components/CrudForm";
import BaseCrudPage from "../components/BaseCrudPage";
import MainLayout from "../components/MainLayout";
import { useNavigate } from "react-router-dom";
import tasksApi from '../services/tasksApi';
import projectsApi from '../services/projectsApi';

// =====================
// Helper function to format date
// =====================
const formatDateForInput = (dateString: string): string => {
  if (!dateString) return '';
  
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return dateString;
  }
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  } catch {
    return '';
  }
};

const formatDateForDisplay = (dateString: string): string => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  } catch {
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
    <span className={`px-3 py-1 rounded-full text-xs ${styles[status] || "bg-gray-100"}`}>
      {status}
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
    <span className={`px-3 py-1 rounded-full text-xs ${styles[priority] || "bg-gray-100"}`}>
      {priority}
    </span>
  );
};

// =====================
// Due Date Template
// =====================
const dueDateTemplate = (props: any) => {
  const rowData = props.rowData || props;
  const dueDate = rowData.due_date;
  const status = rowData.status;
  
  if (!dueDate) return <span className="text-gray-400">Not set</span>;
  
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);
    
    const isOverdue = due < today && status !== 'Completed';
    
    const formattedDate = formatDateForDisplay(dueDate);
    
    return (
      <span className={isOverdue ? "text-red-600 font-semibold" : ""}>
        {formattedDate}
        {isOverdue && <span className="ml-1 text-xs">⚠️</span>}
      </span>
    );
  } catch {
    return <span className="text-gray-400">Invalid date</span>;
  }
};

// =====================
// Project Template
// =====================
const projectTemplate = (props: any) => {
  const rowData = props.rowData || props;
  const projectName = rowData.project_name;
  
  if (!projectName || projectName === 'Unknown Project') {
    return <span className="text-gray-400 italic">No Project</span>;
  }
  
  return <span className="font-medium text-blue-600">{projectName}</span>;
};

// =====================
// Assigned To Template
// =====================
const assignedToTemplate = (props: any) => {
  const rowData = props.rowData || props;
  const assignedTo = rowData.assigned_to;
  
  if (!assignedTo) {
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
// Grid Columns
// =====================
const taskGridColumns = [
  { field: "title", headerText: "Task Title", width: 200, template: titleTemplate },
  { field: "assigned_to", headerText: "Assigned To", width: 160, template: assignedToTemplate },
  { field: "project_name", headerText: "Project", width: 150, template: projectTemplate },
  { field: "due_date", headerText: "Due Date", width: 120, template: dueDateTemplate },
  { field: "priority", headerText: "Priority", width: 120, template: priorityTemplate },
  { field: "status", headerText: "Status", width: 130, template: statusTemplate },
];

// =====================
// Summary Cards
// =====================
const TaskSummaryCards = ({ tasks }: { tasks: any[] }) => {
  const pendingCount = tasks.filter((t) => t?.status === "Pending").length;
  const inProgressCount = tasks.filter((t) => t?.status === "In Progress").length;
  const completedCount = tasks.filter((t) => t?.status === "Completed").length;
  
  const overdueCount = tasks.filter((t) => {
    if (!t.due_date || t.status === 'Completed') return false;
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const due = new Date(t.due_date);
      due.setHours(0, 0, 0, 0);
      return due < today;
    } catch {
      return false;
    }
  }).length;

  return (
    <>
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-sm text-gray-500">Total Tasks</h3>
        <p className="text-2xl font-bold">{tasks.length}</p>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-sm text-gray-500">Pending</h3>
        <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-sm text-gray-500">In Progress</h3>
        <p className="text-2xl font-bold text-blue-600">{inProgressCount}</p>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-sm text-gray-500">Overdue</h3>
        <p className="text-2xl font-bold text-red-600">{overdueCount}</p>
      </div>
    </>
  );
};

// =====================
// Page Component
// =====================
const TaskAssignmentsPage = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [projectNames, setProjectNames] = useState<string[]>([]);
  const [projectMap, setProjectMap] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  // Load projects and create a map
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

  // Data transformer
  const mapApiToForm = (apiData: any) => {
    if (!apiData) return {};
    
    // Get project name from the map
    const projectName = projectMap[apiData.project_id] || 'Unknown Project';
    
    return {
      id: apiData.id,
      title: apiData.title || '',
      assignedTo: apiData.assigned_to || '',
      assigned_to: apiData.assigned_to || '',
      project_id: apiData.project_id,
      project_name: projectName,
      projectName: projectName,
      dueDate: formatDateForInput(apiData.due_date),
      due_date: apiData.due_date,
      priority: apiData.priority || 'Medium',
      status: apiData.status || 'Pending',
      description: apiData.description || '',
    };
  };

  const mapFormToApi = (formData: any) => {
    return {
      title: formData.title,
      assignedTo: formData.assignedTo,
      project_id: formData.project_id,
      dueDate: formData.dueDate || null,
      priority: formData.priority,
      status: formData.status,
      description: formData.description,
    };
  };

  const fetchTasks = useCallback(async (): Promise<any[]> => {
    setLoading(true);
    try {
      console.log('📡 Fetching tasks from API...');
      const data = await tasksApi.getTasks();
      
      console.log('✅ Raw API data:', data);
      
      let tasksArray = Array.isArray(data) ? data : [];
      
      console.log(`✅ Loaded ${tasksArray.length} tasks`);
      
      const transformedTasks = tasksArray.map(mapApiToForm);
      
      console.log('✅ Transformed tasks:', transformedTasks.map((t: any) => ({ 
        id: t.id, 
        title: t.title, 
        project: t.project_name,
        project_id: t.project_id
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
  }, [projectMap]); // Add projectMap as dependency

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

  // Dynamic fields
  const getFields = (): Field[] => {
    return [
      { name: "title", label: "Task Title", type: "text", required: true },
      {
        name: "assignedTo",
        label: "Assigned To",
        type: "select",
        options: ["Alpha Masonry", "Sparkies Group", "John Doe", "Jane Smith"],
        required: true
      },
      {
        name: "project_id",
        label: "Project",
        type: "select",
        options: projectNames,
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
  };

  const handleAddTask = async (values: any) => {
    try {
      const selectedProject = projects.find(p => p.name === values.project_id);
      if (!selectedProject) {
        throw new Error('Please select a valid project');
      }
      
      const apiData = {
        ...mapFormToApi(values),
        project_id: selectedProject.id
      };
      
      console.log('📝 Adding task:', apiData);
      const newTask = await tasksApi.createTask(apiData);
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
      const selectedProject = projects.find(p => p.name === values.project_id);
      if (!selectedProject) {
        throw new Error('Please select a valid project');
      }
      
      const apiData = {
        ...mapFormToApi(values),
        project_id: selectedProject.id
      };
      
      console.log('📝 Editing task:', values.id, apiData);
      const updatedTask = await tasksApi.updateTask(values.id, apiData);
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
    const projectName = projects.find(p => p.id === item.project_id)?.name || item.project_name;
    return {
      ...item,
      project_id: projectName,
      dueDate: item.dueDate || ''
    };
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
        fields={getFields()}
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