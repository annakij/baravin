import { useState, useEffect } from "react";
import { X } from "lucide-react";
import "./NewsletterBanner.css";

function NewsletterBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem("newsletterDismissed");
    if (!dismissed) {
      setTimeout(() => setVisible(true), 300);
    }
  }, []);

  const handleClose = () => {
    setVisible(false);
    sessionStorage.setItem("newsletterDismissed", "true");
  };

  if (!visible) return null;

  return (
    <div className="newsletter-banner">
      <div className="newsletter-content">
        <p>
          Vill du ha nyheter och exklusiva erbjudanden från oss?{" "}
          <strong>Prenumerera på vårt nyhetsbrev!</strong>
        </p>
        <form
          className="newsletter-form"
          onSubmit={(e) => {
            e.preventDefault();
            alert("Tack för din prenumeration!");
            handleClose();
          }}
        >
          <input type="email" placeholder="Din e-postadress" required />
          <button type="submit">Prenumerera</button>
        </form>
      <p className="sub">Genom att anmäla sig till vårt nyhetsbrev går du med på att få marknadsföringsutskick från oss. Läs mer i vår policy.</p>
      </div>

      <a className="banner-close-btn" onClick={handleClose}>
        <X size={20} />
      </a>
    </div>
  );
}

export default NewsletterBanner;
