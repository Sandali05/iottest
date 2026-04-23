import Sidebar from "../components/common/Sidebar";
import Topbar from "../components/common/Topbar";

export default function DashboardLayout({ children }) {
  return (
    <div className="app-shell">
      <Sidebar />
      <main>
        <Topbar />
        <div className="page-container">{children}</div>
      </main>
    </div>
  );
}
