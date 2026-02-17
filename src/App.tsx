import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import "./index.css";
import Register from "./pages/Register";
import UserPage from "./pages/UserPage";
import Sidebar from "./components/Sidebar";
import { registerLicense } from '@syncfusion/ej2-base';
import UserApproval from "./pages/UserApproval";
import MaterialPage from "./pages/MaterialPage";
import LabourPage from "./pages/LabourPage";
import Suppliers from "./pages/Suppliers";
import MessagesPage from "./pages/Messages";
import VariationsPage from "./pages/Variations";
import ProjectPage from "./pages/ProjectPage";
import Teams from "./pages/Teams";
import EquipmentPage from "./pages/Equipment";
import TaskAssignmentsPage from "./pages/TaskAssignmentsPage";






export default function App() {
 
    registerLicense('Ngo9BigBOggjGyl/VkR+XU9Ff1RDX3xKf0x/TGpQb19xflBPallYVBYiSV9jS3hTdERlWX1cdHBVRWdcU091XQ==');

  return (
    <React.StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
           
          <Route path="/users" element={<UserPage />} />
          <Route path="/sidebar" element={<Sidebar role={""} />} />
          <Route path="/material-page" element={<MaterialPage />} />
          <Route path="/userapproval" element={<UserApproval />} />
          <Route path="/labour-page" element={<LabourPage />} />
          <Route path="/suppliers" element={<Suppliers />} />
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="variations" element={<VariationsPage />} />
          <Route path="/projects" element={<ProjectPage/>} />
 <Route path="/task-assign" element={<TaskAssignmentsPage/>} />
<Route path="/teams" element={<Teams />} />.

          <Route path="/euipments" element={<EquipmentPage/>} />
          {/* Redirect unknown routes to login */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </React.StrictMode>
  );
}
