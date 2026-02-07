// import { useState } from "react";
// import { 
//   DashboardLayoutComponent,
//   type PanelModel, 

// } from "@syncfusion/ej2-react-layouts";
// import { 
//   GridComponent, 
//   ColumnsDirective, 
//   ColumnDirective, 
//   Page, 
//   Sort, 
//   Filter, 
//   Inject as GridInject, 
//   Inject
// } from "@syncfusion/ej2-react-grids";
// import { 
//   ChartComponent, 
//   SeriesCollectionDirective, 
//   SeriesDirective, 
//   Inject as ChartInject, 
//   ColumnSeries, 
//   Category, 
//   Legend, 
//   Tooltip 
// } from "@syncfusion/ej2-react-charts";
// import { 
//   GanttComponent, 
//   ColumnsDirective as GanttColumns, 
//   ColumnDirective as GanttColumn, 
//   Inject as GanttInject, 
//   Selection, 
//   Toolbar 
// } from "@syncfusion/ej2-react-gantt";
// import { 
//   PivotViewComponent, 
//   Inject as PivotInject,
//   FieldList,
//   Toolbar as PivotToolbar
// } from "@syncfusion/ej2-react-pivotview";
// import { 
//   DropDownListComponent 
// } from "@syncfusion/ej2-react-dropdowns";

// const DashboardContent = () => {
//   const [selectedProject, setSelectedProject] = useState("All Projects");

//   const projects = ["All Projects", "Highway Expansion", "Office Renovation"];

//   const panels: PanelModel[] = [
//     { id: "panel1", sizeX: 1, sizeY: 1, row: 0, col: 0, content: "<div>Ongoing Projects: 5</div>" },
//     { id: "panel2", sizeX: 1, sizeY: 1, row: 0, col: 1, content: "<div>Teams: 12</div>" },
//   ];

//   return (
//     <div className="space-y-6 p-4">
//       {/* Dashboard Cards */}
//       <div className="mb-6">
//         <DashboardLayoutComponent 
//           cellSpacing={[10, 10]} 
//           columns={4} 
//           panels={panels}
//           id="dashboard-layout"
//         />
//       </div>

//       {/* Project Filter */}
//       <div className="mb-6 w-64">
//         <DropDownListComponent
//           dataSource={projects}
//           value={selectedProject}
//           placeholder="Select Project"
//           change={(e) => setSelectedProject(e.value)}
//           width="250px"
//         />
//       </div>

//       {/* Charts Row */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//         <div className="bg-white p-4 rounded-lg shadow">
//           <ChartComponent 
//             id="chart1"
//             primaryXAxis={{ valueType: "Category" }} 
//             title="Project Progress"
//             height="350px"
//           >
//             <Inject services={[ColumnSeries, Category, Legend, Tooltip]} />
//             <SeriesCollectionDirective>
//               <SeriesDirective
//                 dataSource={[
//                   { x: "Project A", y: 70 },
//                   { x: "Project B", y: 50 },
//                 ]}
//                 xName="x"
//                 yName="y"
//                 type="Column"
//                 name="Progress"
//               />
//             </SeriesCollectionDirective>
//           </ChartComponent>
//         </div>

//         <div className="bg-white p-4 rounded-lg shadow">
//           <ChartComponent 
//             id="chart2"
//             primaryXAxis={{ valueType: "Category" }} 
//             title="Team Workload"
//             height="350px"
//           >
//             <Inject services={[ColumnSeries, Category, Legend, Tooltip]} />
//             <SeriesCollectionDirective>
//               <SeriesDirective
//                 dataSource={[
//                   { x: "Team A", y: 30 },
//                   { x: "Team B", y: 50 },
//                 ]}
//                 xName="x"
//                 yName="y"
//                 type="Column"
//                 name="Workload"
//               />
//             </SeriesCollectionDirective>
//           </ChartComponent>
//         </div>
//       </div>

//       {/* Data Grid */}
//       <div className="bg-white p-4 rounded-lg shadow mb-6">
//         <h3 className="text-lg font-semibold mb-4">Project Overview</h3>
//         <GridComponent
//           dataSource={[
//             { id: 1, name: "Highway Expansion", status: "Ongoing", deadline: "2026-10-15" },
//             { id: 2, name: "Office Renovation", status: "Completed", deadline: "2025-12-20" },
//           ]}
//           allowPaging={true}
//           allowSorting={true}
//           allowFiltering={true}
//           height="300px"
//         >
//           <ColumnsDirective>
//             <ColumnDirective field="name" headerText="Project Name" width={150} />
//             <ColumnDirective field="status" headerText="Status" width={100} />
//             <ColumnDirective field="deadline" headerText="Deadline" width={120} />
//           </ColumnsDirective>
//           <GridInject services={[Page, Sort, Filter]} />
//         </GridComponent>
//       </div>

//       {/* Gantt Chart */}
//       <div className="bg-white p-4 rounded-lg shadow mb-6">
//         <h3 className="text-lg font-semibold mb-4">Project Timeline</h3>
//         <GanttComponent
//           dataSource={[
//             { TaskID: 1, TaskName: "Project Planning", StartDate: new Date("2026-01-01"), Duration: 5, Progress: 100 },
//             { TaskID: 2, TaskName: "Execution", StartDate: new Date("2026-01-06"), Duration: 10, Progress: 50 },
//           ]}
//           taskFields={{ 
//             id: "TaskID", 
//             name: "TaskName", 
//             startDate: "StartDate", 
//             duration: "Duration", 
//             progress: "Progress" 
//           }}
//           height="350px"
//           projectStartDate={new Date("2026-01-01")}
//           projectEndDate={new Date("2026-02-01")}
//         >
//           <GanttInject services={[Selection, Toolbar]} />
//         </GanttComponent>
//       </div>

//       {/* Pivot Table */}
//       <div className="bg-white p-4 rounded-lg shadow">
//         <h3 className="text-lg font-semibold mb-4">Budget Summary</h3>
//         <PivotViewComponent
//           dataSourceSettings={{
//             dataSource: [
//               { Project: "Highway Expansion", Status: "Ongoing", Budget: 50000 },
//               { Project: "Office Renovation", Status: "Completed", Budget: 120000 },
//               { Project: "Highway Expansion", Status: "Completed", Budget: 120000 },
//             ],
//             rows: [{ name: "Project" }],
//             columns: [{ name: "Status" }],
//             values: [{ name: "Budget", caption: "Total Budget" }],
//             formatSettings: [{ name: "Budget", format: "C0" }],
//           }}
//           width="100%"
//           height="350px"
//           showFieldList={true}
//           showToolbar={true}
//         >
//           <PivotInject services={[FieldList, PivotToolbar]} />
//         </PivotViewComponent>
//       </div>
//     </div>
//   );
// };

// export default DashboardContent;








import CostPivotChart from "./CostPivotChart";
import PieChartsDashboard from "./PieChartsDashboard";
import QuickStats from "./QuickStats";

const DashboardContent = () => {
  return (
    <div className="p-4 space-y-6 bg-gray-100 min-h-screen">
      {/* Quick Stats Cards */}
          <h1>Quick Stats</h1>
      <QuickStats />

      <PieChartsDashboard />
      
      <CostPivotChart /> 

    </div>
  );
};

export default DashboardContent;
