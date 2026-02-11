import type { Field } from "@/components/CrudForm";
import BaseCrudPage from "../components/BaseCrudPage";
import MainLayout from "../components/MainLayout";

// =====================
// Team Fields
// =====================
const teamFields: Field[] = [
  { name: "name", label: "Crew Name", type: "text" },
  { name: "lead", label: "Team Lead", type: "text" },
  {
    name: "trade",
    label: "Trade",
    type: "select",
    options: ["Civil/Masonry", "Electrical", "Plumbing", "Carpentry"],
  },
  { name: "members", label: "No. of Workers", type: "number" },
  {
    name: "project",
    label: "Assigned Project",
    type: "select",
    options: ["Alpha Tower", "Skyline Villa", "Main Road Bridge"],
  },
  {
    name: "status",
    label: "Status",
    type: "select",
    options: ["On Site", "Idle", "Off Duty"],
  },
];

// =====================
// Sample Data
// =====================
const initialTeams = [
  {
    id: 1,
    name: "Alpha Masonry",
    lead: "Ali Khan",
    trade: "Civil/Masonry",
    members: 12,
    project: "Alpha Tower",
    status: "On Site",
  },
  {
    id: 2,
    name: "Sparkies Group",
    lead: "John Doe",
    trade: "Electrical",
    members: 18,
    project: "Skyline Villa",
    status: "On Site",
  },
];

// =====================
// Capacity Template
// =====================
const capacityTemplate = (props: any) => {
  const maxCapacity = 20;
  const percentage = Math.min(
    (Number(props.members) / maxCapacity) * 100,
    100
  );

  return (
    <div className="w-full pr-4">
      <div className="flex justify-between mb-1">
        <span className="text-xs font-semibold text-gray-700">
          {props.members} / {maxCapacity}
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
  const styles: Record<string, string> = {
    "On Site": "bg-green-100 text-green-800",
    Idle: "bg-yellow-100 text-yellow-800",
    "Off Duty": "bg-gray-200 text-gray-700",
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
const TeamSummaryCards = ({ teams }: { teams: any[] }) => (
  <>
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-sm text-gray-500">Total Crews</h3>
      <p className="text-2xl font-bold">{teams.length}</p>
    </div>

    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-sm text-gray-500">Total Manpower</h3>
      <p className="text-2xl font-bold text-blue-600">
        {teams.reduce((acc, t) => acc + Number(t.members || 0), 0)}
      </p>
    </div>

    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-sm text-gray-500">On Site</h3>
      <p className="text-2xl font-bold text-green-600">
        {teams.filter((t) => t.status === "On Site").length}
      </p>
    </div>

    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-sm text-gray-500">Idle Crews</h3>
      <p className="text-2xl font-bold text-yellow-600">
        {teams.filter((t) => t.status === "Idle").length}
      </p>
    </div>
  </>
);

// =====================
// Page Component
// =====================
const TeamsPage = () => {
  return (
    <MainLayout
      role="SUPER_ADMIN"
      pageTitle="Team Management"
      showLogout={true}
    >
      <BaseCrudPage
        title="Team Assignments"
        description="Monitor real-time crew capacity and project allocation"
        fields={teamFields}
        initialData={initialTeams}
        gridColumns={teamGridColumns}
        summaryCards={<TeamSummaryCards teams={initialTeams} />}
      />
    </MainLayout>
  );
};

export default TeamsPage;
