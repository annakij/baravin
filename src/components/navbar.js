import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Search, ShoppingCart, User } from "lucide-react";
import "./navbar.css";

import BaraVinLogo from "../images/baravinlogo.avif";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <nav className="navbar">
      {/* Mobil navbar */}
      <div className="navbar-mobile">
        {/* Toggle knapp */}
        <a
          className="icon-button"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={28}/> : <Menu size={28} />}
        </a>

        {/* Logo centrerad */}
        <Link to="/privat" className="navbar-logo">
          <img src={BaraVinLogo} alt="BaraVin" />
        </Link>

        {/* Höger ikoner */}
        <div className="icon-group">
          <a
            className="icon-button"
            onClick={() => setSearchOpen(!searchOpen)}
          >
            <Search size={24} />
          </a>
          <Link to="/cart" className="icon-button">
            <ShoppingCart size={24} color="black" />
          </Link>
        </div>
      </div>

      {/* Desktop navbar */}
      <div className="navbar-desktop">
        <Link to="/" className="navbar-logo">
          <img src={BaraVinLogo} alt="BaraVin" />
        </Link>

        <ul className="navbar-links">
          <li><Link to="/login">Logga in</Link></li>
          <li><Link to="/events">Kommande Vinmässor</Link></li>
          <li><Link to="/contact">Kontakt</Link></li>
          <li><Link to="/how-it-works">Hur fungerar det?</Link></li>
        </ul>

        <div className="icon-group">
          <a
            className="icon-button"
            onClick={() => setSearchOpen(!searchOpen)}
          >
            <Search size={24} />
          </a>
          <Link to="/login" className="icon-button">
            <User size={24} color="black"/>
          </Link>
          <Link to="/cart" className="icon-button">
            <ShoppingCart size={24} color="black" />
          </Link>
        </div>
      </div>

      {/* Offcanvas meny för mobil */}
      {menuOpen && (
        <div className="offcanvas">
          <ul>
            <li><Link to="/login">Logga in</Link></li>
            <li><Link to="/events">Kommande Vinmässor</Link></li>
            <li><Link to="/contact">Kontakt</Link></li>
            <li><Link to="/how-it-works">Hur fungerar det?</Link></li>
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
