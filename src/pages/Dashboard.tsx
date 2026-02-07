// import { useState } from "react";
// import { useNavigate} from "react-router-dom";

// const sidebarLinks = [
//   { name: "Dashboard", href: "#", icon: "🏠" },
//   { name: "Projects", href: "#", icon: "📁" },
//   { name: "Teams", href: "#", icon: "👷" },
//   { name: "Reports", href: "#", icon: "📊" },
// ];

// const recentProjects = [
//   { id: 1, name: "Highway Expansion", status: "Ongoing", deadline: "2026-10-15" },
//   { id: 2, name: "Office Renovation", status: "Completed", deadline: "2025-12-20" },
//   { id: 3, name: "Bridge Inspection", status: "Pending", deadline: "2026-03-30" },
// ];

// const Dashboard = () => {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     navigate("/", { replace: true });
//   };
//   return (
//     <div className="min-h-screen flex bg-[var(--bs-secondary)]">
//       {/* Sidebar */}
//       <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 p-6">
//         <h2 className="text-2xl font-bold text-[var(--bs-primary)] mb-8">
//           Build<span className="text-amber-500">Setu</span>
//         </h2>
//         <nav className="flex flex-col space-y-4">
//           {sidebarLinks.map(({ name, href, icon }) => (
//             <a
//               key={name}
//               href={href}
//               className="flex items-center space-x-3 text-gray-700 hover:text-[var(--bs-primary)] font-medium"
//             >
//               <span className="text-xl">{icon}</span>
//               <span>{name}</span>
//             </a>
//           ))}
//         </nav>
//       </aside>

//       {/* Main content */}
//       <div className="flex-1 flex flex-col">
//         {/* Topbar */}
//         <header className="flex justify-between items-center bg-white border-b border-gray-200 px-6 py-4">
//           <button
//             className="md:hidden text-[var(--bs-primary)] text-2xl"
//             onClick={() => setSidebarOpen(!sidebarOpen)}
//             aria-label="Toggle sidebar"
//           >
//             ☰
//           </button>
//           <h1 className="text-xl font-semibold text-[var(--bs-primary)]">
//             Dashboard
//           </h1>
//           <div className="flex items-center space-x-4">
//             <span className="text-gray-600 font-medium">Admin</span>
//                 <button
//       className="text-amber-500 hover:underline"
//       onClick={handleLogout}
//     >
//       Logout
//     </button>
//           </div>
//         </header>

//         {/* Content area */}
//         <main className="p-6 space-y-8 overflow-y-auto">
//           {/* Summary cards */}
//           <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             <div className="bs-card p-6">
//               <h3 className="text-lg font-semibold mb-2 text-[var(--bs-primary)]">
//                 Ongoing Projects
//               </h3>
//               <p className="text-3xl font-bold text-gray-800">5</p>
//             </div>
//             <div className="bs-card p-6">
//               <h3 className="text-lg font-semibold mb-2 text-[var(--bs-primary)]">
//                 Teams
//               </h3>
//               <p className="text-3xl font-bold text-gray-800">12</p>
//             </div>
//             <div className="bs-card p-6">
//               <h3 className="text-lg font-semibold mb-2 text-[var(--bs-primary)]">
//                 Pending Tasks
//               </h3>
//               <p className="text-3xl font-bold text-gray-800">23</p>
//             </div>
//           </section>

//           {/* Recent Projects Table */}
//           <section>
//             <h2 className="text-2xl font-semibold mb-4 text-[var(--bs-primary)]">
//               Recent Projects
//             </h2>
//             <div className="overflow-x-auto">
//               <table className="min-w-full bg-white rounded-lg shadow overflow-hidden">
//                 <thead className="bg-[var(--bs-primary)] text-white">
//                   <tr>
//                     <th className="text-left px-6 py-3">Project Name</th>
//                     <th className="text-left px-6 py-3">Status</th>
//                     <th className="text-left px-6 py-3">Deadline</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {recentProjects.map(({ id, name, status, deadline }) => (
//                     <tr key={id} className="border-b border-gray-200 hover:bg-gray-50">
//                       <td className="px-6 py-4">{name}</td>
//                       <td className="px-6 py-4">
//                         <span
//                           className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
//                             status === "Ongoing"
//                               ? "bg-amber-100 text-amber-700"
//                               : status === "Completed"
//                               ? "bg-green-100 text-green-700"
//                               : "bg-gray-200 text-gray-600"
//                           }`}
//                         >
//                           {status}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4">{deadline}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </section>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;





// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import Sidebar from "../components/Sidebar";


// // Mock user role (replace with AuthContext in real app)
// const userRole = "PROJECT_MANAGER"; 

// const Dashboard = () => {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     navigate("/", { replace: true });
//   };

//   return (
//     <div className="min-h-screen flex bg-[var(--bs-secondary)]">
//       {/* Sidebar */}
//       <Sidebar role={userRole} />

//       {/* Main content */}
//       <div className="flex-1 flex flex-col">
//         {/* Topbar */}
//         <header className="flex justify-between items-center bg-white border-b border-gray-200 px-6 py-4">
//           <button
//             className="md:hidden text-[var(--bs-primary)] text-2xl"
//             onClick={() => setSidebarOpen(!sidebarOpen)}
//             aria-label="Toggle sidebar"
//           >
//             ☰
//           </button>
//           <h1 className="text-xl font-semibold text-[var(--bs-primary)]">
//             Dashboard
//           </h1>
//           <div className="flex items-center space-x-4">
//             <span className="text-gray-600 font-medium">{userRole}</span>
//             <button
//               className="text-amber-500 hover:underline"
//               onClick={handleLogout}
//             >
//               Logout
//             </button>
//           </div>
//         </header>

//         {/* Content area */}
//         <main className="p-6 space-y-8 overflow-y-auto">
//           {/* ...existing summary cards and projects table */}
//         </main>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;



// import { DashboardLayoutComponent, type PanelModel } from "@syncfusion/ej2-react-layouts";
// import { GridComponent, ColumnsDirective, ColumnDirective, Page, Sort, Filter } from "@syncfusion/ej2-react-grids";
// import { ChartComponent, SeriesCollectionDirective, SeriesDirective, Inject, ColumnSeries, Tooltip, Legend, Category } from "@syncfusion/ej2-react-charts";
// import { GanttComponent, ColumnsDirective as GanttColumns, ColumnDirective as GanttColumn, Selection, Toolbar } from "@syncfusion/ej2-react-gantt";
// import { PivotViewComponent } from "@syncfusion/ej2-react-pivotview";
// import { DropDownListComponent } from "@syncfusion/ej2-react-dropdowns";
// import { useState } from "react";

// const Dashboard = () => {
//   const [selectedProject, setSelectedProject] = useState("All Projects");

//   // Example filter options
//   const projects = ["All Projects", "Highway Expansion", "Office Renovation"];
// const panels: PanelModel[] = [
//   { id: 'panel1', sizeX: 1, sizeY: 1, row: 0, col: 0, content: '<div>Ongoing Projects: 5</div>' },
//   { id: 'panel2', sizeX: 1, sizeY: 1, row: 0, col: 1, content: '<div>Teams: 12</div>' },
// ];
//   return (
//     <div className="dashboard-container">
//       {/* Cards */}
//    <DashboardLayoutComponent cellSpacing={[10,10]} columns={4} panels={panels} />

//       {/* Filters */}
//       <div className="my-4">
//         <DropDownListComponent 
//           dataSource={projects} 
//           value={selectedProject} 
//           placeholder="Select Project"
//           change={(e) => setSelectedProject(e.value)}
//         />
//       </div>

//       {/* Charts */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <ChartComponent primaryXAxis={{ valueType: 'Category' }} title="Project Progress">
//           <Inject services={[ColumnSeries, Tooltip, Legend, Category]} />
//           <SeriesCollectionDirective>
//             <SeriesDirective dataSource={[{ x: "Project A", y: 70 }, { x: "Project B", y: 50 }]} xName="x" yName="y" type="Column" />
//           </SeriesCollectionDirective>
//         </ChartComponent>

//         <ChartComponent primaryXAxis={{ valueType: 'Category' }} title="Team Workload">
//           <Inject services={[ColumnSeries, Tooltip, Legend, Category]} />
//           <SeriesCollectionDirective>
//             <SeriesDirective dataSource={[{ x: "Team A", y: 30 }, { x: "Team B", y: 50 }]} xName="x" yName="y" type="Column" />
//           </SeriesCollectionDirective>
//         </ChartComponent>
//       </div>

//       {/* DataGrid */}
//       <div className="my-6">
//         <GridComponent dataSource={[
//           { id:1, name: "Highway Expansion", status: "Ongoing", deadline: "2026-10-15" },
//           { id:2, name: "Office Renovation", status: "Completed", deadline: "2025-12-20" }
//         ]} allowPaging={true} allowSorting={true} allowFiltering={true}>
//           <ColumnsDirective>
//             <ColumnDirective field="name" headerText="Project Name" width={150} />
//             <ColumnDirective field="status" headerText="Status" width={100} />
//             <ColumnDirective field="deadline" headerText="Deadline" width={120} />
//           </ColumnsDirective>
//           <Inject services={[Page, Sort, Filter]} />
//         </GridComponent>
//       </div>

//       {/* Gantt Chart */}
//       <div className="my-6">
//         <GanttComponent dataSource={[
//           { TaskID:1, TaskName:"Project Planning", StartDate:new Date("2026-01-01"), Duration:5, Progress:100 },
//           { TaskID:2, TaskName:"Execution", StartDate:new Date("2026-01-06"), Duration:10, Progress:50 }
//         ]} taskFields={{ id:'TaskID', name:'TaskName', startDate:'StartDate', duration:'Duration', progress:'Progress' }} height="300px">
//           <Inject services={[Selection, Toolbar]} />
//         </GanttComponent>
//       </div>

//       {/* Pivot Table */}
//       <div className="my-6">
//         <PivotViewComponent dataSourceSettings={{
//           dataSource: [
//             { Project: "Highway Expansion", Status: "Ongoing", Budget: 50000 },
//             { Project: "Office Renovation", Status: "Completed", Budget: 120000 }
//           ],
//           rows: [{ name: 'Project' }],
//           columns: [{ name: 'Status' }],
//           values: [{ name: 'Budget', caption: 'Total Budget' }],
//           formatSettings: [{ name: 'Budget', format: 'C0' }]
//         }} width="100%" height="300px" />
//       </div>
//     </div>
//   );
// };

// export default Dashboard;


import Layout from "../components/Layout";
import DashboardContent from "../components/DashboardContent";
 // move your Dashboard JSX here

function Dashboard() {
  const role = "SUPER_ADMIN"; // fetch dynamically from user session/auth
  return (
    <Layout role={role}>
      <DashboardContent />
    </Layout>
  );
}

export default Dashboard;
