import "./footer.css";
import { FaFacebook, FaInstagram } from "react-icons/fa";

function Footer() {
  return (
    <footer className="footer">
      <ul className="footer-links">
        <li>
          <a className="footer-link" href="#">Villkor</a>
        </li>
        <li>
          <a
            className="footer-link"
            href="mailto:info@baravin.nu"
            target="_blank"
            rel="noopener noreferrer"
          >
            info@baravin.se
          </a>
        </li>
      </ul>

      <div className="footer-icons">
        <a
          className="footer-icon"
          href="https://www.instagram.com/baravin.nu"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaInstagram size={40} />
        </a>
        <a
          className="footer-icon"
          href="https://www.facebook.com/baravin.nu"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaFacebook size={40} />
        </a>
      </div>

      <p className="footer-copy">
        &copy; 2025, Bara Vin AB – all rights reserved.
      </p>
    </footer>
  );
}

export default Footer;
