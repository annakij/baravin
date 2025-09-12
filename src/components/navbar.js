// Navbar.jsx
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Search, ShoppingCart, User } from "lucide-react";
import { useAuth } from "../context/authContext";
import "./Navbar.css";
import BaraVinLogo from "../images/baravinlogo.avif";
import { FaInstagram, FaFacebook } from "react-icons/fa";

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
              <Link to="/anvandarsida" className="icon-button">
                <User size={24} color="black" />
              </Link>
            ) : (
              <Link to="/authenticate/loggain" className="icon-button">
                <User size={24} color="black" />
              </Link>
            )}
          <Link to="/kundvagn" className="icon-button">
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
          <li><Link to="/event">Kommande Vinmässor</Link></li>
          <li><Link to="/kontakt">Kontakt</Link></li>
          <li><Link to="/privat/instruktioner">Hur fungerar det?</Link></li>

          {/* Visa Admin-länk endast om rollen är Admin */}
          {user && user.role === "0" && (
            <li><Link to="/admin">Adminpanel</Link></li>
          )}
        </ul>

        <div className="icon-group">
          <a className="icon-button" onClick={() => setSearchOpen(!searchOpen)}>
            <Search size={24} />
          </a>
          {user ? (
              <Link to="/anvandarsida" className="icon-button">
                <User size={24} color="black" />
              </Link>
            ) : (
              <Link to="/authenticate/loggain" className="icon-button">
                <User size={24} color="black" />
              </Link>
            )}
          <Link to="/kundvagn" className="icon-button">
            <ShoppingCart size={24} color="black" />
          </Link>
        </div>
      </div>

      {/* Offcanvas meny för mobil */}
      {menuOpen && (
        <div ref={offcanvasRef} className="offcanvas">
          <img className="offcanvas-logo" src={BaraVinLogo} alt="BaraVin" />
          <ul>
            <li onClick={() => setMenuOpen(false)}><Link to="/event">Kommande Vinmässor</Link></li>
            <li onClick={() => setMenuOpen(false)}><Link to="/kontakt">Kontakt</Link></li>
            <li onClick={() => setMenuOpen(false)}><Link to="/privat/instruktioner">Hur fungerar det?</Link></li>

            {user && user.role === "0" && (
              <li onClick={() => setMenuOpen(false)}><Link to="/admin">Adminpanel</Link></li>
            )}

            {user ? (
              <li><a href="/privat"
              onClick={(e) => {
                e.preventDefault();
                logout();
              }}>
              Logga ut</a></li>)
               : (<li onClick={() => setMenuOpen(false)}><Link to="/authenticate/loggain">Logga in</Link></li>)}
          </ul>
          <div className="offcanvas-footer">
            <a
              className="footer-icon"
              href="https://www.instagram.com/baravin.nu"
              target="_blank"
              rel="noopener noreferrer"
            ><FaInstagram size={40} /></a>
            <a
              className="footer-icon"
              href="https://www.facebook.com/baravin.nu"
              target="_blank"
              rel="noopener noreferrer"
              ><FaFacebook size={40} />
            </a>
          </div>
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
