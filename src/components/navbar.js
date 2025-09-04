// Navbar.jsx
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Search, ShoppingCart, User } from "lucide-react";
import { useAuth } from "../context/authContext";
import "./navbar.css";
import BaraVinLogo from "../images/baravinlogo.avif";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { user, logout } = useAuth();
  const offcanvasRef = useRef(null);

  // close offcanvas if klicked outside on page
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        offcanvasRef.current && 
        !offcanvasRef.current.contains(event.target)
      ) { setMenuOpen(false); }};

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <nav className="navbar">
      {/* Mobil navbar */}
      <div className="navbar-mobile">
        <a className="icon-button" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={28}/> : <Menu size={28} />}
        </a>

        <Link to="/privat" className="navbar-logo">
          <img src={BaraVinLogo} alt="BaraVin" />
        </Link>

        <div className="icon-group">
          <a className="icon-button" onClick={() => setSearchOpen(!searchOpen)}>
            <Search size={24} />
          </a>
          {user ? (
              <Link to="/userpage" className="icon-button">
                <User size={24} color="black" />
              </Link>
            ) : (
              <Link to="/authenticate/signin" className="icon-button">
                <User size={24} color="black" />
              </Link>
            )}
          <Link to="/cart" className="icon-button">
            <ShoppingCart size={24} color="black" />
          </Link>
        </div>
      </div>

      {/* Desktop navbar */}
      <div className="navbar-desktop">
        <Link to="/privat" className="navbar-logo">
          <img src={BaraVinLogo} alt="BaraVin" />
        </Link>

        <ul className="navbar-links">
          <li><Link to="/events">Kommande Vinmässor</Link></li>
          <li><Link to="/contact">Kontakt</Link></li>
          <li><Link to="/how-it-works">Hur fungerar det?</Link></li>

          {/* Visa Admin-länk endast om rollen är Admin */}
          {user && user.role === "Admin" && (
            <li><Link to="/admin">Adminpanel</Link></li>
          )}
        </ul>

        <div className="icon-group">
          <a className="icon-button" onClick={() => setSearchOpen(!searchOpen)}>
            <Search size={24} />
          </a>
          {user ? (
              <Link to="/userpage" className="icon-button">
                <User size={24} color="black" />
              </Link>
            ) : (
              <Link to="/authenticate/signin" className="icon-button">
                <User size={24} color="black" />
              </Link>
            )}
          <Link to="/cart" className="icon-button">
            <ShoppingCart size={24} color="black" />
          </Link>
        </div>
      </div>

      {/* Offcanvas meny för mobil */}
      {menuOpen && (
        <div ref={offcanvasRef} className="offcanvas">
          <ul>
            <li><Link to="/events">Kommande Vinmässor</Link></li>
            <li><Link to="/contact">Kontakt</Link></li>
            <li><Link to="/how-it-works">Hur fungerar det?</Link></li>

            {user && user.role === "Admin" && (
              <li><Link to="/admin">Adminpanel</Link></li>
            )}

            {user ? (
              <li><a
              href="/privat"
              onClick={(e) => {
                e.preventDefault();
                logout();
              }}>
              Logga ut
            </a></li>
            ) : (
              <li><Link to="/authenticate/signin">Logga in</Link></li>
            )}
          </ul>
        </div>
      )}

      {/* Search dropdown */}
      {searchOpen && (
        <div className="search-offcanvas">
          <input type="text" placeholder="Sök region eller vinbox..." />
        </div>
      )}
    </nav>
  );
}

export default Navbar;
