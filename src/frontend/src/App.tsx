import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { AnalyticsPage } from "./components/AnalyticsPage";
import { DisruptionAlerts } from "./components/DisruptionAlerts";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { KPICards } from "./components/KPICards";
import { ReportsPage } from "./components/ReportsPage";
import { RouteOptimizations } from "./components/RouteOptimizations";
import { ShipmentsTable } from "./components/ShipmentsTable";
import { type NavPage, Sidebar } from "./components/Sidebar";
import { WorldMap } from "./components/WorldMap";
import {
  useDisruptions,
  useKPIMetrics,
  useRouteOptimizations,
  useShipments,
} from "./hooks/useSupplyChain";

const qc = new QueryClient({
  defaultOptions: { queries: { staleTime: 30_000, retry: 1 } },
});

function Dashboard() {
  const [activePage, setActivePage] = useState<NavPage>("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const { data: shipments, isLoading: shipmentsLoading } = useShipments();
  const { data: disruptions, isLoading: disruptionsLoading } = useDisruptions();
  const { data: optimizations, isLoading: optimizationsLoading } =
    useRouteOptimizations();
  const { data: kpi, isLoading: kpiLoading } = useKPIMetrics();

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((v) => !v)}
      />

      {/* Main area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <Header activePage={activePage} onNavigate={setActivePage} />

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4">
          <AnimatePresence mode="wait">
            {activePage === "overview" && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col gap-4"
              >
                <div className="flex items-center justify-between">
                  <h1 className="text-xl font-semibold text-foreground">
                    Supply Chain Overview
                  </h1>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                    <span>Live Data</span>
                    <span className="text-border">•</span>
                    <span>
                      Updated{" "}
                      {new Date().toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>

                {/* KPI Row */}
                <KPICards data={kpi} isLoading={kpiLoading} />

                {/* Map + Right Column */}
                <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-4">
                  <WorldMap />
                  <div className="flex flex-col gap-4">
                    <DisruptionAlerts
                      disruptions={disruptions}
                      isLoading={disruptionsLoading}
                    />
                  </div>
                </div>

                {/* Table + Optimizations */}
                <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-4">
                  <ShipmentsTable
                    shipments={shipments}
                    isLoading={shipmentsLoading}
                  />
                  <RouteOptimizations
                    optimizations={optimizations}
                    isLoading={optimizationsLoading}
                  />
                </div>
              </motion.div>
            )}

            {activePage === "shipments" && (
              <motion.div
                key="shipments"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col gap-4"
              >
                <h1 className="text-xl font-semibold text-foreground">
                  Shipments
                </h1>
                <KPICards data={kpi} isLoading={kpiLoading} />
                <ShipmentsTable
                  shipments={shipments}
                  isLoading={shipmentsLoading}
                />
              </motion.div>
            )}

            {activePage === "routes" && (
              <motion.div
                key="routes"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col gap-4"
              >
                <h1 className="text-xl font-semibold text-foreground">
                  Route Optimization
                </h1>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                  <RouteOptimizations
                    optimizations={optimizations}
                    isLoading={optimizationsLoading}
                  />
                  <WorldMap />
                </div>
              </motion.div>
            )}

            {activePage === "alerts" && (
              <motion.div
                key="alerts"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col gap-4"
              >
                <h1 className="text-xl font-semibold text-foreground">
                  Disruption Alerts
                </h1>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                  <DisruptionAlerts
                    disruptions={disruptions}
                    isLoading={disruptionsLoading}
                  />
                  <ShipmentsTable
                    shipments={shipments?.filter(
                      (s) =>
                        s.riskLevel === "high" || s.riskLevel === "critical",
                    )}
                    isLoading={shipmentsLoading}
                  />
                </div>
              </motion.div>
            )}

            {activePage === "analytics" && (
              <motion.div
                key="analytics"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <AnalyticsPage />
              </motion.div>
            )}

            {activePage === "reports" && (
              <motion.div
                key="reports"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <ReportsPage />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={qc}>
      <Dashboard />
      <Toaster richColors position="top-right" />
    </QueryClientProvider>
  );
}
