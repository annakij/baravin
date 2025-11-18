import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import WhatsAppChat from "../components/WhatsAppChatt";
import { useState } from "react";

function PrivateLayout() {

const [cartCount, setCartCount] = useState(0);

  return (
    <>
      <Navbar cartCount={cartCount} />
      <div className="website-content">
        <Outlet context={{setCartCount}} />
        <WhatsAppChat />
      </div>
      <Footer />
    </>
  );
}

export default PrivateLayout;
