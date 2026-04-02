import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  FileText,
  Globe,
  Package,
  RouteIcon,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

export type NavPage =
  | "overview"
  | "shipments"
  | "routes"
  | "analytics"
  | "alerts"
  | "reports";

const NAV_ITEMS: {
  id: NavPage;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}[] = [
  { id: "overview", label: "Overview", icon: Globe },
  { id: "shipments", label: "Shipments", icon: Package },
  { id: "routes", label: "Routes", icon: RouteIcon },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "alerts", label: "Alerts", icon: AlertTriangle },
  { id: "reports", label: "Reports", icon: FileText },
];

interface SidebarProps {
  activePage: NavPage;
  onNavigate: (page: NavPage) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export function Sidebar({
  activePage,
  onNavigate,
  collapsed,
  onToggleCollapse,
}: SidebarProps) {
  return (
    <motion.aside
      animate={{ width: collapsed ? 64 : 220 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="flex-shrink-0 flex flex-col h-screen bg-sidebar border-r border-border overflow-hidden z-20"
      style={{ minWidth: collapsed ? 64 : 220 }}
    >
      {/* Brand */}
      <div className="flex items-center h-14 px-3 border-b border-border gap-3">
        <div className="w-8 h-8 rounded-md bg-teal-dim flex items-center justify-center flex-shrink-0">
          <Globe size={16} className="text-teal" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.15 }}
              className="font-semibold text-sm text-foreground whitespace-nowrap tracking-wide"
            >
              ResiliLog
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 py-3 flex flex-col gap-0.5 px-2">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              type="button"
              key={item.id}
              data-ocid={`nav.${item.id}.link`}
              onClick={() => onNavigate(item.id)}
              className={cn(
                "flex items-center gap-3 rounded px-2 py-2.5 text-sm transition-all duration-150 w-full text-left relative",
                isActive
                  ? "sidebar-active-line text-teal font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5",
              )}
            >
              <Icon
                size={16}
                className={cn("flex-shrink-0", isActive ? "text-teal" : "")}
              />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -4 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -4 }}
                    transition={{ duration: 0.12 }}
                    className="whitespace-nowrap overflow-hidden"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          );
        })}
      </nav>

      {/* Collapse Toggle */}
      <div className="border-t border-border p-2">
        <button
          type="button"
          data-ocid="sidebar.toggle"
          onClick={onToggleCollapse}
          className="w-full flex items-center justify-center p-2 rounded text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>
    </motion.aside>
  );
}
