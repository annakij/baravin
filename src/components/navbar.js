import "../index.css";
import logo from '../images/baravinlogo.avif';

function Navbar() {
  return (
    <header className="header">
    <img src={logo} className="App-logo" alt="logo" />
      <nav className="nav">
        <a href="/" className="nav-link">Handla Vin</a>
        <a href="/about" className="nav-link">Vår Historia</a>
        <a href="/contact" className="nav-link">Kontakt</a>
      </nav>
    </header>
  );
}

export default Navbar;
