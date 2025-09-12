import { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { 
  LayoutDashboard, ShoppingCart, Package, Users, BarChart2, 
  Percent, Truck, Wine, ArrowLeftFromLine, X 
} from "lucide-react";

import "./AdminLayout.css";

function AdminLayout() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <aside className={`sidebar ${isOpen ? "open" : "collapsed"}`}>
        <div className="sidebar-header">
            <a onClick={() => setIsOpen(true)}>
            <img 
                src={`${process.env.PUBLIC_URL}/baravinlogo.avif`} 
                alt="BaraVin" 
                className="logo"
            />
            </a>
          {isOpen && <h2>ADMINPANEL</h2>}
          <a className="menu-toggle" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={20}/> : null}
          </a>
        </div>

        <nav className="sidebar-nav">
          <Link to="/admin" className="nav-item">
            <LayoutDashboard size={20}/> {isOpen && "Hem"}
          </Link>
          <Link to="/admin/orders" className="nav-item">
            <ShoppingCart size={20}/> {isOpen && "Ordrar"}
          </Link>
          <Link to="/admin/products" className="nav-item">
            <Package size={20}/> {isOpen && "Produkter"}
          </Link>
          <Link to="/admin/customers" className="nav-item">
            <Users size={20}/> {isOpen && "Kunder"}
          </Link>
          <Link to="/admin/reports" className="nav-item">
            <BarChart2 size={20}/> {isOpen && "Rapporter"}
          </Link>
          <Link to="/admin/discounts" className="nav-item">
            <Percent size={20}/> {isOpen && "Rabatter"}
          </Link>
          <Link to="/admin/shipping" className="nav-item">
            <Truck size={20}/> {isOpen && "Frakthantering"}
          </Link>
          <Link to="/admin/winefairs" className="nav-item">
            <Wine size={20}/> {isOpen && "Vinmässor"}
          </Link>
        </nav>

        <footer className="sidebar-footer">
          <Link to="/" className="nav-item escape">
            <ArrowLeftFromLine size={20}/> {isOpen && "Tillbaka"}
          </Link>
        </footer>
      </aside>

      {/* Main Content */}
      <main className="admin-content">
        <Outlet /> {/* Här laddas undersidor */}
      </main>
    </div>
  );
}

export default AdminLayout;
