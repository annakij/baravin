import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import WhatsAppChat from "../components/WhatsAppChatt";

function PrivateLayout() {
  return (
    <>
      <Navbar />
        <Outlet />
        <WhatsAppChat />
      <Footer />
    </>
  );
}

export default PrivateLayout;
