import React, { useState, useEffect, useCallback } from 'react';
import type { Field } from "@/components/CrudForm";
import BaseCrudPage from "../components/BaseCrudPage";
import MainLayout from "../components/MainLayout";
import { useNavigate } from "react-router-dom";
import projectsApi from '../services/projectsApi';

// =====================
// Project Form Fields
// =====================
const projectFields: Field[] = [
  { name: "name", label: "Project Name", type: "text" ,required : true},
  { name: "location", label: "Site Location", type: "text" ,required : true },
  {
    name: "manager",
    label: "Assigned Manager",
    type: "select",
    options: ["Ali Khan", "Sarah Ahmed", "John Smith", "Unassigned"],
    required : true
  },
  { name: "taskTime", label: "Site Start Time", type: "text" },
  { name: "budget", label: "Budget ($)", type: "number" ,required : true},
  {
    name: "status",
    label: "Status",
    type: "select",
    options: ["Planning", "On Site", "Completed"],
  },
  { name: "description", label: "Description", type: "textarea", spanFull: true },
];

// =====================
// Status Badge Template
// =====================
const statusTemplate = (props: any) => {
  const status = props.status || props.rowData?.status;
  
  const styles: Record<string, string> = {
    Planning: "bg-yellow-100 text-yellow-800",
    "On Site": "bg-blue-100 text-blue-800",
    Completed: "bg-green-100 text-green-800",
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
// Budget Formatter
// =====================
const budgetTemplate = (props: any) => {
  const budget = props.budget || props.rowData?.budget;
  
  if (!budget) return <span>$0</span>;
  
  return (
    <span className="font-medium">
      ${budget.toLocaleString()}
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
  { field: "task_time", headerText: "Start Time", width: 120 },
  { field: "budget", headerText: "Budget ($)", width: 120, template: budgetTemplate },
  { field: "status", headerText: "Status", width: 130, template: statusTemplate },
];

// =====================
// Summary Cards
// =====================
const ProjectSummaryCards = ({ projects }: { projects: any[] }) => {
  const totalBudget = projects.reduce((sum, p) => sum + (Number(p.budget) || 0), 0);
  const onSiteCount = projects.filter((p) => p.status === "On Site").length;
  const planningCount = projects.filter((p) => p.status === "Planning").length;
  const completedCount = projects.filter((p) => p.status === "Completed").length;

  return (
    <>
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-sm text-gray-500">Total Projects</h3>
        <p className="text-2xl font-bold">{projects.length}</p>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-sm text-gray-500">Active on Site</h3>
        <p className="text-2xl font-bold text-blue-600">{onSiteCount}</p>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-sm text-gray-500">Planning</h3>
        <p className="text-2xl font-bold text-yellow-600">{planningCount}</p>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-sm text-gray-500">Total Budget</h3>
        <p className="text-2xl font-bold text-green-600">
          ${totalBudget.toLocaleString()}
        </p>
      </div>
    </>
  );
};

// =====================
// Projects Page
// =====================
const ProjectsPage = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  // Memoize fetchProjects to prevent unnecessary re-renders
  const fetchProjects = useCallback(async (): Promise<any[]> => {
    setLoading(true);
    try {
      const data = await projectsApi.getProjects();
      setProjects(data);
      setError('');
      return data;
    } catch (err: any) {
      console.error('Fetch projects error:', err);
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

    fetchProjects();
  }, [navigate, fetchProjects]);

  const handleAddProject = async (values: any) => {
    try {
      const newProject = await projectsApi.createProject(values);
      // Optimistic update
      setProjects(prev => [...prev, newProject]);
      // Still fetch to ensure consistency with server
      fetchProjects();
      return newProject;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const handleEditProject = async (values: any) => {
    try {
      const updatedProject = await projectsApi.updateProject(values.id, values);
      // Optimistic update
      setProjects(prev => prev.map(p => 
        p.id === values.id ? updatedProject : p
      ));
      // Still fetch to ensure consistency with server
      fetchProjects();
      return updatedProject;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const handleDeleteProject = async (id: number) => {
    try {
      await projectsApi.deleteProject(id);
      // Optimistic update
      setProjects(prev => prev.filter(p => p.id !== id));
      // Still fetch to ensure consistency with server
      fetchProjects();
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

  if (loading && projects.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading projects...</div>
      </div>
    );
  }

  return (
    <MainLayout
      role={user?.role || "USER"}
      pageTitle="Project Management"
      showLogout={true}
      onLogout={handleLogout}
    >
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Error: {error}
        </div>
      )}
      
      <BaseCrudPage
        title="Projects"
        description="Manage construction projects, assign managers, and track progress"
        fields={projectFields}
        initialData={projects}
        gridColumns={projectGridColumns}
        summaryCards={<ProjectSummaryCards projects={projects} />}
        onAdd={handleAddProject}
        onEdit={handleEditProject}
        onDelete={handleDeleteProject}
        onDataChange={fetchProjects}
      />
    </MainLayout>
  );
};

export default ProjectsPage;