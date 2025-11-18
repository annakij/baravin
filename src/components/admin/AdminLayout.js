import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import "./AdminLayout.css";

function AdminLayout() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="admin-layout">
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className={`admin-wrapper ${isOpen ? "" : "sidebar-collapsed"}`}>
        <Topbar />
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
