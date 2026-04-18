import React, { useEffect, useState } from "react";
import MainLayout from "../components/MainLayout";

const Reports = () => {
  const [data, setData] = useState<any>({
    users: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    admins: 0,
  });

  const [projects, setProjects] = useState<any[]>([]);
  const [materials, setMaterials] = useState<any[]>([]);
  const [labours, setLabours] = useState<any[]>([]);
  const [equipment, setEquipment] = useState<any[]>([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/dashboard/summary")
      .then((res) => res.json())
      .then((d) => {
        if (d.success) setData(d.summary);
      });

    // Optional APIs (add later if not ready)
    fetch("http://localhost:5000/api/projects")
      .then((r) => r.json())
      .then((d) => setProjects(d.projects || []));
    fetch("http://localhost:5000/api/materials")
      .then((r) => r.json())
      .then((d) => setMaterials(d.materials || []));
    fetch("http://localhost:5000/api/labour")
      .then((r) => r.json())
      .then((d) => setLabours(d.labours || []));
    fetch("http://localhost:5000/api/equipment")
      .then((r) => r.json())
      .then((d) => setEquipment(d.equipment || []));
  }, []);

  // Calculations
  const totalMaterialValue = materials.reduce(
    (sum, m) => sum + (m.quantity * m.unitPrice || 0),
    0,
  );
  const activeProjects = projects.filter((p) => p.status === "On Site").length;
  const totalLabour = labours.length;
  const activeEquipment = equipment.filter((e) => e.status === "In Use").length;

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        {/* TITLE */}
        <h1 className="text-2xl font-bold">📊 Reports Dashboard</h1>

        {/* ================= SUMMARY ================= */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card title="Total Users" value={data.total_users} />
          <Card
            title="Active Users"
            value={data.active_users}
            color="text-green-600"
          />
          <Card
            title="Inactive Users"
            value={data.inactive_users}
            color="text-red-600"
          />
          <Card
            title="Admins"
            value={data.super_admins}
            color="text-purple-600"
          />
        </div>

        {/* ================= PROJECT ================= */}
        <Section title="🏗 Project Reports">
          <Card title="Total Projects" value={projects.length} />
          <Card
            title="Active Projects"
            value={activeProjects}
            color="text-blue-600"
          />
        </Section>

        {/* ================= MATERIAL ================= */}
        <Section title="📦 Material Reports">
          <Card title="Total Materials" value={materials.length} />
          <Card
            title="Inventory Value"
            value={`₹${totalMaterialValue.toLocaleString()}`}
            color="text-green-600"
          />
        </Section>

        {/* ================= LABOUR ================= */}
        <Section title="👷 Labour Reports">
          <Card title="Total Labour" value={totalLabour} />
        </Section>

        {/* ================= EQUIPMENT ================= */}
        <Section title="🚜 Equipment Reports">
          <Card title="Total Equipment" value={equipment.length} />
          <Card title="In Use" value={activeEquipment} color="text-blue-600" />
        </Section>
      </div>
    </MainLayout>
  );
};

// 🔹 Reusable Card
const Card = ({ title, value, color = "text-black" }: any) => (
  <div className="bg-white p-4 rounded shadow">
    <h3 className="text-sm text-gray-500">{title}</h3>
    <p className={`text-2xl font-bold ${color}`}>{value}</p>
  </div>
);

// 🔹 Section Wrapper
const Section = ({ title, children }: any) => (
  <div>
    <h2 className="text-lg font-semibold mb-3">{title}</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">{children}</div>
  </div>
);

export default Reports;
