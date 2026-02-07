import {
  Inject,
  PivotChart,
  FieldList,
  PivotViewComponent,
} from "@syncfusion/ej2-react-pivotview";

const CostPivotChart = () => {
  const costData = [
    { trade: "Electrical", week: "Wk 1", cost: 25000 },
    { trade: "Electrical", week: "Wk 2", cost: 30000 },
    { trade: "Plumbing", week: "Wk 1", cost: 18000 },
    { trade: "Plumbing", week: "Wk 2", cost: 22000 },
    { trade: "Concrete", week: "Wk 1", cost: 45000 },
    { trade: "Concrete", week: "Wk 2", cost: 40000 },
  ];

  const dataSourceSettings = {
    dataSource: costData,
    expandAll: false,
    rows: [{ name: "trade" }],
    columns: [{ name: "week" }],
    values: [{ name: "cost", caption: "Total Cost" }],
    formatSettings: [{ name: "cost", format: "C0" }],
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">
        Cost Analysis (Pivot Chart)
      </h3>
<PivotViewComponent
  id="costPivot"
  dataSourceSettings={dataSourceSettings}
  displayOption={{ view: "Both" }} 
  showFieldList={true}
  height={500}
  chartSettings={{
    chartSeries: { type: "Column" },
    legendSettings: { visible: true },
  }}
>
  <Inject services={[PivotChart, FieldList]} />
</PivotViewComponent>

    </div>
  );
};

export default CostPivotChart;
