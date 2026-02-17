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
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
    registerLicense('Ngo9BigBOggjGyl/VkR+XU9Ff1RDX3xKf0x/TGpQb19xflBPallYVBYiSV9jS3hTdERlWX1cdHBVRWdcU091XQ==');

    return (
        <React.StrictMode>
            <BrowserRouter>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    
                    {/* Protected Routes */}
                    <Route path="/dashboard" element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    } />
                    
                    <Route path="/users" element={
                        <ProtectedRoute>
                            <UserPage />
                        </ProtectedRoute>
                    } />
                    
                    <Route path="/sidebar" element={
                        <ProtectedRoute>
                            <Sidebar role={""} />
                        </ProtectedRoute>
                    } />
                    
                    <Route path="/material-page" element={
                        <ProtectedRoute>
                            <MaterialPage />
                        </ProtectedRoute>
                    } />
                    
                    <Route path="/userapproval" element={
                        <ProtectedRoute>
                            <UserApproval />
                        </ProtectedRoute>
                    } />
                    
                    <Route path="/labour-page" element={
                        <ProtectedRoute>
                            <LabourPage />
                        </ProtectedRoute>
                    } />
                    
                    <Route path="/suppliers" element={
                        <ProtectedRoute>
                            <Suppliers />
                        </ProtectedRoute>
                    } />
                    
                    <Route path="/messages" element={
                        <ProtectedRoute>
                            <MessagesPage />
                        </ProtectedRoute>
                    } />
                    
                    <Route path="/variations" element={
                        <ProtectedRoute>
                            <VariationsPage />
                        </ProtectedRoute>
                    } />
                    
                    <Route path="/projects" element={
                        <ProtectedRoute>
                            <ProjectPage />
                        </ProtectedRoute>
                    } />
                    
                    <Route path="/task-assign" element={
                        <ProtectedRoute>
                            <TaskAssignmentsPage />
                        </ProtectedRoute>
                    } />
                    
                    <Route path="/teams" element={
                        <ProtectedRoute>
                            <Teams />
                        </ProtectedRoute>
                    } />
                    
                    <Route path="/euipments" element={
                        <ProtectedRoute>
                            <EquipmentPage />
                        </ProtectedRoute>
                    } />
                    
                    {/* Redirect unknown routes to login */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </BrowserRouter>
        </React.StrictMode>
    );
}