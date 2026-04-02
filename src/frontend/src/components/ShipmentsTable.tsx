import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  Package,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { RiskLevel, Status } from "../backend";
import type { Shipment } from "../hooks/useSupplyChain";
import { useTriggerOptimization } from "../hooks/useSupplyChain";

const FALLBACK_SHIPMENTS: Shipment[] = [
  {
    shipmentId: 1n,
    routeId: 1n,
    origin: "Shanghai",
    destination: "Rotterdam",
    currentLocation: "Indian Ocean",
    status: Status.inTransit,
    riskLevel: RiskLevel.low,
    eta: BigInt(Date.now() + 172800000) * 1_000_000n,
    weight: 24500n,
    value: 1850000n,
    carrier: "Maersk Line",
    lastUpdated: BigInt(Date.now() - 3600000) * 1_000_000n,
  },
  {
    shipmentId: 2n,
    routeId: 2n,
    origin: "Mumbai",
    destination: "Hamburg",
    currentLocation: "Red Sea",
    status: Status.delayed,
    riskLevel: RiskLevel.high,
    eta: BigInt(Date.now() + 259200000) * 1_000_000n,
    weight: 18300n,
    value: 2240000n,
    carrier: "CMA CGM",
    lastUpdated: BigInt(Date.now() - 7200000) * 1_000_000n,
  },
  {
    shipmentId: 3n,
    routeId: 3n,
    origin: "Los Angeles",
    destination: "Singapore",
    currentLocation: "Pacific Ocean",
    status: Status.arrivingSoon,
    riskLevel: RiskLevel.low,
    eta: BigInt(Date.now() + 43200000) * 1_000_000n,
    weight: 31200n,
    value: 3100000n,
    carrier: "COSCO",
    lastUpdated: BigInt(Date.now() - 1800000) * 1_000_000n,
  },
  {
    shipmentId: 4n,
    routeId: 4n,
    origin: "Rotterdam",
    destination: "New York",
    currentLocation: "Rotterdam Port",
    status: Status.atCustoms,
    riskLevel: RiskLevel.medium,
    eta: BigInt(Date.now() + 345600000) * 1_000_000n,
    weight: 9800n,
    value: 875000n,
    carrier: "Hapag-Lloyd",
    lastUpdated: BigInt(Date.now() - 10800000) * 1_000_000n,
  },
  {
    shipmentId: 5n,
    routeId: 5n,
    origin: "Dubai",
    destination: "Mumbai",
    currentLocation: "Arabian Sea",
    status: Status.inTransit,
    riskLevel: RiskLevel.critical,
    eta: BigInt(Date.now() + 86400000) * 1_000_000n,
    weight: 14600n,
    value: 4200000n,
    carrier: "MSC",
    lastUpdated: BigInt(Date.now() - 900000) * 1_000_000n,
  },
  {
    shipmentId: 6n,
    routeId: 6n,
    origin: "Hamburg",
    destination: "Shanghai",
    currentLocation: "Suez Canal",
    status: Status.delayed,
    riskLevel: RiskLevel.high,
    eta: BigInt(Date.now() + 432000000) * 1_000_000n,
    weight: 22100n,
    value: 1680000n,
    carrier: "Evergreen",
    lastUpdated: BigInt(Date.now() - 5400000) * 1_000_000n,
  },
  {
    shipmentId: 7n,
    routeId: 7n,
    origin: "Singapore",
    destination: "Los Angeles",
    currentLocation: "South China Sea",
    status: Status.inTransit,
    riskLevel: RiskLevel.medium,
    eta: BigInt(Date.now() + 518400000) * 1_000_000n,
    weight: 27800n,
    value: 2950000n,
    carrier: "Yang Ming",
    lastUpdated: BigInt(Date.now() - 2700000) * 1_000_000n,
  },
  {
    shipmentId: 8n,
    routeId: 8n,
    origin: "New York",
    destination: "Dubai",
    currentLocation: "Atlantic Ocean",
    status: Status.delivered,
    riskLevel: RiskLevel.low,
    eta: BigInt(Date.now() - 86400000) * 1_000_000n,
    weight: 11400n,
    value: 1320000n,
    carrier: "ONE Line",
    lastUpdated: BigInt(Date.now() - 86400000) * 1_000_000n,
  },
];

function statusConfig(status: Status) {
  const statusMap = {
    [Status.inTransit]: {
      label: "In Transit",
      className: "border-blue text-blue bg-blue-dim",
    },
    [Status.delayed]: {
      label: "Delayed",
      className: "border-danger text-danger bg-danger-dim",
    },
    [Status.atCustoms]: {
      label: "At Customs",
      className: "border-warning text-warning bg-warning-dim",
    },
    [Status.arrivingSoon]: {
      label: "Arriving Soon",
      className: "border-teal text-teal bg-teal-dim",
    },
    [Status.delivered]: {
      label: "Delivered",
      className: "border-success text-success bg-success-dim",
    },
  };
  return (
    statusMap[status] || {
      label: status,
      className: "border-border text-muted-foreground",
    }
  );
}

function riskConfig(risk: RiskLevel) {
  const riskMap = {
    [RiskLevel.low]: { label: "Low", pct: 20, color: "bg-success" },
    [RiskLevel.medium]: { label: "Med", pct: 50, color: "bg-warning" },
    [RiskLevel.high]: { label: "High", pct: 75, color: "bg-danger" },
    [RiskLevel.critical]: { label: "Critical", pct: 100, color: "bg-danger" },
  };
  return riskMap[risk] || { label: risk, pct: 30, color: "bg-muted" };
}

type SortField = "shipmentId" | "status" | "riskLevel" | "eta";

const STATUS_FILTERS = [
  "all",
  Status.inTransit,
  Status.delayed,
  Status.atCustoms,
  Status.arrivingSoon,
  Status.delivered,
] as const;

type StatusFilterValue = (typeof STATUS_FILTERS)[number];

interface ShipmentsTableProps {
  shipments?: Shipment[];
  isLoading?: boolean;
}

export function ShipmentsTable({ shipments, isLoading }: ShipmentsTableProps) {
  const triggerOpt = useTriggerOptimization();
  const [sortField, setSortField] = useState<SortField>("shipmentId");
  const [sortAsc, setSortAsc] = useState(true);
  const [statusFilter, setStatusFilter] = useState<StatusFilterValue>("all");

  const rawItems =
    shipments && shipments.length > 0 ? shipments : FALLBACK_SHIPMENTS;
  const filtered =
    statusFilter === "all"
      ? rawItems
      : rawItems.filter((s) => s.status === statusFilter);

  const sorted = [...filtered].sort((a, b) => {
    let cmp = 0;
    if (sortField === "shipmentId") cmp = Number(a.shipmentId - b.shipmentId);
    else if (sortField === "eta") cmp = Number(a.eta - b.eta);
    else if (sortField === "status") cmp = a.status.localeCompare(b.status);
    else if (sortField === "riskLevel") {
      const order = [
        RiskLevel.low,
        RiskLevel.medium,
        RiskLevel.high,
        RiskLevel.critical,
      ];
      cmp = order.indexOf(a.riskLevel) - order.indexOf(b.riskLevel);
    }
    return sortAsc ? cmp : -cmp;
  });

  function toggleSort(field: SortField) {
    if (sortField === field) setSortAsc((v) => !v);
    else {
      setSortField(field);
      setSortAsc(true);
    }
  }

  function SortIcon({ field }: { field: SortField }) {
    if (sortField !== field)
      return (
        <ChevronUp size={10} className="text-muted-foreground opacity-30" />
      );
    return sortAsc ? (
      <ChevronUp size={10} className="text-teal" />
    ) : (
      <ChevronDown size={10} className="text-teal" />
    );
  }

  return (
    <div className="card-surface rounded p-4 flex flex-col gap-3 shadow-card">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Package size={14} className="text-blue-light" />
          <span className="text-sm font-semibold text-foreground">
            Current Shipment Status
          </span>
        </div>
        <div data-ocid="shipments.filter.tab" className="flex gap-1 flex-wrap">
          {STATUS_FILTERS.map((s) => (
            <button
              type="button"
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`text-xs px-2 py-0.5 rounded transition-colors ${
                statusFilter === s
                  ? "bg-teal-dim text-teal"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              }`}
            >
              {s === "all" ? "All" : statusConfig(s as Status).label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div data-ocid="shipments.loading_state" className="space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-10 rounded bg-muted animate-pulse" />
          ))}
        </div>
      ) : (
        <ScrollArea className="h-64">
          <Table data-ocid="shipments.table">
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead
                  className="text-xs text-muted-foreground cursor-pointer hover:text-foreground select-none"
                  onClick={() => toggleSort("shipmentId")}
                >
                  <span className="flex items-center gap-1">
                    Ship ID <SortIcon field="shipmentId" />
                  </span>
                </TableHead>
                <TableHead className="text-xs text-muted-foreground">
                  Route
                </TableHead>
                <TableHead className="text-xs text-muted-foreground hidden lg:table-cell">
                  Location
                </TableHead>
                <TableHead
                  className="text-xs text-muted-foreground cursor-pointer hover:text-foreground select-none"
                  onClick={() => toggleSort("status")}
                >
                  <span className="flex items-center gap-1">
                    Status <SortIcon field="status" />
                  </span>
                </TableHead>
                <TableHead
                  className="text-xs text-muted-foreground cursor-pointer hover:text-foreground select-none"
                  onClick={() => toggleSort("eta")}
                >
                  <span className="flex items-center gap-1">
                    ETA <SortIcon field="eta" />
                  </span>
                </TableHead>
                <TableHead
                  className="text-xs text-muted-foreground cursor-pointer hover:text-foreground select-none"
                  onClick={() => toggleSort("riskLevel")}
                >
                  <span className="flex items-center gap-1">
                    Risk <SortIcon field="riskLevel" />
                  </span>
                </TableHead>
                <TableHead className="text-xs text-muted-foreground">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorted.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center text-muted-foreground text-xs py-8"
                    data-ocid="shipments.empty_state"
                  >
                    No shipments found.
                  </TableCell>
                </TableRow>
              )}
              {sorted.map((shipment, idx) => {
                const sc = statusConfig(shipment.status);
                const rc = riskConfig(shipment.riskLevel);
                const eta = new Date(Number(shipment.eta) / 1_000_000);
                const isOverdue =
                  eta < new Date() && shipment.status !== Status.delivered;
                return (
                  <TableRow
                    key={String(shipment.shipmentId)}
                    data-ocid={`shipments.item.${idx + 1}`}
                    className="border-border hover:bg-white/5 transition-colors"
                  >
                    <TableCell className="text-xs font-mono text-muted-foreground py-2.5">
                      SHP-{String(shipment.shipmentId).padStart(4, "0")}
                    </TableCell>
                    <TableCell className="text-xs py-2.5">
                      <span className="text-foreground">{shipment.origin}</span>
                      <span className="text-muted-foreground mx-1">→</span>
                      <span className="text-foreground">
                        {shipment.destination}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground py-2.5 hidden lg:table-cell">
                      {shipment.currentLocation}
                    </TableCell>
                    <TableCell className="py-2.5">
                      <Badge
                        variant="outline"
                        className={`text-xs ${sc.className}`}
                      >
                        {sc.label}
                      </Badge>
                    </TableCell>
                    <TableCell
                      className={`text-xs py-2.5 ${isOverdue ? "text-danger" : "text-foreground"}`}
                    >
                      {shipment.status === Status.delivered
                        ? "Delivered"
                        : eta.toLocaleDateString([], {
                            month: "short",
                            day: "numeric",
                          })}
                    </TableCell>
                    <TableCell className="py-2.5">
                      <div className="flex items-center gap-1.5">
                        <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
                          <div
                            className={`h-full rounded-full ${rc.color}`}
                            style={{ width: `${rc.pct}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {rc.label}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="py-2.5">
                      <div className="flex items-center gap-1">
                        <Button
                          data-ocid={`shipments.optimize_button.${idx + 1}`}
                          size="sm"
                          variant="outline"
                          className="h-6 text-xs px-2 border-teal-dim text-teal hover:bg-teal-dim"
                          onClick={() => triggerOpt.mutate(shipment)}
                          disabled={triggerOpt.isPending}
                        >
                          <Zap size={10} className="mr-1" />
                          Optimize
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              data-ocid={`shipments.more_button.${idx + 1}`}
                              size="sm"
                              variant="ghost"
                              className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                            >
                              <MoreHorizontal size={12} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="text-xs">
                            <DropdownMenuItem
                              data-ocid={`shipments.view_button.${idx + 1}`}
                            >
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              data-ocid={`shipments.track_button.${idx + 1}`}
                            >
                              Track Shipment
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              data-ocid={`shipments.report_button.${idx + 1}`}
                              className="text-danger focus:text-danger"
                            >
                              Flag Issue
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </ScrollArea>
      )}
    </div>
  );
}
