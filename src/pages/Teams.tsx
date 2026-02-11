import { useState } from "react";
import CrudForm, { type Field } from "../components/CrudForm";
import {
  GridComponent, ColumnsDirective, ColumnDirective,
  Page, Sort, Filter, Inject, Toolbar, Edit,
} from "@syncfusion/ej2-react-grids";
import { DialogComponent } from "@syncfusion/ej2-react-popups";
import useCrudOperations from "../hooks/useCrudOperations";

const teamFields: Field[] = [
  { name: "name", label: "Crew Name", type: "text" },
  { name: "lead", label: "Team Lead", type: "text" },
  { name: "trade", label: "Trade", type: "select", options: ["Civil/Masonry", "Electrical", "Plumbing", "Carpentry"] },
  { name: "members", label: "No. of Workers", type: "number" },
  { name: "project", label: "Assigned Project", type: "select", options: ["Alpha Tower", "Skyline Villa", "Main Road Bridge"] },
  { name: "status", label: "Status", type: "select", options: ["On Site", "Idle", "Off Duty"] },
];


const capacityTemplate = (props: any) => {
  const maxCapacity = 20; 
  const percentage = Math.min((props.members / maxCapacity) * 100, 100);
  return (
    <div className="w-full pr-4">
      <div className="flex justify-between mb-1">
        <span className="text-xs font-semibold text-gray-700">{props.members} / {maxCapacity}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-1.5">
        <div 
          className={`h-1.5 rounded-full ${percentage > 90 ? 'bg-red-500' : 'bg-blue-600'}`} 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

const initialTeams = [
  { id: 1, name: "Alpha Masonry", lead: "Ali Khan", trade: "Civil/Masonry", members: 12, project: "Alpha Tower", status: "On Site" },
  { id: 2, name: "Sparkies Group", lead: "John Doe", trade: "Electrical", members: 18, project: "Skyline Villa", status: "On Site" },
];

const TeamsPage = () => {
  const {
    data: teams, selectedItem, mode, isDialogOpen, setIsDialogOpen,
    openAdd, handleAdd, handleEdit,
  } = useCrudOperations(initialTeams);

  const handleSubmit = (values: any) => {
    if (mode === "add") {
      handleAdd({ ...values, id: Math.floor(Math.random() * 1000) });
    } else {
      handleEdit({ ...selectedItem, ...values });
    }
    setIsDialogOpen(false);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* 3. Top Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-600">
          <p className="text-sm text-gray-500 font-medium uppercase">Total Crews</p>
          <p className="text-3xl font-bold text-gray-800">{teams.length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-600">
          <p className="text-sm text-gray-500 font-medium uppercase">Total Manpower</p>
          <p className="text-3xl font-bold text-gray-800">
            {teams.reduce((acc, t) => acc + Number(t.members || 0), 0)}
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-orange-500">
          <p className="text-sm text-gray-500 font-medium uppercase">Active Sites</p>
          <p className="text-3xl font-bold text-gray-800">2</p>
        </div>
      </div>

      {/* 4. Table Container */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 border-b flex justify-between items-center bg-white">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Team Assignments</h1>
            <p className="text-sm text-gray-500">Monitoring real-time crew capacity and location</p>
          </div>
          <button 
            onClick={openAdd} 
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-semibold transition-all shadow-lg active:scale-95"
          >
            + Create New Team
          </button>
        </div>

        <div className="p-4">
          <GridComponent dataSource={teams} allowPaging={true} height="400px" toolbar={['Search']}>
            <ColumnsDirective>
              <ColumnDirective field="name" headerText="CREW NAME" width="160" />
              <ColumnDirective field="trade" headerText="TRADE" width="130" />
              <ColumnDirective field="lead" headerText="TEAM LEAD" width="140" />
              <ColumnDirective headerText="CAPACITY UTILIZATION" width="180" template={capacityTemplate} />
              <ColumnDirective field="project" headerText="SITE LOCATION" width="150" />
            </ColumnsDirective>
            <Inject services={[Page, Sort, Filter, Edit]} />
          </GridComponent>
        </div>
      </div>

      {/* 5. The Centered Form Dialog */}
      {isDialogOpen && (
        <DialogComponent
          visible={true}
          width="800px" 
          height="auto"
          header={mode === "add" ? "Register New Crew" : "Edit Crew Info"}
          isModal={true}
          showCloseIcon={true}
          position={{ X: 'center', Y: 'center' }}
          target={document.body}
          close={() => setIsDialogOpen(false)}
        >
          <div className="p-8">
            <div className="grid grid-cols-2 gap-x-10 gap-y-2">
              <CrudForm
                mode={mode}
                fields={teamFields}
                initialValues={selectedItem || {}}
                onSubmit={handleSubmit}
                onCancel={() => setIsDialogOpen(false)}
              />
            </div>
          </div>
        </DialogComponent>
      )}
    </div>
  );
};

export default TeamsPage;