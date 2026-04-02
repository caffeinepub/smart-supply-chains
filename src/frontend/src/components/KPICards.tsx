import { AlertTriangle, DollarSign, Package, TrendingUp } from "lucide-react";
import { motion } from "motion/react";
import { Line, LineChart, ResponsiveContainer } from "recharts";

const sparklineData = {
  onTime: [
    { v: 91 },
    { v: 93 },
    { v: 90 },
    { v: 94 },
    { v: 92 },
    { v: 96 },
    { v: 94 },
    { v: 97 },
    { v: 95 },
    { v: 96 },
  ],
  disruptions: [
    { v: 3 },
    { v: 5 },
    { v: 4 },
    { v: 7 },
    { v: 6 },
    { v: 8 },
    { v: 5 },
    { v: 9 },
    { v: 7 },
    { v: 8 },
  ],
  atRisk: [
    { v: 12 },
    { v: 14 },
    { v: 11 },
    { v: 17 },
    { v: 15 },
    { v: 13 },
    { v: 18 },
    { v: 16 },
    { v: 14 },
    { v: 15 },
  ],
  savings: [
    { v: 120 },
    { v: 145 },
    { v: 132 },
    { v: 168 },
    { v: 155 },
    { v: 175 },
    { v: 162 },
    { v: 188 },
    { v: 179 },
    { v: 195 },
  ],
};

interface KPIData {
  totalActiveShipments: bigint;
  onTimeDeliveryRate: bigint;
  shipmentsAtRiskCount: bigint;
  activeDisruptionsCount: bigint;
}

interface KPICardsProps {
  data?: KPIData;
  isLoading?: boolean;
}

export function KPICards({ data, isLoading }: KPICardsProps) {
  const onTimeRate = data ? Number(data.onTimeDeliveryRate) : 96;
  const disruptionsCount = data ? Number(data.activeDisruptionsCount) : 8;
  const atRisk = data ? Number(data.shipmentsAtRiskCount) : 15;

  const cards = [
    {
      id: "on-time",
      label: "On-Time Delivery Rate",
      value: `${onTimeRate}%`,
      delta: "+2.1%",
      deltaPositive: true,
      icon: TrendingUp,
      color: "text-success",
      bgColor: "bg-success-dim",
      sparkColor: "#22C55E",
      data: sparklineData.onTime,
    },
    {
      id: "disruptions",
      label: "Active Disruptions",
      value: `${disruptionsCount}`,
      delta: "+3 today",
      deltaPositive: false,
      icon: AlertTriangle,
      color: "text-warning",
      bgColor: "bg-warning-dim",
      sparkColor: "#F59E0B",
      data: sparklineData.disruptions,
    },
    {
      id: "at-risk",
      label: "Shipments at Risk",
      value: `${atRisk}`,
      delta: "-4 since yesterday",
      deltaPositive: true,
      icon: Package,
      color: "text-danger",
      bgColor: "bg-danger-dim",
      sparkColor: "#EF4444",
      data: sparklineData.atRisk,
    },
    {
      id: "savings",
      label: "Cost Savings (USD)",
      value: "$195K",
      delta: "+$16K this week",
      deltaPositive: true,
      icon: DollarSign,
      color: "text-blue-light",
      bgColor: "bg-blue-dim",
      sparkColor: "#60A5FA",
      data: sparklineData.savings,
    },
  ];

  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.id}
            data-ocid={`kpi.${card.id}.card`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07, duration: 0.3 }}
            className="card-surface rounded p-4 flex flex-col gap-2 shadow-card"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-xs text-muted-foreground mb-1">
                  {card.label}
                </p>
                {isLoading ? (
                  <div className="h-8 w-20 bg-muted rounded animate-pulse" />
                ) : (
                  <p className={`text-2xl font-bold ${card.color}`}>
                    {card.value}
                  </p>
                )}
                <p
                  className={`text-xs mt-1 ${card.deltaPositive ? "text-success" : "text-danger"}`}
                >
                  {card.delta}
                </p>
              </div>
              <div
                className={`w-8 h-8 rounded ${card.bgColor} flex items-center justify-center flex-shrink-0`}
              >
                <Icon size={15} className={card.color} />
              </div>
            </div>
            <div className="h-10">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={card.data}>
                  <Line
                    type="monotone"
                    dataKey="v"
                    stroke={card.sparkColor}
                    strokeWidth={1.5}
                    dot={false}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
