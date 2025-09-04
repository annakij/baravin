import "./TextPages.css";

function ContactPage() {
  return (
    <div className="contact-page">
      <h1>Kontakta oss</h1>
      <p>Om du har några frågor om leverans, vin, gårdar eller annat. Maila så återkommer vi så fort vi kan!</p>
        <p><strong>Email: </strong><a className="link" href="mailto:info@baravin.nu">info@baravin.nu</a></p>
        
        <div className="contact-address">
        <p>Vino Italiano di P.B.J </p>
        <p>PLMBRN80B20Z132F</p>
        <p>Alba (CN) Piazza Garibaldi 3 CAP 12051</p>
        </div>
    </div>
  );
}

export default ContactPage;

