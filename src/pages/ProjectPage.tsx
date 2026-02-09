import CrudForm, { type Field } from "../components/CrudForm";
import {
  GridComponent, ColumnsDirective, ColumnDirective,
  Page, Sort, Filter, Inject, Toolbar, Edit,
} from "@syncfusion/ej2-react-grids";
import { DialogComponent } from "@syncfusion/ej2-react-popups";
import useCrudOperations from "../hooks/useCrudOperations";

// 1. Defining fields exactly like the Material setup
const projectFields: Field[] = [
  { name: "name", label: "Project Name", type: "text" },
  { name: "location", label: "Site Location", type: "text" },
  { name: "manager", label: "Assigned Manager", type: "select", 
    options: ["Ali Khan", "Sarah Ahmed", "John Smith", "Unassigned"] },
  { name: "taskTime", label: "Site Start Time", type: "text" },
  { name: "budget", label: "Budget ($)", type: "number" },
  { name: "status", label: "Status", type: "select", 
    options: ["Planning", "On Site", "Completed"] },
  { name: "description", label: "Description", type: "textarea" }, // This will span 2 columns
];

const initialProjects = [
  { id: 1, name: "Skyline Villa", location: "Sector 4", manager: "Ali Khan", taskTime: "08:00 AM", status: "On Site", budget: 50000 },
];

const ProjectsPage = () => {
  const {
    data: projects, selectedItem, mode, isDialogOpen, setIsDialogOpen,
    openAdd,  handleAdd, handleEdit, 
  } = useCrudOperations(initialProjects);

  const handleSubmit = (values: any) => {
    if (mode === "add") handleAdd(values);
    else if (mode === "edit") handleEdit({ ...selectedItem, ...values });
    setIsDialogOpen(false);
  };

  return (
    <div className="p-4 space-y-6">
      {/* Header with Stats (Matching the Material Page style) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Total Projects</h3>
          <p className="text-2xl font-bold text-gray-800">{projects.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Active on Site</h3>
          <p className="text-2xl font-bold text-blue-600">
            {projects.filter(p => p.status === "On Site").length}
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Project Management</h1>
            <p className="text-gray-600">Assign managers and track construction tasks</p>
          </div>
          <button onClick={openAdd} className="bg-blue-600 text-white px-4 py-2 rounded-lg">+ Add Project</button>
        </div>

        <div className="p-4">
          <GridComponent dataSource={projects} allowPaging={true} allowSorting={true} toolbar={['Search']}>
            <ColumnsDirective>
              <ColumnDirective field="id" headerText="ID" isPrimaryKey={true} width="80" />
              <ColumnDirective field="name" headerText="Project" width="150" />
              <ColumnDirective field="location" headerText="Site" width="120" />
              <ColumnDirective field="manager" headerText="Manager" width="130" />
              <ColumnDirective field="taskTime" headerText="Start Time" width="120" />
              <ColumnDirective field="status" headerText="Status" width="120" />
            </ColumnsDirective>
            <Inject services={[Page, Sort, Filter, Toolbar, Edit]} />
          </GridComponent>
        </div>
      </div>

      {/* The Popup Form (Matching the Material Dialog) */}
   <DialogComponent
    cssClass="no-scroll-dialog"
  visible={isDialogOpen}
  width="900px" // Make it very wide
  isModal={true}
  header={mode === "add" ? "Add New Project" : "Edit Project"}
  showCloseIcon={true}
  height="auto" 
  target={document.body} 
  position={{ X: 'center', Y: 'center' }}
  close={() => setIsDialogOpen(false)}
>
  <div className="p-4" style={{ overflow: 'hidden' }}>
    <CrudForm
      mode={mode}
      fields={projectFields}
      initialValues={selectedItem || {}}
      onSubmit={handleSubmit}
      onCancel={() => setIsDialogOpen(false)}
      
    />
  </div>
</DialogComponent>
    </div>
  );
};

export default ProjectsPage;