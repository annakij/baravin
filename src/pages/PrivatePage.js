import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function PrivateLayout() {
  return (
    <>
      <Navbar />
        <Outlet />
      <Footer />
    </>
  );
}

export default PrivateLayout;
