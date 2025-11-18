import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Search, ShoppingCart, User } from "lucide-react";
import { FaInstagram, FaFacebook } from "react-icons/fa";
import { useAuth } from "../context/authContext";
import BaraVinLogo from "../images/baravinlogo.avif";
import api from "../api/axiosInstance";
import "./Navbar.css";

function Navbar({ cartCount }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [regions, setRegions] = useState([]);
  const [filteredRegions, setFilteredRegions] = useState([]);
  const [filteredBoxes, setFilteredBoxes] = useState([]);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const offcanvasRef = useRef(null);

  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const searchRef = useRef(null);

  // Fetch all regions
  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const res = await api.get("/regions");
        setRegions(res.data || []);
      } catch (err) {
        console.error("Kunde inte hämta regioner:", err);
      }
    };
    fetchRegions();
  }, []);

  // Filter regions / boxes
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredRegions([]);
      setFilteredBoxes([]);
      return;
    }

    const term = searchTerm.toLowerCase();

    // Regionmatch
    const matchedRegions = regions.filter((r) =>
      r.name.toLowerCase().includes(term)
    );

    // Boxmatch
    const matchedBoxes = regions.flatMap((region, index) =>
      region.wineries.flatMap((winery) =>
        winery.wineBoxes
          .filter((box) => box.name.toLowerCase().includes(term))
          .map((box) => ({
            ...box,
            wineryName: winery.name,
            regionName: region.name,
            regionIndex: index,
            imageUrl: `${process.env.PUBLIC_URL}/images/regions/${region.name}.png`,
            region,
          }))
      )
    );

    setFilteredRegions(matchedRegions);
    setFilteredBoxes(matchedBoxes);
    setHighlightIndex(-1); // reset highlight
  }, [searchTerm, regions]);

  // Handle outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
      }
    };
    if (searchOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [searchOpen]);

  const handleRegionClick = (region, index) => {
    setSearchOpen(false);
    setSearchTerm("");
    navigate(`/region/${index}`, { state: region });
    window.scrollTo(0, 0);
  };

  const handleBoxClick = (box) => {
    setSearchOpen(false);
    setSearchTerm("");
    navigate(`/region/${box.regionIndex}`, { state: box.region });
    window.scrollTo(0, 0);
  };

  const allResults = [
    ...filteredRegions.map((r) => ({ type: "region", data: r })),
    ...(filteredRegions.length > 0 && filteredBoxes.length > 0 ? [{ type: "divider" }] : []),
    ...filteredBoxes.map((b) => ({ type: "box", data: b })),
  ];

  const handleKeyDown = (e) => {
    if (allResults.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((prev) => Math.min(prev + 1, allResults.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter" && highlightIndex >= 0) {
      const item = allResults[highlightIndex];
      if (item.type === "region") handleRegionClick(item.data, regions.indexOf(item.data));
      if (item.type === "box") handleBoxClick(item.data);
    }
  };

  return (
    <nav className="navbar">
      {/* --- Mobile navbar --- */}
      <div className="navbar-mobile">
        <a className="icon-button" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
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
          <Link to="/kundvagn" className="icon-button cart-wrapper">
            <ShoppingCart size={24} color="black" />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>
        </div>
      </div>

      {/* --- Desktop navbar --- */}
      <div className="navbar-desktop">
        <Link to="/privat" className="navbar-logo">
          <img src={BaraVinLogo} alt="BaraVin" />
        </Link>

        <ul className="navbar-links">
          <li><Link to="/event">Kommande Vinmässor</Link></li>
          <li><Link to="/kontakt">Kontakt</Link></li>
          <li><Link to="/historia">Om Oss</Link></li>
          <li><Link to="/privat/instruktioner">Hur fungerar det?</Link></li>
          {isAdmin() && (
            <li><Link to="/admin/hem">Adminpanel</Link></li>
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
          <Link to="/kundvagn" className="icon-button cart-wrapper">
            <ShoppingCart size={24} color="black" />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>
        </div>
      </div>

       {/* Offcanvas menu mobile */}
       {menuOpen && (
        <div className="modal-overlay" onClick={() => setMenuOpen(false)}>
        <div ref={offcanvasRef} className="offcanvas" onClick={(e) => e.stopPropagation()}>
          <img className="offcanvas-logo" src={BaraVinLogo} alt="BaraVin" />
          <ul>
          <li onClick={() => setMenuOpen(false)}><Link to="/event">Kommande Vinmässor</Link></li>
            <li onClick={() => setMenuOpen(false)}><Link to="/kontakt">Kontakt</Link></li>
            <li onClick={() => setMenuOpen(false)}><Link to="/privat/instruktioner">Hur fungerar det?</Link></li>
            {isAdmin() && (
              <li onClick={() => setMenuOpen(false)}>
                <Link to="/admin/hem">Admin Panel</Link>
              </li>
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
        </div>
      )}


      {/* Search dropdown */}
      {searchOpen && (
        <div className="search-offcanvas" ref={searchRef}>
          <input
            type="text"
            placeholder="Sök region eller vinbox..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
            autoFocus
            onKeyDown={handleKeyDown}
          />

          {allResults.length > 0 && (
            <ul className="search-results">
              {allResults.map((item, i) => {
                if (item.type === "divider") return <hr key={`divider-${i}`} className="search-divider" />;
                const isActive = i === highlightIndex;

                if (item.type === "region") {
                  const region = item.data;
                  const index = regions.indexOf(region);
                  return (
                    <li
                      key={`region-${region.id}`}
                      className={`search-region-item ${isActive ? "active" : ""}`}
                      onClick={() => handleRegionClick(region, index)}
                    >
                      {region.name}
                    </li>
                  );
                }

                if (item.type === "box") {
                  const box = item.data;
                  return (
                    <li
                      key={`box-${box.id}`}
                      className={`search-box-item ${isActive ? "active" : ""}`}
                      onClick={() => handleBoxClick(box)}
                    >
                      <img src={box.imageUrl} alt={box.name} className="search-thumb" />
                      <div className="search-box-info">
                        <p className="box-name">{box.name}</p>
                        <p className="region-name">{box.regionName}</p>
                      </div>
                    </li>
                  );
                }
                return null;
              })}
            </ul>
          )}

          {searchTerm && allResults.length === 0 && (
            <p className="no-results">Inga träffar på "{searchTerm}".</p>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
