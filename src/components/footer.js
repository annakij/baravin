import "../index.css";

function Footer() {
  return (
    <footer className="footer">
      <ul>
        <li>
          <a href="#">Villkor</a>
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

        <li>
          <a
            className="footer-link"
            href="https://www.instagram.com/baravin.nu"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="icons/instagram-square.svg"
              alt="Instagram Logo"
              className="icon"
            />
          </a>
          <a
            className="footer-link"
            href="https://www.facebook.com/baravin.nu"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="icons/facebook-square.svg"
              alt="Facebook Logo"
              className="icon"
            />
          </a>
        </li>
      </ul>

      <p>
        &copy; 2025, Bara Vin AB – all rights reserved.
      </p>
    </footer>
  );
}

export default Footer;