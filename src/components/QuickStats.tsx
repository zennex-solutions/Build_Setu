import type { FC } from "react";

interface QuickStatsProps {
  data: {
    projects: any[];
    labour: any[];
    materials: any[];
    equipment: any[];
    variations: any[];
    tasks: any[];
    suppliers: any[];
  };
}

const QuickStats: FC<QuickStatsProps> = ({ data }) => {
  const {
    projects = [],
    labour = [],
    materials = [],
    equipment = [],
    variations = [],
    tasks = [],
    suppliers = []
  } = data;

  // Calculate key metrics
  const activeProjects = projects.filter(p => p.status === "On Site").length;
  const totalBudget = projects.reduce((sum, p) => sum + (Number(p.budget) || 0), 0);
  const completedProjects = projects.filter(p => p.status === "Completed").length;
  
  const activeLabour = labour.filter(l => l.status === "Active").length;
  const monthlyLabourCost = labour
    .filter(l => l.status === "Active")
    .reduce((sum, l) => sum + (Number(l.daily_rate) || 0) * 26, 0);
  
  const totalInventoryValue = materials.reduce(
    (sum, m) => sum + (Number(m.quantity) || 0) * (Number(m.unit_price) || 0), 
    0
  );
  const lowStockMaterials = materials.filter(m => 
    m.quantity <= (m.min_quantity || 0)
  ).length;
  
  const equipmentValue = equipment.reduce(
    (sum, e) => sum + (Number(e.price) || 0) * (Number(e.quantity) || 1), 
    0
  );
  const equipmentUtilization = equipment.filter(e => e.status === "In Use").length;
  
  const pendingTasks = tasks.filter(t => t.status === "Pending").length;
  const inProgressTasks = tasks.filter(t => t.status === "In Progress").length;
  
  const pendingVariations = variations.filter(v => v.status === "Requested").length;
  const variationTotal = variations.reduce((sum, v) => sum + (Number(v.amount) || 0), 0);

  // Calculate today's overdue tasks
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const overdueTasks = tasks.filter(t => {
    if (!t.due_date || t.status === 'Completed') return false;
    const dueDate = new Date(t.due_date);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate < today;
  }).length;

  const kpis = [
    {
      title: "Project Health",
      main: activeProjects,
      subtitle: "Active Projects",
      metrics: [
        { label: "Completed", value: completedProjects },
        { label: "Total Budget", value: `$${(totalBudget / 1000000).toFixed(1)}M` },
      ],
      trend: "+2",
      trendLabel: "vs last month",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      color: "blue"
    },
    {
      title: "Workforce",
      main: activeLabour,
      subtitle: "Active Personnel",
      metrics: [
        { label: "Monthly Cost", value: `$${(monthlyLabourCost / 1000).toFixed(0)}K` },
        { label: "Utilization", value: `${Math.round((activeLabour / (labour.length || 1)) * 100)}%` },
      ],
      trend: `${labour.filter(l => l.status === "On Leave").length}`,
      trendLabel: "on leave",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      color: "emerald"
    },
    {
      title: "Materials & Inventory",
      main: `$${(totalInventoryValue / 1000).toFixed(0)}K`,
      subtitle: "Total Inventory Value",
      metrics: [
        { label: "Low Stock Items", value: lowStockMaterials },
        { label: "Categories", value: [...new Set(materials.map(m => m.category))].length },
      ],
      trend: `${materials.length}`,
      trendLabel: "total items",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      color: "purple"
    },
    {
      title: "Equipment",
      main: equipment.length,
      subtitle: "Total Units",
      metrics: [
        { label: "In Use", value: equipmentUtilization },
        { label: "Total Value", value: `$${(equipmentValue / 1000).toFixed(0)}K` },
      ],
      trend: `${equipment.filter(e => e.status === "Under Maintenance").length}`,
      trendLabel: "in maintenance",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      color: "amber"
    },
    {
      title: "Tasks",
      main: pendingTasks + inProgressTasks,
      subtitle: "Active Tasks",
      metrics: [
        { label: "In Progress", value: inProgressTasks },
        { label: "Overdue", value: overdueTasks },
      ],
      trend: `${pendingTasks}`,
      trendLabel: "pending",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      color: "rose"
    },
    {
      title: "Financial",
      main: `$${(variationTotal / 1000).toFixed(0)}K`,
      subtitle: "Variation Value",
      metrics: [
        { label: "Pending Requests", value: pendingVariations },
        { label: "Approved", value: variations.filter(v => v.status === "Approved").length },
      ],
      trend: `${suppliers.length}`,
      trendLabel: "active suppliers",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "indigo"
    }
  ];

  const colorClasses = {
    blue: {
      bg: "bg-blue-50",
      text: "text-blue-600",
      border: "border-blue-100",
      icon: "text-blue-500"
    },
    emerald: {
      bg: "bg-emerald-50",
      text: "text-emerald-600",
      border: "border-emerald-100",
      icon: "text-emerald-500"
    },
    purple: {
      bg: "bg-purple-50",
      text: "text-purple-600",
      border: "border-purple-100",
      icon: "text-purple-500"
    },
    amber: {
      bg: "bg-amber-50",
      text: "text-amber-600",
      border: "border-amber-100",
      icon: "text-amber-500"
    },
    rose: {
      bg: "bg-rose-50",
      text: "text-rose-600",
      border: "border-rose-100",
      icon: "text-rose-500"
    },
    indigo: {
      bg: "bg-indigo-50",
      text: "text-indigo-600",
      border: "border-indigo-100",
      icon: "text-indigo-500"
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {kpis.map((kpi, index) => {
        const colors = colorClasses[kpi.color as keyof typeof colorClasses];
        
        return (
          <div
            key={index}
            className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200"
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {kpi.title}
                </span>
                <div className={`${colors.bg} p-1.5 rounded-lg`}>
                  <div className={colors.icon}>{kpi.icon}</div>
                </div>
              </div>
            </div>

            {/* Main Value */}
            <div className="px-4 py-3">
              <div className="flex items-baseline">
                <span className="text-2xl font-semibold text-gray-900">{kpi.main}</span>
                <span className="ml-2 text-xs text-gray-500">{kpi.subtitle}</span>
              </div>
            </div>

            {/* Metrics */}
            <div className="px-4 pb-3">
              <div className="grid grid-cols-2 gap-2">
                {kpi.metrics.map((metric, idx) => (
                  <div key={idx} className="bg-gray-50 rounded-lg px-2 py-1.5">
                    <p className="text-[10px] text-gray-500 uppercase">{metric.label}</p>
                    <p className="text-xs font-medium text-gray-900">{metric.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <span className={`text-xs font-medium ${colors.text}`}>{kpi.trend}</span>
                <span className="text-[10px] text-gray-400">{kpi.trendLabel}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default QuickStats;