import { motion } from "motion/react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const TOOLTIP_STYLE = {
  backgroundColor: "oklch(0.21 0.02 225)",
  border: "1px solid oklch(0.28 0.022 225)",
  borderRadius: "4px",
  fontSize: "11px",
  color: "oklch(0.91 0.015 215)",
};

const onTimeData = [
  { month: "Oct", rate: 91.2, target: 95 },
  { month: "Nov", rate: 92.8, target: 95 },
  { month: "Dec", rate: 89.4, target: 95 },
  { month: "Jan", rate: 93.1, target: 95 },
  { month: "Feb", rate: 94.7, target: 95 },
  { month: "Mar", rate: 95.2, target: 95 },
  { month: "Apr", rate: 96.1, target: 95 },
];

const disruptions12w = [
  { week: "W1", portCongestion: 3, weather: 2, customs: 1, operational: 1 },
  { week: "W2", portCongestion: 5, weather: 1, customs: 2, operational: 2 },
  { week: "W3", portCongestion: 2, weather: 4, customs: 1, operational: 1 },
  { week: "W4", portCongestion: 4, weather: 2, customs: 3, operational: 2 },
  { week: "W5", portCongestion: 6, weather: 1, customs: 2, operational: 3 },
  { week: "W6", portCongestion: 3, weather: 3, customs: 1, operational: 1 },
  { week: "W7", portCongestion: 4, weather: 2, customs: 2, operational: 2 },
  { week: "W8", portCongestion: 7, weather: 1, customs: 3, operational: 1 },
  { week: "W9", portCongestion: 5, weather: 2, customs: 2, operational: 2 },
  { week: "W10", portCongestion: 3, weather: 4, customs: 1, operational: 3 },
  { week: "W11", portCongestion: 4, weather: 2, customs: 2, operational: 1 },
  { week: "W12", portCongestion: 6, weather: 1, customs: 3, operational: 2 },
];

const savingsData = [
  { quarter: "Q1'25", routing: 45, prevention: 32, fuel: 28 },
  { quarter: "Q2'25", routing: 52, prevention: 38, fuel: 31 },
  { quarter: "Q3'25", routing: 61, prevention: 44, fuel: 35 },
  { quarter: "Q4'25", routing: 78, prevention: 55, fuel: 42 },
  { quarter: "Q1'26", routing: 95, prevention: 68, fuel: 50 },
];

const carrierPerf = [
  { name: "Maersk Line", onTime: 97, cost: 88, risk: 12 },
  { name: "CMA CGM", onTime: 93, cost: 82, risk: 24 },
  { name: "COSCO", onTime: 91, cost: 76, risk: 31 },
  { name: "Hapag-Lloyd", onTime: 95, cost: 85, risk: 18 },
  { name: "MSC", onTime: 88, cost: 79, risk: 38 },
  { name: "Evergreen", onTime: 89, cost: 72, risk: 35 },
];

export function AnalyticsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="flex flex-col gap-4"
    >
      <h1 className="text-xl font-semibold text-foreground">Analytics</h1>

      <div className="grid grid-cols-2 gap-4">
        {/* On-Time Delivery Trend */}
        <div className="card-surface rounded p-4 shadow-card">
          <p className="text-sm font-medium text-foreground mb-3">
            On-Time Delivery Rate
          </p>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={onTimeData}>
              <CartesianGrid
                stroke="oklch(0.28 0.022 225 / 0.4)"
                vertical={false}
              />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: "oklch(0.67 0.018 215)" }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                domain={[85, 100]}
                tick={{ fontSize: 11, fill: "oklch(0.67 0.018 215)" }}
                tickLine={false}
                axisLine={false}
                unit="%"
              />
              <Tooltip
                contentStyle={TOOLTIP_STYLE}
                formatter={(v: number) => [`${v}%`]}
              />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line
                type="monotone"
                dataKey="rate"
                name="Actual"
                stroke="#22C55E"
                strokeWidth={2}
                dot={{ r: 3, fill: "#22C55E" }}
              />
              <Line
                type="monotone"
                dataKey="target"
                name="Target"
                stroke="#3B82F6"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Disruptions by Type */}
        <div className="card-surface rounded p-4 shadow-card">
          <p className="text-sm font-medium text-foreground mb-3">
            Disruptions by Type (12 Weeks)
          </p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={disruptions12w} barSize={6}>
              <CartesianGrid
                stroke="oklch(0.28 0.022 225 / 0.4)"
                vertical={false}
              />
              <XAxis
                dataKey="week"
                tick={{ fontSize: 10, fill: "oklch(0.67 0.018 215)" }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "oklch(0.67 0.018 215)" }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar
                dataKey="portCongestion"
                name="Port Congestion"
                fill="#EF4444"
                stackId="a"
              />
              <Bar
                dataKey="weather"
                name="Weather"
                fill="#F59E0B"
                stackId="a"
              />
              <Bar
                dataKey="customs"
                name="Customs"
                fill="#3B82F6"
                stackId="a"
              />
              <Bar
                dataKey="operational"
                name="Operational"
                fill="#2DD4C7"
                stackId="a"
                radius={[2, 2, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Cost Savings by Category */}
        <div className="card-surface rounded p-4 shadow-card">
          <p className="text-sm font-medium text-foreground mb-3">
            Cost Savings by Category ($K)
          </p>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={savingsData}>
              <defs>
                <linearGradient id="routingGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2DD4C7" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#2DD4C7" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="preventionGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                stroke="oklch(0.28 0.022 225 / 0.4)"
                vertical={false}
              />
              <XAxis
                dataKey="quarter"
                tick={{ fontSize: 11, fill: "oklch(0.67 0.018 215)" }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "oklch(0.67 0.018 215)" }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Area
                type="monotone"
                dataKey="routing"
                name="Route Opt"
                stroke="#2DD4C7"
                fill="url(#routingGrad)"
                strokeWidth={1.5}
              />
              <Area
                type="monotone"
                dataKey="prevention"
                name="Disruption Prevention"
                stroke="#3B82F6"
                fill="url(#preventionGrad)"
                strokeWidth={1.5}
              />
              <Area
                type="monotone"
                dataKey="fuel"
                name="Fuel Efficiency"
                stroke="#22C55E"
                fill="transparent"
                strokeWidth={1.5}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Carrier Performance */}
        <div className="card-surface rounded p-4 shadow-card">
          <p className="text-sm font-medium text-foreground mb-3">
            Carrier Performance
          </p>
          <ResponsiveContainer width="100%" height={180}>
            <ScatterChart>
              <CartesianGrid stroke="oklch(0.28 0.022 225 / 0.4)" />
              <XAxis
                dataKey="cost"
                name="Cost Score"
                tick={{ fontSize: 10, fill: "oklch(0.67 0.018 215)" }}
                tickLine={false}
                axisLine={false}
                label={{
                  value: "Cost Score",
                  position: "insideBottom",
                  offset: -2,
                  style: { fontSize: 10, fill: "oklch(0.67 0.018 215)" },
                }}
              />
              <YAxis
                dataKey="onTime"
                name="On-Time %"
                tick={{ fontSize: 10, fill: "oklch(0.67 0.018 215)" }}
                tickLine={false}
                axisLine={false}
                domain={[85, 100]}
                unit="%"
              />
              <Tooltip
                contentStyle={TOOLTIP_STYLE}
                cursor={{ strokeDasharray: "3 3" }}
                content={({ payload }) => {
                  if (!payload?.length) return null;
                  const d = payload[0].payload;
                  return (
                    <div style={TOOLTIP_STYLE} className="p-2">
                      <p className="font-medium">{d.name}</p>
                      <p>On-Time: {d.onTime}%</p>
                      <p>Cost Score: {d.cost}</p>
                    </div>
                  );
                }}
              />
              <Scatter data={carrierPerf} fill="#3B82F6" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
}
