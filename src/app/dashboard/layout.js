// src/app/dashboard/layout.js
import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main">
        <div className="main-content">
          {children}
        </div>
      </main>
    </div>
  )
}