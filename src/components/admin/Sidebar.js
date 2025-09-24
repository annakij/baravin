// src/components/Sidebar.jsx

import { useState, useEffect } from "react";
import { Link, Outlet } from "react-router-dom";
import { LayoutDashboard, ShoppingCart, Package, Users, BarChart2,
  Percent, Truck, Wine, ArrowLeftFromLine, X, Menu } from "lucide-react";
import "./AdminLayout.css";

function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth <= 768) setIsOpen(false);
      else setIsOpen(true);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </a>
        </div>

        <nav className="sidebar-nav">
          <Link to="/admin/hem" className="nav-item">
            <LayoutDashboard size={20} /> {isOpen && "Hem"}
          </Link>
          <Link to="/admin/ordrar" className="nav-item">
            <ShoppingCart size={20} /> {isOpen && "Ordrar"}
          </Link>
          <Link to="/admin/produkter" className="nav-item">
            <Package size={20} /> {isOpen && "Produkter"}
          </Link>
          <Link to="/admin/kunder" className="nav-item">
            <Users size={20} /> {isOpen && "Kunder"}
          </Link>
          <Link to="/admin/rapporter" className="nav-item">
            <BarChart2 size={20} /> {isOpen && "Rapporter"}
          </Link>
          <Link to="/admin/rabatter" className="nav-item">
            <Percent size={20} /> {isOpen && "Rabatter"}
          </Link>
          <Link to="/admin/frakthantering" className="nav-item">
            <Truck size={20} /> {isOpen && "Frakthantering"}
          </Link>
          <Link to="/admin/vinmassor" className="nav-item">
            <Wine size={20} /> {isOpen && "Vinmässor"}
          </Link>
        </nav>
      </aside>

      {/* Hamburger Toggle - Mobile */}
      {!isOpen && isMobile && (
        <a className="mobile-toggle" onClick={() => setIsOpen(true)}>
          ☰
        </a>
      )}

      {/* Main Content */}
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}

export default Sidebar;
