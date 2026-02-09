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

export default function App() {
  registerLicense('Ngo9BigBOggjHTQxAR8/V1JGaF1cXmhLYVJ1WmFZfVhgdl9HaVZSTWYuP1ZhSXxVdkdjX39ccX1WT2RYWUF9XEA=');
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
          {/* Redirect unknown routes to login */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </React.StrictMode>
  );
}
