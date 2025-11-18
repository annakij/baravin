import { useEffect, useState } from "react";
import "./CookieBanner.css";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const choice = localStorage.getItem("cookieConsent");
    if (!choice) {
      setVisible(true);
    }
  }, []);

  const handleConsent = (consent) => {
    localStorage.setItem("cookieConsent", consent);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="cookie-banner">
      <p>Vi använder cookies för att förbättra din upplevelse.</p>
      <div className="cookie-buttons">
        <button onClick={() => handleConsent("all")}>Tillåt cookies</button>
        <button onClick={() => handleConsent("necessary")}>
          Tillåt endast nödvändiga
        </button>
      </div>
    </div>
  );
}
