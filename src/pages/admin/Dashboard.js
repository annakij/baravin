// pages/AdminDashboard.jsx
import DashboardOverview from "../../components/admin/dashboard/DashboardOverview";
import RecentOrders from "../../components/admin/dashboard/RecentOrders";
import TopProducts from "../../components/admin/dashboard/TopProducts";
import "./Dashboard.css";

function Dashboard() {
  return (
    <div className="admin-dashboard">
      <h1>Dashboard</h1>
      <p className="subtitle">Översikt av Bara Vin's prestanda!</p>

      <DashboardOverview />

      <div className="dashboard-bottom">
        <RecentOrders />
        <TopProducts />
      </div>
    </div>
  );
}

export default Dashboard;
