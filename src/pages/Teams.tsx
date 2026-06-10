import React, { useState, useEffect, useCallback } from 'react';
import type { Field } from "@/components/CrudForm";
import BaseCrudPage from "../components/BaseCrudPage";
import MainLayout from "../components/MainLayout";
import { useNavigate } from "react-router-dom";
import teamsApi from '../services/teamsApi';
import projectsApi from '../services/projectsApi';

// =====================
// Helper functions
// =====================
const formatDate = (dateString: string) => {
  if (!dateString) return '';
  return dateString.split('T')[0];
};

// =====================
// Capacity Template
// =====================
const capacityTemplate = (props: any) => {
  const members = props.members || 0;
  const maxCapacity = 20;
  const percentage = Math.min((Number(members) / maxCapacity) * 100, 100);

  return (
    <div className="w-full pr-4">
      <div className="flex justify-between mb-1">
        <span className="text-xs font-semibold text-gray-700">
          {members} / {maxCapacity}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-1.5">
        <div
          className={`h-1.5 rounded-full ${
            percentage > 90 ? "bg-red-500" : "bg-blue-600"
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

// =====================
// Status Badge
// =====================
const statusTemplate = (props: any) => {
  const status = props.status;
  
  const styles: Record<string, string> = {
    "On Site": "bg-green-100 text-green-800",
    "Idle": "bg-yellow-100 text-yellow-800",
    "Off Duty": "bg-gray-200 text-gray-700",
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
// Project Template
// =====================
const projectTemplate = (props: any) => {
  const projectName = props.project_name;
  if (!projectName) return <span className="text-gray-400 italic">No Project</span>;
  return <span className="font-medium text-blue-600">{projectName}</span>;
};

// =====================
// Trade Template
// =====================
const tradeTemplate = (props: any) => {
  const trade = props.trade;
  const styles: Record<string, string> = {
    "Civil/Masonry": "bg-orange-100 text-orange-800",
    "Electrical": "bg-yellow-100 text-yellow-800",
    "Plumbing": "bg-cyan-100 text-cyan-800",
    "Carpentry": "bg-emerald-100 text-emerald-800",
  };
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs ${styles[trade] || "bg-gray-100"}`}>
      {trade}
    </span>
  );
};

// =====================
// Data Transformers
// =====================
const mapApiToForm = (apiData: any) => {
  if (!apiData) return {};
  
  console.log('Mapping team data:', {
    id: apiData.id,
    name: apiData.name,
    project_id: apiData.project_id,
    project_name: apiData.project_name
  });
  
  return {
    id: apiData.id,
    name: apiData.name || '',
    lead: apiData.lead || '',
    trade: apiData.trade || 'Civil/Masonry',
    members: apiData.members || 0,
    project_id: apiData.project_id,
    project_name: apiData.project_name || 'No Project',
    status: apiData.status || 'Idle',
    // Keep original for grid
    projectName: apiData.project_name,
  };
};

const mapFormToApi = (formData: any) => {
  return {
    name: formData.name,
    lead: formData.lead,
    trade: formData.trade,
    members: parseInt(formData.members) || 0,
    project_id: formData.project_id,
    status: formData.status,
  };
};

// =====================
// Grid Columns
// =====================
const teamGridColumns = [
  { field: "name", headerText: "Crew Name", width: 160 },
  { field: "trade", headerText: "Trade", width: 140, template: tradeTemplate },
  { field: "lead", headerText: "Team Lead", width: 150 },
  {
    field: "members",
    headerText: "Capacity",
    template: capacityTemplate,
    width: 200,
  },
  { field: "project_name", headerText: "Project", width: 160, template: projectTemplate },
  {
    field: "status",
    headerText: "Status",
    template: statusTemplate,
    width: 130,
  },
];

// =====================
// Summary Cards
// =====================
const TeamSummaryCards = ({ teams }: { teams: any[] }) => {
  const totalManpower = teams.reduce((acc, t) => acc + Number(t.members || 0), 0);
  const onSiteCount = teams.filter((t) => t.status === "On Site").length;
  const idleCount = teams.filter((t) => t.status === "Idle").length;
  const offDutyCount = teams.filter((t) => t.status === "Off Duty").length;
  
  const masonryCount = teams
    .filter(t => t.trade === "Civil/Masonry")
    .reduce((acc, t) => acc + Number(t.members || 0), 0);
  
  const electricalCount = teams
    .filter(t => t.trade === "Electrical")
    .reduce((acc, t) => acc + Number(t.members || 0), 0);

  return (
    <>
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-sm text-gray-500">Total Crews</h3>
        <p className="text-2xl font-bold">{teams.length}</p>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-sm text-gray-500">Total Manpower</h3>
        <p className="text-2xl font-bold text-blue-600">
          {totalManpower}
        </p>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-sm text-gray-500">On Site</h3>
        <p className="text-2xl font-bold text-green-600">
          {onSiteCount}
        </p>
        <div className="text-xs text-gray-500">{masonryCount} Masonry • {electricalCount} Electrical</div>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-sm text-gray-500">Idle/Off Duty</h3>
        <p className="text-2xl font-bold text-yellow-600">
          {idleCount + offDutyCount}
        </p>
      </div>
    </>
  );
};

// =====================
// Page Component
// =====================
const TeamsPage = () => {
  const [teams, setTeams] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [projectNames, setProjectNames] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  // Load projects for dropdown
  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await projectsApi.getProjects();
        console.log('✅ Projects loaded:', data);
        setProjects(data);
        setProjectNames(data.map((p: any) => p.name));
      } catch (err) {
        console.error('Error loading projects:', err);
      }
    };
    loadProjects();
  }, []);

  const fetchTeams = useCallback(async (): Promise<any[]> => {
    setLoading(true);
    try {
      console.log('📡 Fetching teams...');
      const data = await teamsApi.getTeams();
      
      console.log('✅ Raw teams data:', data);
      
      const transformedTeams = data.map(mapApiToForm);
      
      console.log('✅ Transformed teams:', transformedTeams.map((t: any) => ({
        id: t.id,
        name: t.name,
        project: t.project_name,
        project_id: t.project_id
      })));
      
      setTeams(transformedTeams);
      setError('');
      return transformedTeams;
    } catch (err: any) {
      console.error('❌ Fetch teams error:', err);
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

    fetchTeams();
  }, [navigate, fetchTeams]);

  // Dynamic fields
  const getFields = (): Field[] => {
    return [
      { name: "name", label: "Crew Name", type: "text", required: true },
      { name: "lead", label: "Team Lead", type: "text", required: true },
      {
        name: "trade",
        label: "Trade",
        type: "select",
        options: ["Civil/Masonry", "Electrical", "Plumbing", "Carpentry"],
        required: true
      },
      { name: "members", label: "No. of Workers", type: "number" },
      {
        name: "project_id",
        label: "Assigned Project",
        type: "select",
        options: projectNames,
        required: true
      },
      {
        name: "status",
        label: "Status",
        type: "select",
        options: ["On Site", "Idle", "Off Duty"],
      },
    ];
  };

  const handleAddTeam = async (values: any) => {
    try {
      const selectedProject = projects.find(p => p.name === values.project_id);
      
      const apiData = {
        ...mapFormToApi(values),
        project_id: selectedProject?.id || null
      };
      
      console.log('📝 Adding team:', apiData);
      const newTeam = await teamsApi.createTeam(apiData);
      await fetchTeams();
      return newTeam;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const handleEditTeam = async (values: any) => {
    try {
      const selectedProject = projects.find(p => p.name === values.project_id);
      
      const apiData = {
        ...mapFormToApi(values),
        project_id: selectedProject?.id || null
      };
      
      console.log('📝 Editing team:', values.id, apiData);
      const updatedTeam = await teamsApi.updateTeam(values.id, apiData);
      await fetchTeams();
      return updatedTeam;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const handleDeleteTeam = async (id: number) => {
    try {
      console.log('🗑️ Deleting team:', id);
      await teamsApi.deleteTeam(id);
      await fetchTeams();
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const handleViewTeam = (item: any) => {
    const projectName = projects.find(p => p.id === item.project_id)?.name || item.project_name;
    return {
      ...item,
      project_id: projectName,
    };
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  if (loading && teams.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading teams...</div>
      </div>
    );
  }

  return (
    <MainLayout
      role={user?.role || "USER"}
      pageTitle="Team Management"
      showLogout={true}
      onLogout={handleLogout}
    >
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Error: {error}
        </div>
      )}
      
      <BaseCrudPage
        title="Team"
        description="Manage construction crews, track capacity and project assignments"
        fields={getFields()}
        initialData={teams}
        gridColumns={teamGridColumns}
        summaryCards={<TeamSummaryCards teams={teams} />}
        onAdd={handleAddTeam}
        onEdit={handleEditTeam}
        onDelete={handleDeleteTeam}
        onView={handleViewTeam}
        onDataChange={fetchTeams}
      />
    </MainLayout>
  );
};

export default TeamsPage;