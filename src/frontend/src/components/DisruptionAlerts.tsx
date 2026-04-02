import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertTriangle, CheckCircle, Clock, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { DisruptionType, Severity } from "../backend";
import type { Disruption } from "../hooks/useSupplyChain";
import { useResolveDisruption } from "../hooks/useSupplyChain";

function severityDot(severity: Severity) {
  if (severity === Severity.red) return "bg-danger";
  if (severity === Severity.orange) return "bg-warning";
  return "bg-yellow-400";
}

function severityLabel(severity: Severity) {
  if (severity === Severity.red) return "Critical";
  if (severity === Severity.orange) return "High";
  return "Medium";
}

function disruptionLabel(type: DisruptionType): string {
  const labelMap: Record<DisruptionType, string> = {
    [DisruptionType.portCongestion]: "Port Congestion",
    [DisruptionType.weatherAdvisory]: "Weather Advisory",
    [DisruptionType.customsDelay]: "Customs Delay",
    [DisruptionType.operationalBottleneck]: "Operational Bottleneck",
    [DisruptionType.infrastructureFailure]: "Infrastructure Failure",
  };
  return labelMap[type] || type;
}

const FALLBACK_DISRUPTIONS: Disruption[] = [
  {
    disruptionId: 1n,
    disruptionType: DisruptionType.portCongestion,
    severity: Severity.red,
    location: "Shanghai Port, China",
    description:
      "Severe congestion at Yangshan Deep Water Port causing 72-hour delays",
    isActive: true,
    timestamp: BigInt(Date.now() - 3600000) * 1_000_000n,
    estimatedResolutionTime: BigInt(Date.now() + 86400000) * 1_000_000n,
    affectedShipmentIds: [1n, 2n, 3n],
  },
  {
    disruptionId: 2n,
    disruptionType: DisruptionType.weatherAdvisory,
    severity: Severity.orange,
    location: "North Atlantic, Route EU-NA",
    description:
      "Storm system Helene disrupting Trans-Atlantic shipping corridors",
    isActive: true,
    timestamp: BigInt(Date.now() - 7200000) * 1_000_000n,
    estimatedResolutionTime: BigInt(Date.now() + 172800000) * 1_000_000n,
    affectedShipmentIds: [4n, 5n],
  },
  {
    disruptionId: 3n,
    disruptionType: DisruptionType.customsDelay,
    severity: Severity.yellow,
    location: "Rotterdam, Netherlands",
    description: "EU customs documentation backlog — 18-hour processing delays",
    isActive: true,
    timestamp: BigInt(Date.now() - 14400000) * 1_000_000n,
    estimatedResolutionTime: BigInt(Date.now() + 43200000) * 1_000_000n,
    affectedShipmentIds: [6n],
  },
  {
    disruptionId: 4n,
    disruptionType: DisruptionType.operationalBottleneck,
    severity: Severity.orange,
    location: "Suez Canal, Egypt",
    description: "Vessel traffic exceeding capacity — queues forming",
    isActive: true,
    timestamp: BigInt(Date.now() - 21600000) * 1_000_000n,
    estimatedResolutionTime: BigInt(Date.now() + 28800000) * 1_000_000n,
    affectedShipmentIds: [7n, 8n],
  },
  {
    disruptionId: 5n,
    disruptionType: DisruptionType.infrastructureFailure,
    severity: Severity.red,
    location: "Singapore Terminal 3",
    description: "Crane malfunction at berth 14 causing offloading delays",
    isActive: true,
    timestamp: BigInt(Date.now() - 900000) * 1_000_000n,
    estimatedResolutionTime: BigInt(Date.now() + 21600000) * 1_000_000n,
    affectedShipmentIds: [9n, 10n, 11n],
  },
];

interface DisruptionAlertsProps {
  disruptions?: Disruption[];
  isLoading?: boolean;
}

export function DisruptionAlerts({
  disruptions,
  isLoading,
}: DisruptionAlertsProps) {
  const resolveDisruption = useResolveDisruption();
  const items =
    disruptions && disruptions.length > 0 ? disruptions : FALLBACK_DISRUPTIONS;

  return (
    <div className="card-surface rounded p-4 flex flex-col gap-3 shadow-card">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle size={14} className="text-warning" />
          <span className="text-sm font-semibold text-foreground">
            Disruption Alerts
          </span>
        </div>
        <Badge
          variant="outline"
          className="text-xs border-warning text-warning bg-warning-dim"
        >
          {items.filter((d) => d.isActive).length} Active
        </Badge>
      </div>

      {isLoading ? (
        <div data-ocid="alerts.loading_state" className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 rounded bg-muted animate-pulse" />
          ))}
        </div>
      ) : (
        <ScrollArea className="h-64">
          <div data-ocid="alerts.list" className="space-y-2 pr-2">
            <AnimatePresence>
              {items.map((disruption, idx) => (
                <motion.div
                  key={String(disruption.disruptionId)}
                  data-ocid={`alerts.item.${idx + 1}`}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex gap-2.5 p-2.5 rounded border border-border bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-shrink-0 mt-0.5">
                    <div
                      className={`w-2 h-2 rounded-full mt-0.5 ${severityDot(disruption.severity)}`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-medium text-foreground leading-tight">
                        {disruptionLabel(disruption.disruptionType)}
                      </p>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {severityLabel(disruption.severity)}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">
                      {disruption.location}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock size={10} />
                        <span>
                          {new Date(
                            Number(disruption.timestamp) / 1_000_000,
                          ).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      {disruption.isActive && (
                        <button
                          type="button"
                          data-ocid={`alerts.resolve_button.${idx + 1}`}
                          onClick={() =>
                            resolveDisruption.mutate(disruption.disruptionId)
                          }
                          className="flex items-center gap-1 text-xs text-success hover:text-success/80 transition-colors"
                        >
                          <CheckCircle size={10} />
                          <span>Resolve</span>
                        </button>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    data-ocid={`alerts.close_button.${idx + 1}`}
                    className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors mt-0.5"
                  >
                    <X size={11} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
