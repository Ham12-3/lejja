import {
  Search,
  Bell,
  Settings,
  HelpCircle,
} from "lucide-react";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { SearchOverlay } from "@/components/search-overlay";
import { DashboardHeader } from "@/components/dashboard-header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <DashboardSidebar />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Header */}
        <DashboardHeader />

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </main>

      {/* Search Overlay (triggered by Ctrl+K or clicking search) */}
      <SearchOverlay />
    </div>
  );
}
