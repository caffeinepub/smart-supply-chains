import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Download, FileText, Filter } from "lucide-react";
import { motion } from "motion/react";

const REPORTS = [
  {
    id: 1,
    title: "Weekly Supply Chain Performance Report",
    date: "Apr 1, 2026",
    type: "Performance",
    status: "Ready",
    size: "2.4 MB",
  },
  {
    id: 2,
    title: "Q1 2026 Disruption Impact Analysis",
    date: "Mar 31, 2026",
    type: "Analysis",
    status: "Ready",
    size: "4.8 MB",
  },
  {
    id: 3,
    title: "March 2026 Carrier Scorecard",
    date: "Mar 30, 2026",
    type: "Scorecard",
    status: "Ready",
    size: "1.2 MB",
  },
  {
    id: 4,
    title: "Cost Optimization Opportunities — APAC",
    date: "Mar 28, 2026",
    type: "Optimization",
    status: "Ready",
    size: "3.1 MB",
  },
  {
    id: 5,
    title: "Customs Compliance Review — EU Region",
    date: "Mar 25, 2026",
    type: "Compliance",
    status: "Ready",
    size: "1.8 MB",
  },
  {
    id: 6,
    title: "Q2 2026 Risk Forecast",
    date: "Apr 2, 2026",
    type: "Forecast",
    status: "Generating",
    size: "—",
  },
];

const typeColors: Record<string, string> = {
  Performance: "border-blue text-blue bg-blue-dim",
  Analysis: "border-warning text-warning bg-warning-dim",
  Scorecard: "border-teal text-teal bg-teal-dim",
  Optimization: "border-success text-success bg-success-dim",
  Compliance: "border-muted-foreground text-muted-foreground",
  Forecast: "border-teal text-teal bg-teal-dim",
};

export function ReportsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="flex flex-col gap-4"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-foreground">Reports</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="text-xs border-border text-muted-foreground hover:text-foreground"
            data-ocid="reports.filter.button"
          >
            <Filter size={12} className="mr-1" /> Filter
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-xs border-border text-muted-foreground hover:text-foreground"
            data-ocid="reports.schedule.button"
          >
            <Calendar size={12} className="mr-1" /> Schedule
          </Button>
        </div>
      </div>

      <div data-ocid="reports.list" className="flex flex-col gap-2">
        {REPORTS.map((report, idx) => (
          <motion.div
            key={report.id}
            data-ocid={`reports.item.${idx + 1}`}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="card-surface rounded p-4 flex items-center justify-between shadow-card"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-muted flex items-center justify-center flex-shrink-0">
                <FileText size={14} className="text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  {report.title}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-muted-foreground">
                    {report.date}
                  </span>
                  <span className="text-xs text-border">•</span>
                  <span className="text-xs text-muted-foreground">
                    {report.size}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge
                variant="outline"
                className={`text-xs ${typeColors[report.type] || ""}`}
              >
                {report.type}
              </Badge>
              {report.status === "Ready" ? (
                <Button
                  data-ocid={`reports.download_button.${idx + 1}`}
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs border-teal-dim text-teal hover:bg-teal-dim"
                >
                  <Download size={11} className="mr-1" /> Download
                </Button>
              ) : (
                <Badge
                  variant="outline"
                  className="text-xs border-warning text-warning bg-warning-dim"
                >
                  Generating…
                </Badge>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
