import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface TopCollegesChartProps {
  data: {
    name: string;
    Combined: number;
    Students: number;
  }[];
}
export default function TopCollegesChart({ data }: TopCollegesChartProps) {
  return (
    <div className="bg-white p-2 rounded-lg">
      <h2 className="text-lg text-center font-bold mb-2">Top 10 Colleges</h2>
      <ResponsiveContainer width="100%" height={360}>
        <BarChart
          layout="vertical"
          data={data}
          margin={{
            top: 5,
            right: 15,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis
            type="category"
            dataKey="name"
            width={250}
            tick={{ fontSize: 12, textAnchor: "end" }}
            tickFormatter={(value) => value.replace(/\s+/g, " ")}
          />
          <Tooltip
            formatter={(value, name) => {
              if (name === "Combined ($M)") {
                return [`$${Number(value).toFixed(1)}M`, "Combined"];
              }
              return [`${Number(Number(value) * 1000).toFixed(0)}`, "Students"];
            }}
          />
          <Legend />
          <Bar dataKey="Combined" fill="#8884d8" name="Combined ($M)" />
          <Bar dataKey="Students" fill="#82ca9d" name="Students" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
