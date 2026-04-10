import { DashboardProvider } from "./_context/DashboardContext";
import Sidebar from "./components/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardProvider>
      <div className="flex h-screen bg-background text-foreground overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 relative min-w-0">
          {children}
        </main>
      </div>
    </DashboardProvider>
  );
}
