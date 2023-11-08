import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"

const AssetAllocationData = [
  { stock: "Household", allocation: 400 },
  { stock: "Transport", allocation: 300 },
  { stock: "Food", allocation: 300 },
  { stock: "Entertainment", allocation: 200 },
]

const COLORS = ["#1E57D6", "#2563EB", "#4A7FF4", "#6E9BFD"]

export const SpendingCategory = () => {
  return (
    <div className="w-full space-y-2 rounded-lg border p-10">
      <ResponsiveContainer width="100%" height={80}>
        <PieChart>
          <Pie
            nameKey="stock"
            data={AssetAllocationData}
            cx="50%"
            cy="100%"
            startAngle={180}
            endAngle={0}
            innerRadius={20}
            outerRadius={40}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="allocation"
            label
          >
            {AssetAllocationData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
