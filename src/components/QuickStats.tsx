import type { FC } from "react";

const QuickStats: FC = () => {
  const stats = [
    {
      section: "Project Summary",
      data: [
        { label: "Project", value: "Alpha Tower" },
        { label: "Health", value: "🟡 On Watch" },
        { label: "CPI", value: 1.02 },
        { label: "SPI", value: 0.94 },
      ],
    },
    {
      section: "Schedule",
      data: [
        { label: "Gantt", value: "⏳" },
        { label: "Milestone Tracker", value: "4/5 Hit" },
        { label: "Next Due", value: "Floor 10 Pour (Feb 28)" },
      ],
    },
    {
      section: "Cost",
      data: [
        { label: "Budget Burn-up", value: "📈" },
        { label: "CV", value: "+$25K" },
        { label: "EAC", value: "$1.18M" },
      ],
    },
    {
      section: "Safety & Quality",
      data: [
        { label: "Incident Counter", value: "142 Days Safe" },
        { label: "Open Punch Items", value: 42 },
      ],
    },
    {
      section: "Action Items",
      data: [
        { label: "Top 5 Aging RFIs", value: "🔴" },
        { label: "Critical Delays", value: "2" },
        { label: "Upcoming Inspections", value: "3" },
      ],
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stats.map((stat) => (
        <div
          key={stat.section}
          className="bg-white p-6 rounded-lg shadow hover:shadow-md transition"
        >
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            {stat.section}
          </h3>
          <ul className="space-y-2">
            {stat.data.map((item, index) => (
              <li key={index} className="flex justify-between">
                <span className="text-gray-500">{item.label}:</span>
                <span className="font-semibold text-gray-800">{item.value}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default QuickStats;
