import { useState } from "react";
import CrudForm, { type Field } from "../components/CrudForm";
import {
  GridComponent, ColumnsDirective, ColumnDirective,
  Page, Sort, Filter, Inject, Toolbar, Edit,
} from "@syncfusion/ej2-react-grids";
import { DialogComponent } from "@syncfusion/ej2-react-popups";
import useCrudOperations from "../hooks/useCrudOperations";

// 1. Blueprint for the Team Fields
const teamFields: Field[] = [
  { name: "name", label: "Crew Name", type: "text" },
  { name: "lead", label: "Team Lead", type: "text" },
  { name: "trade", label: "Trade", type: "select", options: ["Civil/Masonry", "Electrical", "Plumbing", "Carpentry"] },
  { name: "members", label: "No. of Workers", type: "number" },
  { name: "project", label: "Assigned Project", type: "select", options: ["Alpha Tower", "Skyline Villa", "Main Road Bridge"] },
  { name: "contact", label: "Contact Phone", type: "text" },
  { name: "status", label: "Status", type: "select", options: ["On Site", "Idle", "Off Duty"] },
];

const initialTeams = [
  { id: 1, name: "Alpha Masonry", lead: "Ali Khan", trade: "Civil/Masonry", members: 12, project: "Alpha Tower", status: "On Site" },
];

const TeamsPage = () => {
  const {
    data: teams, selectedItem, mode, isDialogOpen, setIsDialogOpen,
    openAdd, handleAdd, handleEdit,
  } = useCrudOperations(initialTeams);

  // Function to save the form
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
      {/* 2. Top Stats Bar (BuildSetu Dashboard Style) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-600">
          <p className="text-sm text-gray-500 font-medium">Total Teams</p>
          <p className="text-3xl font-bold text-gray-800">{teams.length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-600">
          <p className="text-sm text-gray-500 font-medium">Workers On-Site</p>
          <p className="text-3xl font-bold text-gray-800">
            {teams.reduce((acc, t) => acc + Number(t.members || 0), 0)}
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-orange-500">
          <p className="text-sm text-gray-500 font-medium">Project Locations</p>
          <p className="text-3xl font-bold text-gray-800">3</p>
        </div>
      </div>

      {/* 3. Main Data Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 border-b flex justify-between items-center bg-white">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Crew Management</h1>
            <p className="text-sm text-gray-500">Track manpower and site assignments</p>
          </div>
          <button 
            onClick={openAdd} 
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-semibold transition-all shadow-lg"
          >
            + Add New Team
          </button>
        </div>

        <div className="p-4">
          <GridComponent dataSource={teams} allowPaging={true} height="400px" toolbar={['Search']}>
            <ColumnsDirective>
              <ColumnDirective field="name" headerText="CREW NAME" width="150" />
              <ColumnDirective field="trade" headerText="TRADE" width="120" />
              <ColumnDirective field="lead" headerText="TEAM LEAD" width="130" />
              <ColumnDirective field="project" headerText="SITE LOCATION" width="150" />
            </ColumnsDirective>
            <Inject services={[Page, Sort, Filter, Edit]} />
          </GridComponent>
        </div>
      </div>

      {/* 4. The Centered Form (Fixed Layout) */}
      {isDialogOpen && (
        <DialogComponent
          visible={true}
          width="850px" 
          height="auto"
          header={mode === "add" ? "Create New Crew" : "Update Crew"}
          isModal={true}
          showCloseIcon={true}
          position={{ X: 'center', Y: 'center' }}
          target={document.body}
          close={() => setIsDialogOpen(false)}
        >
          <div className="p-6">
             {/* This grid wrapper styles the form into 2 columns */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
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