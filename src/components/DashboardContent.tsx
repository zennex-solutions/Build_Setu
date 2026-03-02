import { useState, useEffect } from "react";
import CostPivotChart from "./CostPivotChart";
import PieChartsDashboard from "./PieChartsDashboard";
import QuickStats from "./QuickStats";

// API Base URL
const API_BASE = 'http://localhost:5000/api';

// Helper for auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
};

const DashboardContent = () => {
  const [dashboardData, setDashboardData] = useState({
    projects: [],
    labour: [],
    materials: [],
    equipment: [],
    variations: [],
    tasks: [],
    suppliers: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState('ytd');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Fetch all dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        const [
          projectsRes,
          labourRes,
          materialsRes,
          equipmentRes,
          variationsRes,
          tasksRes,
          suppliersRes
        ] = await Promise.allSettled([
          fetch(`${API_BASE}/projects`, { headers: getAuthHeaders() }),
          fetch(`${API_BASE}/labour`, { headers: getAuthHeaders() }),
          fetch(`${API_BASE}/materials`, { headers: getAuthHeaders() }),
          fetch(`${API_BASE}/equipment`, { headers: getAuthHeaders() }),
          fetch(`${API_BASE}/variations`, { headers: getAuthHeaders() }),
          fetch(`${API_BASE}/tasks`, { headers: getAuthHeaders() }),
          fetch(`${API_BASE}/suppliers`, { headers: getAuthHeaders() })
        ]);

        const data: any = {};

        if (projectsRes.status === 'fulfilled' && projectsRes.value.ok) {
          const result = await projectsRes.value.json();
          data.projects = result.projects || [];
        }

        if (labourRes.status === 'fulfilled' && labourRes.value.ok) {
          const result = await labourRes.value.json();
          data.labour = result.labour || [];
        }

        if (materialsRes.status === 'fulfilled' && materialsRes.value.ok) {
          const result = await materialsRes.value.json();
          data.materials = result.materials || [];
        }

        if (equipmentRes.status === 'fulfilled' && equipmentRes.value.ok) {
          const result = await equipmentRes.value.json();
          data.equipment = result.equipment || [];
        }

        if (variationsRes.status === 'fulfilled' && variationsRes.value.ok) {
          const result = await variationsRes.value.json();
          data.variations = result.variations || [];
        }

        if (tasksRes.status === 'fulfilled' && tasksRes.value.ok) {
          const result = await tasksRes.value.json();
          data.tasks = result.tasks || [];
        }

        if (suppliersRes.status === 'fulfilled' && suppliersRes.value.ok) {
          const result = await suppliersRes.value.json();
          data.suppliers = result.suppliers || [];
        }

        setDashboardData(data);
        setLastUpdated(new Date());
        setError(null);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
    
    // Refresh every 5 minutes
    const interval = setInterval(fetchDashboardData, 300000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-sm text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="bg-white rounded-xl shadow-sm border border-red-100 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-red-800">Unable to load dashboard</h3>
              <p className="text-sm text-red-600 mt-1">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const dateRangeOptions = [
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' },
    { value: 'ytd', label: 'Year to Date' },
    { value: 'all', label: 'All Time' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Executive Dashboard</h1>
              <div className="flex items-center mt-1 space-x-4">
                <p className="text-sm text-gray-500">
                  Last updated: {lastUpdated?.toLocaleTimeString()}
                </p>
                <button 
                  onClick={() => window.location.reload()}
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                >
                  Refresh
                </button>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-500">Period:</span>
              <div className="flex bg-gray-100 rounded-lg p-1">
                {dateRangeOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setDateRange(option.value)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                      dateRange === option.value
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-8 py-6">
        {/* KPI Cards */}
        <QuickStats data={dashboardData} />

        {/* Analytics Section */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Performance Analytics</h2>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-500">Export</span>
              <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </button>
            </div>
          </div>
          <PieChartsDashboard data={dashboardData} />
        </div>
        
        {/* Cost Analysis */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Financial Overview</h2>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                <span className="text-xs text-gray-600">Budget</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-emerald-600 rounded-full"></span>
                <span className="text-xs text-gray-600">Actual</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-amber-600 rounded-full"></span>
                <span className="text-xs text-gray-600">Variance</span>
              </div>
            </div>
          </div>
          <CostPivotChart data={dashboardData} />
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-400 text-center">
            © 2026 BuildSetu. All rights reserved. | Data refreshes every 5 minutes
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;