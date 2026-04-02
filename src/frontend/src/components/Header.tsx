import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Bell, Search, Settings, User } from "lucide-react";
import type { NavPage } from "./Sidebar";

const TABS: { id: NavPage; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "shipments", label: "Shipments" },
  { id: "routes", label: "Routes" },
  { id: "analytics", label: "Analytics" },
  { id: "alerts", label: "Alerts" },
];

interface HeaderProps {
  activePage: NavPage;
  onNavigate: (page: NavPage) => void;
}

export function Header({ activePage, onNavigate }: HeaderProps) {
  return (
    <header className="h-14 flex-shrink-0 flex items-center px-4 bg-sidebar border-b border-border gap-4 z-10">
      {/* Primary Tabs */}
      <nav className="flex items-center gap-1 flex-1">
        {TABS.map((tab) => (
          <button
            type="button"
            key={tab.id}
            data-ocid={`header.${tab.id}.tab`}
            onClick={() => onNavigate(tab.id)}
            className={cn(
              "px-3 py-1.5 text-xs font-medium rounded transition-all duration-150",
              activePage === tab.id
                ? "text-teal bg-teal-dim"
                : "text-muted-foreground hover:text-foreground hover:bg-white/5",
            )}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Search */}
      <div className="relative w-48">
        <Search
          size={13}
          className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          data-ocid="header.search_input"
          placeholder="Search shipments…"
          className="pl-8 h-8 text-xs bg-muted border-border focus-visible:ring-1 focus-visible:ring-ring"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          data-ocid="header.alerts.button"
          className="p-2 rounded text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors relative"
        >
          <Bell size={15} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-danger" />
        </button>
        <button
          type="button"
          data-ocid="header.settings.button"
          className="p-2 rounded text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
        >
          <Settings size={15} />
        </button>
        <div
          data-ocid="header.user.button"
          className="w-7 h-7 rounded-full bg-teal-dim border border-teal-dim flex items-center justify-center ml-1 cursor-pointer"
        >
          <User size={13} className="text-teal" />
        </div>
      </div>
    </header>
  );
}
