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

const PieChartsDashboard: FC = () => {
  // Data for each pie chart
  const data = {
    budgetAllocation: [
      { x: "Labor", y: 35 },
      { x: "Materials", y: 45 },
      { x: "Equipment", y: 12 },
      { x: "Subcontractors", y: 5 },
      { x: "Contingency", y: 3 },
    ],
    actualSpending: [
      { x: "Spent-to-Date", y: 70 },
      { x: "Remaining", y: 30 },
    ],
    projectPhases: [
      { x: "Site Preparation", y: 100 },
      { x: "Foundation", y: 100 },
      { x: "Structural Frame", y: 85 },
      { x: "MEP Installation", y: 30 },
      { x: "Finishes", y: 0 },
      { x: "Commissioning", y: 0 },
    ],
    workforce: [
      { x: "Carpenters", y: 25 },
      { x: "Electricians", y: 20 },
      { x: "Plumbers", y: 15 },
      { x: "Laborers", y: 30 },
      { x: "Supervisors", y: 10 },
    ],
    changeOrders: [
      { x: "Approved", y: 60 },
      { x: "Pending Review", y: 25 },
      { x: "Submitted", y: 10 },
      { x: "Rejected", y: 5 },
    ],
    safetyIncidents: [
      { x: "Slips/Trips/Falls", y: 40 },
      { x: "Struck-by Object", y: 25 },
      { x: "Equipment-related", y: 20 },
      { x: "Electrical", y: 10 },
      { x: "Other", y: 5 },
    ],
    qualityDeficiencies: [
      { x: "Electrical", y: 30 },
      { x: "Plumbing", y: 25 },
      { x: "Finishes", y: 20 },
      { x: "HVAC", y: 15 },
      { x: "Structural", y: 10 },
    ],
    materialStatus: [
      { x: "Delivered", y: 70 },
      { x: "In Transit", y: 15 },
      { x: "Ordered/Pending", y: 10 },
      { x: "Delayed", y: 5 },
    ],
  };

  // Reusable Pie Chart
  const renderPieChart = (id: string, title: string, chartData: any) => (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4 text-gray-700">{title}</h3>
      <AccumulationChartComponent
        id={id}
        legendSettings={{ visible: true, position: "Bottom" }}
        tooltip={{ enable: true }}
      >
        <Inject services={[PieSeries, AccumulationDataLabel, Legend, Tooltip]} />
        <AccumulationSeriesCollectionDirective>
          <AccumulationSeriesDirective
            dataSource={chartData}
            xName="x"
            yName="y"
            type="Pie"
            dataLabel={{
              visible: true,
              name: "x",
              position: "Outside",
              font: { fontWeight: "600" },
            }}
          />
        </AccumulationSeriesCollectionDirective>
      </AccumulationChartComponent>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {renderPieChart("budgetAllocationPie", "Budget Allocation", data.budgetAllocation)}
      {renderPieChart("actualSpendingPie", "Actual Spending vs Budget", data.actualSpending)}
      {renderPieChart("projectPhasesPie", "Project Phase Completion", data.projectPhases)}
      {renderPieChart("workforcePie", "Workforce Distribution", data.workforce)}
      {renderPieChart("changeOrdersPie", "Change Order Status", data.changeOrders)}
      {renderPieChart("safetyIncidentsPie", "Safety Incident Types", data.safetyIncidents)}
      {renderPieChart("qualityDeficienciesPie", "Quality & Deficiencies", data.qualityDeficiencies)}
      {renderPieChart("materialStatusPie", "Material Status", data.materialStatus)}
    </div>
  );
};

export default PieChartsDashboard;
