"use client"

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"

const data = [
  { name: "Housing", value: 1200, color: "#0ea5e9" },
  { name: "Food", value: 500, color: "#10b981" },
  { name: "Transportation", value: 300, color: "#f59e0b" },
  { name: "Entertainment", value: 200, color: "#8b5cf6" },
  { name: "Utilities", value: 150, color: "#f43f5e" },
  { name: "Other", value: 100, color: "#64748b" },
]

export function CategoryBreakdown() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            labelLine={false}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => [`$${value}`, "Amount"]}
            contentStyle={{
              backgroundColor: "var(--background)",
              borderColor: "var(--border)",
              borderRadius: "6px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-2 grid grid-cols-2 gap-2">
        {data.map((category) => (
          <div key={category.name} className="flex items-center">
            <div className="mr-2 h-3 w-3 rounded-full" style={{ backgroundColor: category.color }} />
            <span className="text-xs">{category.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

