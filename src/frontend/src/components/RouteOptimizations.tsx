import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ArrowRight,
  CheckCircle,
  RouteIcon,
  TrendingDown,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Status__1 } from "../backend";
import type { RouteOptimization } from "../hooks/useSupplyChain";
import { useApplyOptimization } from "../hooks/useSupplyChain";

const FALLBACK_OPTIMIZATIONS: RouteOptimization[] = [
  {
    optimizationId: 1n,
    shipmentId: 101n,
    currentRoute: "Shanghai → Suez → Rotterdam",
    suggestedRoute: "Shanghai → Cape of Good Hope → Rotterdam",
    reason: "Suez Canal congestion detected — alt route saves 18 hours",
    estimatedSavings: 28000n,
    currentDelay: 64800000000000n,
    status: Status__1.pending,
    createdAt: BigInt(Date.now() - 1800000) * 1_000_000n,
  },
  {
    optimizationId: 2n,
    shipmentId: 102n,
    currentRoute: "Mumbai → Dubai → Hamburg",
    suggestedRoute: "Mumbai → Oman → Mediterranean → Hamburg",
    reason: "Dubai port strike expected — rerouting avoids 36-hour hold",
    estimatedSavings: 42000n,
    currentDelay: 129600000000000n,
    status: Status__1.pending,
    createdAt: BigInt(Date.now() - 3600000) * 1_000_000n,
  },
  {
    optimizationId: 3n,
    shipmentId: 103n,
    currentRoute: "Singapore → Manila → Los Angeles",
    suggestedRoute: "Singapore → Direct Pacific → Los Angeles",
    reason: "Weather window opens in 6 hours — direct routing cuts 2 days",
    estimatedSavings: 19500n,
    currentDelay: 43200000000000n,
    status: Status__1.applied,
    createdAt: BigInt(Date.now() - 7200000) * 1_000_000n,
  },
];

const volumeData = [
  { t: "Mon", v: 145 },
  { t: "Tue", v: 178 },
  { t: "Wed", v: 162 },
  { t: "Thu", v: 190 },
  { t: "Fri", v: 175 },
  { t: "Sat", v: 148 },
  { t: "Sun", v: 192 },
];

const riskData = [
  { region: "APAC", risk: 72 },
  { region: "EMEA", risk: 58 },
  { region: "AMER", risk: 44 },
  { region: "SEA", risk: 65 },
];

const modeSplitData = [
  { name: "Ocean", value: 58, color: "#3B82F6" },
  { name: "Air", value: 22, color: "#2DD4C7" },
  { name: "Rail", value: 12, color: "#22C55E" },
  { name: "Road", value: 8, color: "#F59E0B" },
];

const costTrendData = [
  { m: "Oct", c: 142 },
  { m: "Nov", c: 138 },
  { m: "Dec", c: 155 },
  { m: "Jan", c: 148 },
  { m: "Feb", c: 162 },
  { m: "Mar", c: 175 },
  { m: "Apr", c: 195 },
];

const CHART_TOOLTIP_STYLE = {
  backgroundColor: "oklch(0.21 0.02 225)",
  border: "1px solid oklch(0.28 0.022 225)",
  borderRadius: "4px",
  fontSize: "11px",
  color: "oklch(0.91 0.015 215)",
};

interface RouteOptimizationsProps {
  optimizations?: RouteOptimization[];
  isLoading?: boolean;
}

export function RouteOptimizations({
  optimizations,
  isLoading,
}: RouteOptimizationsProps) {
  const applyOptimization = useApplyOptimization();
  const items =
    optimizations && optimizations.length > 0
      ? optimizations
      : FALLBACK_OPTIMIZATIONS;

  return (
    <div className="card-surface rounded p-4 flex flex-col gap-4 shadow-card">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <RouteIcon size={14} className="text-teal" />
          <span className="text-sm font-semibold text-foreground">
            Route Optimizations
          </span>
        </div>
        <Badge
          variant="outline"
          className="text-xs border-teal-dim text-teal bg-teal-dim"
        >
          {items.filter((o) => o.status === Status__1.pending).length} Pending
        </Badge>
      </div>

      {isLoading ? (
        <div data-ocid="routes.loading_state" className="space-y-2">
          {[1, 2].map((i) => (
            <div key={i} className="h-20 rounded bg-muted animate-pulse" />
          ))}
        </div>
      ) : (
        <ScrollArea className="h-52">
          <div data-ocid="routes.list" className="space-y-2 pr-2">
            {items.map((opt, idx) => (
              <motion.div
                key={String(opt.optimizationId)}
                data-ocid={`routes.item.${idx + 1}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.06 }}
                className="p-2.5 rounded border border-border bg-muted/30 space-y-1.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground flex items-center gap-1 truncate">
                      <span className="truncate">{opt.currentRoute}</span>
                    </p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <ArrowRight
                        size={9}
                        className="text-teal flex-shrink-0"
                      />
                      <p className="text-xs font-medium text-foreground truncate">
                        {opt.suggestedRoute}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      opt.status === Status__1.applied
                        ? "text-xs border-success text-success bg-success-dim flex-shrink-0"
                        : opt.status === Status__1.rejected
                          ? "text-xs border-border text-muted-foreground flex-shrink-0"
                          : "text-xs border-warning text-warning bg-warning-dim flex-shrink-0"
                    }
                  >
                    {opt.status}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground leading-tight">
                  {opt.reason}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-success">
                    <TrendingDown size={10} />
                    <span className="text-xs font-medium">
                      ${Number(opt.estimatedSavings).toLocaleString()} saved
                    </span>
                  </div>
                  {opt.status === Status__1.pending && (
                    <div className="flex gap-1">
                      <button
                        type="button"
                        data-ocid={`routes.approve_button.${idx + 1}`}
                        onClick={() =>
                          applyOptimization.mutate({
                            id: opt.optimizationId,
                            approved: true,
                          })
                        }
                        className="flex items-center gap-0.5 text-xs text-success hover:text-success/80 transition-colors"
                      >
                        <CheckCircle size={11} />
                        <span>Apply</span>
                      </button>
                      <button
                        type="button"
                        data-ocid={`routes.reject_button.${idx + 1}`}
                        onClick={() =>
                          applyOptimization.mutate({
                            id: opt.optimizationId,
                            approved: false,
                          })
                        }
                        className="flex items-center gap-0.5 text-xs text-danger hover:text-danger/80 transition-colors ml-2"
                      >
                        <XCircle size={11} />
                        <span>Reject</span>
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </ScrollArea>
      )}

      {/* 2x2 Mini Charts */}
      <div className="grid grid-cols-2 gap-3">
        <div className="card-surface rounded p-2.5">
          <p className="text-xs text-muted-foreground mb-2">Volume vs. Time</p>
          <ResponsiveContainer width="100%" height={80}>
            <LineChart data={volumeData}>
              <CartesianGrid
                stroke="oklch(0.28 0.022 225 / 0.4)"
                vertical={false}
              />
              <XAxis
                dataKey="t"
                tick={{ fontSize: 9, fill: "oklch(0.67 0.018 215)" }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
              <Line
                type="monotone"
                dataKey="v"
                stroke="#3B82F6"
                strokeWidth={1.5}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card-surface rounded p-2.5">
          <p className="text-xs text-muted-foreground mb-2">Risk by Region</p>
          <ResponsiveContainer width="100%" height={80}>
            <BarChart data={riskData} barSize={12}>
              <CartesianGrid
                stroke="oklch(0.28 0.022 225 / 0.4)"
                vertical={false}
              />
              <XAxis
                dataKey="region"
                tick={{ fontSize: 9, fill: "oklch(0.67 0.018 215)" }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
              <Bar dataKey="risk" fill="#EF4444" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card-surface rounded p-2.5">
          <p className="text-xs text-muted-foreground mb-1.5">Mode Split</p>
          <div className="flex items-center gap-2">
            <ResponsiveContainer width={70} height={70}>
              <PieChart>
                <Pie
                  data={modeSplitData}
                  cx="50%"
                  cy="50%"
                  innerRadius={22}
                  outerRadius={32}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {modeSplitData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-0.5">
              {modeSplitData.map((m) => (
                <div key={m.name} className="flex items-center gap-1">
                  <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: m.color }}
                  />
                  <span className="text-xs text-muted-foreground">
                    {m.name} {m.value}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card-surface rounded p-2.5">
          <p className="text-xs text-muted-foreground mb-2">Cost Trend ($K)</p>
          <ResponsiveContainer width="100%" height={80}>
            <LineChart data={costTrendData}>
              <CartesianGrid
                stroke="oklch(0.28 0.022 225 / 0.4)"
                vertical={false}
              />
              <XAxis
                dataKey="m"
                tick={{ fontSize: 9, fill: "oklch(0.67 0.018 215)" }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
              <Line
                type="monotone"
                dataKey="c"
                stroke="#2DD4C7"
                strokeWidth={1.5}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
