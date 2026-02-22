"use client";

import {
  BookOpen,
  Search,
  AlertTriangle,
  BarChart3,
  CreditCard,
  LayoutDashboard,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = {
  icon: typeof LayoutDashboard;
  label: string;
  href?: string;
  action?: "search";
  badge?: number;
};

const navItems: NavItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: BookOpen, label: "Client Books", href: "/dashboard/books" },
  { icon: Search, label: "Global Search", action: "search" },
  { icon: AlertTriangle, label: "Anomaly Alerts", href: "/dashboard/anomalies", badge: 3 },
  { icon: BarChart3, label: "Reports", href: "/dashboard/reports" },
  { icon: CreditCard, label: "Billing", href: "/dashboard/billing" },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  function isActive(href: string | undefined) {
    if (!href) return false;
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  }

  function openSearch() {
    window.dispatchEvent(
      new KeyboardEvent("keydown", { key: "k", ctrlKey: true })
    );
  }

  return (
    <aside className="w-64 h-full flex flex-col bg-surface border-r border-surface-border flex-shrink-0 z-20">
      {/* Logo */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-[#6a4df4] flex items-center justify-center shadow-lg shadow-primary/20">
          <BookOpen className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-white text-base font-bold leading-tight">
            Lejja
          </h1>
          <p className="text-text-muted text-xs font-normal">
            Command Center
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 overflow-y-auto flex flex-col gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          // Search item opens overlay instead of navigating
          if (item.action === "search") {
            return (
              <button
                key={item.label}
                onClick={openSearch}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-text-muted hover:text-white hover:bg-surface-border/50 w-full text-left"
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
              </button>
            );
          }

          return (
            <Link
              key={item.label}
              href={item.href!}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                active
                  ? "bg-primary/20 text-white border-l-2 border-primary"
                  : "text-text-muted hover:text-white hover:bg-surface-border/50"
              } ${item.badge ? "justify-between" : ""}`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-5 h-5 ${active ? "text-primary" : ""}`}
                />
                <span className="text-sm font-medium">{item.label}</span>
              </div>
              {item.badge && (
                <span className="bg-accent-orange/20 text-accent-orange text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-surface-border">
        <div className="flex items-center gap-3 p-2 rounded-lg bg-surface-border/30 hover:bg-surface-border/50 cursor-pointer transition-colors">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-[#6a4df4] flex items-center justify-center">
            <span className="text-xs font-bold text-white">AO</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              Ada Okonkwo
            </p>
            <p className="text-xs text-text-muted truncate">Owner</p>
          </div>
          <ChevronDown className="w-4 h-4 text-text-muted" />
        </div>
      </div>
    </aside>
  );
}
