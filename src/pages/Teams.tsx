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

const statusTemplate = (props: any) => {
  const colors: any = {
    "On Site": "bg-green-100 text-green-800 border-green-200",
    "Idle": "bg-yellow-100 text-yellow-800 border-yellow-200",
    "Off Duty": "bg-gray-100 text-gray-800 border-gray-200"
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${colors[props.status] || colors.Idle}`}>
      {props.status.toUpperCase()}
    </span>
  );
};

const capacityTemplate = (props: any) => {
  const max = 20;
  const pct = Math.min((props.members / max) * 100, 100);
  return (
    <div className="w-full pr-4">
      <div className="flex justify-between mb-1">
        <span className="text-xs font-semibold">{props.members}/{max}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-1.5">
        <div className={`h-1.5 rounded-full ${pct > 90 ? 'bg-red-500' : 'bg-blue-600'}`} style={{ width: `${pct}%` }}></div>
      </div>
    </div>
  );
};

const initialTeams = [
  { id: 1, name: "Alpha Masonry", lead: "Ali Khan", trade: "Civil/Masonry", members: 12, project: "Alpha Tower", status: "On Site" },
  { id: 2, name: "Sparkies Group", lead: "John Doe", trade: "Electrical", members: 18, project: "Skyline Villa", status: "Idle" },
];

const TeamsPage = () => {
  const {
    data: teams, selectedItem, mode, isDialogOpen, setIsDialogOpen,
    openAdd, handleAdd, handleEdit, handleDelete
  } = useCrudOperations(initialTeams);

  const handleSubmit = (values: any) => {
    if (mode === "add") {
      // Vital: Ensures Grid record tracking with a unique identifier
      handleAdd({ ...values, id: Math.floor(Math.random() * 1000) });
    } else {
      handleEdit({ ...selectedItem, ...values });
    }
    setIsDialogOpen(false);
  };

  const actionTemplate = (props: any) => (
    <button 
      onClick={() => handleDelete(props.id)}
      className="text-red-600 hover:text-red-800 font-medium text-sm"
    >
      Delete
    </button>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
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

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 border-b flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Team Assignments</h1>
          <button onClick={openAdd} className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-semibold shadow-lg active:scale-95">
            + Create New Team
          </button>
        </div>

        <div className="p-4">
          <GridComponent dataSource={teams} allowPaging={true} height="400px" toolbar={['Search']}>
            <ColumnsDirective>
              <ColumnDirective field="name" headerText="CREW NAME" width="160" />
              <ColumnDirective field="trade" headerText="TRADE" width="130" />
              <ColumnDirective headerText="STATUS" width="120" template={statusTemplate} />
              <ColumnDirective headerText="CAPACITY" width="180" template={capacityTemplate} />
              <ColumnDirective field="project" headerText="LOCATION" width="150" />
              <ColumnDirective headerText="ACTIONS" width="100" template={actionTemplate} />
            </ColumnsDirective>
            <Inject services={[Page, Sort, Filter, Edit]} />
          </GridComponent>
        </div>
      </div>

      {isDialogOpen && (
        <DialogComponent
          visible={true} width="800px" isModal={true} showCloseIcon={true}
          header={mode === "add" ? "Register New Crew" : "Edit Crew Info"}
          position={{ X: 'center', Y: 'center' }} target={document.body}
          close={() => setIsDialogOpen(false)}
        >
          <div className="p-8">
            <div className="grid grid-cols-2 gap-x-10 gap-y-2">
              <CrudForm
                mode={mode} fields={teamFields} initialValues={selectedItem || {}}
                onSubmit={handleSubmit} onCancel={() => setIsDialogOpen(false)}
              />
            </div>
          </div>
        </DialogComponent>
      )}
    </div>
  );
};

export default TeamsPage;