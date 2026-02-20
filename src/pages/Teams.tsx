// import React, { useState, useEffect } from 'react';
// import type { Field } from "@/components/CrudForm";
// import BaseCrudPage from "../components/BaseCrudPage";
// import MainLayout from "../components/MainLayout";
// import { useNavigate } from "react-router-dom";
// import teamsApi from '../services/teamsApi';

// // =====================
// // Team Fields
// // =====================
// const teamFields: Field[] = [
//   { name: "name", label: "Crew Name", type: "text" ,required : true},
//   { name: "lead", label: "Team Lead", type: "text" ,required : true},
//   {
//     name: "trade",
//     label: "Trade",
//     type: "select",
//     options: ["Civil/Masonry", "Electrical", "Plumbing", "Carpentry"], required : true
//   },
//   { name: "members", label: "No. of Workers", type: "number" },
//   {
//     name: "project",
//     label: "Assigned Project",
//     type: "select",
//     options: ["Alpha Tower", "Skyline Villa", "Main Road Bridge"],
//     required : true
//   },
//   {
//     name: "status",
//     label: "Status",
//     type: "select",
//     options: ["On Site", "Idle", "Off Duty"],
//   },
// ];

// // =====================
// // Capacity Template
// // =====================
// const capacityTemplate = (props: any) => {
//   const maxCapacity = 20;
//   const members = props.members || props.rowData?.members || 0;
//   const percentage = Math.min((Number(members) / maxCapacity) * 100, 100);

//   return (
//     <div className="w-full pr-4">
//       <div className="flex justify-between mb-1">
//         <span className="text-xs font-semibold text-gray-700">
//           {members} / {maxCapacity}
//         </span>
//       </div>
//       <div className="w-full bg-gray-200 rounded-full h-1.5">
//         <div
//           className={`h-1.5 rounded-full ${
//             percentage > 90 ? "bg-red-500" : "bg-blue-600"
//           }`}
//           style={{ width: `${percentage}%` }}
//         />
//       </div>
//     </div>
//   );
// };

// // =====================
// // Status Badge
// // =====================
// const statusTemplate = (props: any) => {
//   const status = props.status || props.rowData?.status;
  
//   const styles: Record<string, string> = {
//     "On Site": "bg-green-100 text-green-800",
//     "Idle": "bg-yellow-100 text-yellow-800",
//     "Off Duty": "bg-gray-200 text-gray-700",
//   };

//   return (
//     <span
//       className={`px-3 py-1 rounded-full text-xs ${
//         styles[status] || "bg-gray-100"
//       }`}
//     >
//       {status}
//     </span>
//   );
// };

// // =====================
// // Grid Columns
// // =====================
// const teamGridColumns = [
//   { field: "name", headerText: "Crew Name", width: 160 },
//   { field: "trade", headerText: "Trade", width: 140 },
//   { field: "lead", headerText: "Team Lead", width: 150 },
//   {
//     field: "members",
//     headerText: "Capacity",
//     template: capacityTemplate,
//     width: 200,
//   },
//   { field: "project", headerText: "Site Location", width: 160 },
//   {
//     field: "status",
//     headerText: "Status",
//     template: statusTemplate,
//     width: 130,
//   },
// ];

// // =====================
// // Summary Cards
// // =====================
// const TeamSummaryCards = ({ teams }: { teams: any[] }) => {
//   const totalManpower = teams.reduce((acc, t) => acc + Number(t.members || 0), 0);
//   const onSiteCount = teams.filter((t) => t.status === "On Site").length;
//   const idleCount = teams.filter((t) => t.status === "Idle").length;

//   return (
//     <>
//       <div className="bg-white p-4 rounded shadow">
//         <h3 className="text-sm text-gray-500">Total Crews</h3>
//         <p className="text-2xl font-bold">{teams.length}</p>
//       </div>

//       <div className="bg-white p-4 rounded shadow">
//         <h3 className="text-sm text-gray-500">Total Manpower</h3>
//         <p className="text-2xl font-bold text-blue-600">
//           {totalManpower}
//         </p>
//       </div>

//       <div className="bg-white p-4 rounded shadow">
//         <h3 className="text-sm text-gray-500">On Site</h3>
//         <p className="text-2xl font-bold text-green-600">
//           {onSiteCount}
//         </p>
//       </div>

//       <div className="bg-white p-4 rounded shadow">
//         <h3 className="text-sm text-gray-500">Idle Crews</h3>
//         <p className="text-2xl font-bold text-yellow-600">
//           {idleCount}
//         </p>
//       </div>
//     </>
//   );
// };

// // =====================
// // Page Component
// // =====================
// const TeamsPage = () => {
//   const [teams, setTeams] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [user, setUser] = useState<any>(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const userStr = localStorage.getItem('user');
//     const token = localStorage.getItem('token');
    
//     if (!token || !userStr) {
//       navigate('/');
//       return;
//     }

//     try {
//       setUser(JSON.parse(userStr));
//     } catch (e) {
//       console.error('Failed to parse user data');
//     }

//     fetchTeams();
//   }, []);

//   const fetchTeams = async () => {
//     try {
//       const data = await teamsApi.getTeams();
//       setTeams(data);
//     } catch (err: any) {
//       console.error('Fetch teams error:', err);
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAddTeam = async (values: any) => {
//     try {
//       const newTeam = await teamsApi.createTeam(values);
//       await fetchTeams();
//       return newTeam;
//     } catch (err: any) {
//       setError(err.message);
//       throw err;
//     }
//   };

//   const handleEditTeam = async (values: any) => {
//     try {
//       const updatedTeam = await teamsApi.updateTeam(values.id, values);
//       await fetchTeams();
//       return updatedTeam;
//     } catch (err: any) {
//       setError(err.message);
//       throw err;
//     }
//   };

//   const handleDeleteTeam = async (id: number) => {
//     try {
//       await teamsApi.deleteTeam(id);
//       await fetchTeams();
//     } catch (err: any) {
//       setError(err.message);
//       throw err;
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//     navigate('/');
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-xl">Loading teams...</div>
//       </div>
//     );
//   }

//   return (
//     <MainLayout
//       role={user?.role || "USER"}
//       pageTitle="Team Management"
//       showLogout={true}
//       onLogout={handleLogout}
//     >
//       {error && (
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//           Error: {error}
//         </div>
//       )}
      
//       <BaseCrudPage
//         title="Team Assignments"
//         description="Monitor real-time crew capacity and project allocation"
//         fields={teamFields}
//         initialData={teams}
//         gridColumns={teamGridColumns}
//         summaryCards={<TeamSummaryCards teams={teams} />}
//         onAdd={handleAddTeam}
//         onEdit={handleEditTeam}
//         onDelete={handleDeleteTeam}
//       />
//     </MainLayout>
//   );
// };

// export default TeamsPage;


















import React, { useState, useEffect } from 'react';
import type { Field } from "@/components/CrudForm";
import BaseCrudPage from "../components/BaseCrudPage";
import MainLayout from "../components/MainLayout";
import { useNavigate } from "react-router-dom";
import teamsApi from '../services/teamsApi';

// =====================
// Team Fields
// =====================
const teamFields: Field[] = [
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
    name: "project",
    label: "Assigned Project",
    type: "select",
    options: ["Alpha Tower", "Skyline Villa", "Main Road Bridge"],
    required: true
  },
  {
    name: "status",
    label: "Status",
    type: "select",
    options: ["On Site", "Idle", "Off Duty"],
  },
];

// =====================
// Capacity Template
// =====================
const capacityTemplate = (props: any) => {
  // Ensure we have valid data
  const members = props.members || props.rowData?.members || 0;
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
  const status = props.status || props.rowData?.status || "Unknown";
  
  const styles: Record<string, string> = {
    "On Site": "bg-green-100 text-green-800",
    "Idle": "bg-yellow-100 text-yellow-800",
    "Off Duty": "bg-gray-200 text-gray-700",
    "Unknown": "bg-gray-100 text-gray-600"
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
// Grid Columns
// =====================
const teamGridColumns = [
  { field: "name", headerText: "Crew Name", width: 160 },
  { field: "trade", headerText: "Trade", width: 140 },
  { field: "lead", headerText: "Team Lead", width: 150 },
  {
    field: "members",
    headerText: "Capacity",
    template: capacityTemplate,
    width: 200,
  },
  { field: "project", headerText: "Site Location", width: 160 },
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
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-sm text-gray-500">Idle Crews</h3>
        <p className="text-2xl font-bold text-yellow-600">
          {idleCount}
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

    fetchTeams();
  }, []);

const fetchTeams = async (): Promise<any[]> => {  // Add return type
  setLoading(true);
  try {
    const data = await teamsApi.getTeams();
    setTeams(data);
    setError('');
    return data;  // Return the data
  } catch (err: any) {
    console.error('Fetch teams error:', err);
    setError(err.message);
    throw err;  // Re-throw to handle errors
  } finally {
    setLoading(false);
  }
};

  const handleAddTeam = async (values: any) => {
    try {
      const newTeam = await teamsApi.createTeam(values);
      await fetchTeams(); // Refresh after add
      return newTeam;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const handleEditTeam = async (values: any) => {
    try {
      const updatedTeam = await teamsApi.updateTeam(values.id, values);
      await fetchTeams(); // Refresh after edit
      return updatedTeam;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const handleDeleteTeam = async (id: number) => {
    try {
      await teamsApi.deleteTeam(id);
      await fetchTeams(); // Refresh after delete
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
        title="Team Assignments"
        description="Monitor real-time crew capacity and project allocation"
        fields={teamFields}
        initialData={teams}
        gridColumns={teamGridColumns}
        summaryCards={<TeamSummaryCards teams={teams} />}
        onAdd={handleAddTeam}
        onEdit={handleEditTeam}
        onDelete={handleDeleteTeam}
        onDataChange={fetchTeams}
      />
    </MainLayout>
  );
};

export default TeamsPage;