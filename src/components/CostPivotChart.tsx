import { useState, useEffect, type SetStateAction } from "react";
import {
  Inject,
  PivotChart,
  FieldList,
  PivotViewComponent,
} from "@syncfusion/ej2-react-pivotview";

interface CostPivotChartProps {
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

const CostPivotChart: React.FC<CostPivotChartProps> = ({ data }) => {
  const {
    projects = [],
    labour = [],
    materials = [],
    equipment = [],
    variations = [],
  } = data;

  const [pivotData, setPivotData] = useState<any[]>([]);

  useEffect(() => {
    const costData: SetStateAction<any[]> = [];

    // Project Budgets
    projects.forEach(project => {
      costData.push({
        category: "Budget",
        project: project.name || "Unnamed",
        value: Number(project.budget) || 0,
        status: project.status || "Planning",
        month: new Date().toLocaleString('default', { month: 'short' })
      });
    });

    // Labour Costs (monthly)
    labour.filter(l => l.status === "Active").forEach(worker => {
      costData.push({
        category: "Labour",
        project: worker.project_name || "Unassigned",
        value: (Number(worker.daily_rate) || 0) * 26,
        trade: worker.trade || "General",
        month: new Date().toLocaleString('default', { month: 'short' })
      });
    });

    // Material Values
    materials.forEach(material => {
      costData.push({
        category: "Materials",
        project: "Inventory",
        value: (Number(material.quantity) || 0) * (Number(material.unit_price) || 0),
        type: material.category || "General",
        month: new Date().toLocaleString('default', { month: 'short' })
      });
    });

    // Equipment Values
    equipment.forEach(item => {
      costData.push({
        category: "Equipment",
        project: item.project_name || "Pool",
        value: (Number(item.price) || 0) * (Number(item.quantity) || 1),
        status: item.status || "Available",
        month: new Date().toLocaleString('default', { month: 'short' })
      });
    });

    // Variations
    variations.forEach(variation => {
      costData.push({
        category: "Variations",
        project: variation.project_name || "Unknown",
        value: Number(variation.amount) || 0,
        status: variation.status || "Requested",
        month: variation.request_date ? 
          new Date(variation.request_date).toLocaleString('default', { month: 'short' }) : 
          new Date().toLocaleString('default', { month: 'short' })
      });
    });

    setPivotData(costData);
  }, [projects, labour, materials, equipment, variations]);

  const dataSourceSettings = {
    dataSource: pivotData,
    expandAll: false,
    formatSettings: [{ name: "value", format: "C0" }],
    rows: [{ name: "category", caption: "Category" }],
    columns: [{ name: "project", caption: "Project" }],
    values: [{ name: "value", caption: "Amount ($)" }],
    filters: []
  };

  if (pivotData.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-100 p-8">
        <div className="text-center text-gray-400 text-sm">
          No cost data available
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-100 p-4">
      <PivotViewComponent
        id="costPivot"
        dataSourceSettings={dataSourceSettings}
        displayOption={{ view: "Both" }}
        showFieldList={true}
        height={450}
        gridSettings={{ columnWidth: 120 }}
        chartSettings={{
          chartSeries: { 
            type: "Column",
            animation: { enable: false }
          },
          legendSettings: { visible: true, position: "Bottom" },
          tooltip: { enable: true }
        }}
      >
        <Inject services={[PivotChart, FieldList]} />
      </PivotViewComponent>
    </div>
  );
};

export default CostPivotChart;