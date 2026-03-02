import type { FC } from "react";
import {
  AccumulationChartComponent,
  AccumulationSeriesDirective,
  AccumulationSeriesCollectionDirective,
  Inject,
  PieSeries,
  AccumulationDataLabel,
  Legend,
  Tooltip,
} from "@syncfusion/ej2-react-charts";

interface PieChartsDashboardProps {
  data: {
    projects: any[];
    labour: any[];
    materials: any[];
    equipment: any[];
    variations: any[];
    tasks: any[];
    suppliers: any[];
  };
}

const PieChartsDashboard: FC<PieChartsDashboardProps> = ({ data }) => {
  const {
    projects = [],
    labour = [],
    materials = [],
    equipment = [],
    variations = [],
    tasks = [],
  } = data;

  const charts = [
    {
      id: "projectStatus",
      title: "Project Status",
      data: (() => {
        const planning = projects.filter(p => p.status === "Planning").length;
        const onSite = projects.filter(p => p.status === "On Site").length;
        const completed = projects.filter(p => p.status === "Completed").length;
        const total = projects.length || 1;
        
        return [
          { x: "Planning", y: planning || 1, text: `Planning: ${planning} (${Math.round((planning / total) * 100)}%)` },
          { x: "On Site", y: onSite || 1, text: `On Site: ${onSite} (${Math.round((onSite / total) * 100)}%)` },
          { x: "Completed", y: completed || 1, text: `Completed: ${completed} (${Math.round((completed / total) * 100)}%)` },
        ].filter(item => item.y > 0);
      })(),
    },
    {
      id: "labourCategory",
      title: "Workforce by Category",
      data: (() => {
        const skilled = labour.filter(l => l.category === "Skilled").length;
        const semiskilled = labour.filter(l => l.category === "Semi-skilled").length;
        const unskilled = labour.filter(l => l.category === "Unskilled").length;
        const total = labour.length || 1;
        
        return [
          { x: "Skilled", y: skilled || 1, text: `Skilled: ${skilled} (${Math.round((skilled / total) * 100)}%)` },
          { x: "Semi-skilled", y: semiskilled || 1, text: `Semi-skilled: ${semiskilled} (${Math.round((semiskilled / total) * 100)}%)` },
          { x: "Unskilled", y: unskilled || 1, text: `Unskilled: ${unskilled} (${Math.round((unskilled / total) * 100)}%)` },
        ].filter(item => item.y > 0);
      })(),
    },
    {
      id: "materialStock",
      title: "Material Stock Status",
      data: (() => {
        const normal = materials.filter(m => m.quantity > (m.min_quantity || 0)).length;
        const low = materials.filter(m => m.quantity <= (m.min_quantity || 0)).length;
        const total = materials.length || 1;
        
        return [
          { x: "Normal Stock", y: normal || 1, text: `Normal: ${normal} (${Math.round((normal / total) * 100)}%)` },
          { x: "Low Stock", y: low || 1, text: `Low Stock: ${low} (${Math.round((low / total) * 100)}%)` },
        ].filter(item => item.y > 0);
      })(),
    },
    {
      id: "equipmentStatus",
      title: "Equipment Status",
      data: (() => {
        const available = equipment.filter(e => e.status === "Available").length;
        const inUse = equipment.filter(e => e.status === "In Use").length;
        const maintenance = equipment.filter(e => e.status === "Under Maintenance").length;
        const total = equipment.length || 1;
        
        return [
          { x: "Available", y: available || 1, text: `Available: ${available} (${Math.round((available / total) * 100)}%)` },
          { x: "In Use", y: inUse || 1, text: `In Use: ${inUse} (${Math.round((inUse / total) * 100)}%)` },
          { x: "Maintenance", y: maintenance || 1, text: `Maintenance: ${maintenance} (${Math.round((maintenance / total) * 100)}%)` },
        ].filter(item => item.y > 0);
      })(),
    },
    {
      id: "taskStatus",
      title: "Task Progress",
      data: (() => {
        const pending = tasks.filter(t => t.status === "Pending").length;
        const progress = tasks.filter(t => t.status === "In Progress").length;
        const completed = tasks.filter(t => t.status === "Completed").length;
        const total = tasks.length || 1;
        
        return [
          { x: "Pending", y: pending || 1, text: `Pending: ${pending} (${Math.round((pending / total) * 100)}%)` },
          { x: "In Progress", y: progress || 1, text: `In Progress: ${progress} (${Math.round((progress / total) * 100)}%)` },
          { x: "Completed", y: completed || 1, text: `Completed: ${completed} (${Math.round((completed / total) * 100)}%)` },
        ].filter(item => item.y > 0);
      })(),
    },
    {
      id: "variationStatus",
      title: "Variation Requests",
      data: (() => {
        const requested = variations.filter(v => v.status === "Requested").length;
        const approved = variations.filter(v => v.status === "Approved").length;
        const total = variations.length || 1;
        
        return [
          { x: "Requested", y: requested || 1, text: `Requested: ${requested} (${Math.round((requested / total) * 100)}%)` },
          { x: "Approved", y: approved || 1, text: `Approved: ${approved} (${Math.round((approved / total) * 100)}%)` },
        ].filter(item => item.y > 0);
      })(),
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {charts.map((chart) => (
        <div key={chart.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="text-sm font-medium text-gray-700">{chart.title}</h3>
          </div>
          <div className="p-4">
            <div className="h-64">
              <AccumulationChartComponent
                id={chart.id}
                legendSettings={{ 
                  visible: true, 
                  position: "Bottom",
                  alignment: "Center",
                }}
                tooltip={{ 
                  enable: true, 
                  format: "${point.x}: <b>${point.y}</b> (${point.percentage}%)",
                }}
                margin={{ top: 10, bottom: 40, left: 10, right: 10 }}
                background="transparent"
              >
                <Inject services={[PieSeries, AccumulationDataLabel, Legend, Tooltip]} />
                <AccumulationSeriesCollectionDirective>
                  <AccumulationSeriesDirective
                    dataSource={chart.data}
                    xName="x"
                    yName="y"
                    type="Pie"
                    radius="70%"
                    innerRadius="40%"
                    dataLabel={{
                      visible: true,
                      position: "Outside",
                      name: "x", // Show the category name
                      format: "${point.x}: ${point.y} (${point.percentage}%)", // Custom format
                      font: { 
                        size: "11px", 
                        fontWeight: "500",
                      },
                      connectorStyle: { 
                        type: "Curve", 
                        length: "20px",
                        width: 1 
                      }
                    }}
                    startAngle={0}
                    endAngle={360}
                    explode={false}
                    animation={{ enable: true, duration: 1000 }}
                  />
                </AccumulationSeriesCollectionDirective>
              </AccumulationChartComponent>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PieChartsDashboard;



