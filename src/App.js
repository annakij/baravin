import './App.css';
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/authContext";
import RegionsGridPage from "./pages/RegionsGrid";
import RegionPage from "./pages/RegionPage";
import RestaurantPage from "./pages/HoReCaPage";
import AuthenticatePage from "./pages/AuthenticatePage";
import StartPage from './pages/StartPage';
import UserPage from './pages/UserPage';
import ContactPage from './pages/ContactPage';
import InstructionsPage from './pages/InstructionsPage';
import PrivateLayout from './pages/PrivatePage';
import WinefairsPage from './pages/WinefairsPage';
import TermsConditions from './pages/TermsConditions';
import CookieBanner from './components/CookieBanner';
import Cart from './components/Cart';
import AdminLayout from './components/admin/AdminLayout';
import AdminPanel from './pages/admin/AdminPanel';
import Checkout from './components/Checkout';
import Orders from './pages/admin/Orders';
import Products from './pages/admin/Products';
import Customers from './pages/admin/Customers';
import Reports from './pages/admin/Statistics';
import Discounts from './pages/admin/Discounts';
import Shipping from './pages/admin/Shipping';

function App() {
  
  return (
    <AuthProvider>
        <Routes>
        {/* All pages within the private section */}
        <Route element={<PrivateLayout />}>
          <Route path="/privat" element={<RegionsGridPage />} />
          <Route path="/privat/instruktioner" element={<InstructionsPage />} />
          <Route path="/event" element={<WinefairsPage />} />
          <Route path="/kontakt" element={<ContactPage />} />
          <Route path="/villkor" element={<TermsConditions />} />
          <Route path="/anvandarsida" element={<UserPage />} />
          <Route path="/region/:id" element={<RegionPage />} />
          <Route path="/authenticate" element={<AuthenticatePage />} />
          <Route path="/authenticate/loggain" element={<AuthenticatePage />} />
          <Route path="/authenticate/registrera" element={<AuthenticatePage />} />
          <Route path="/kundvagn" element={<Cart />} />
          <Route path="/kassa" element={<Checkout />} />
        </Route>

        {/* Pages without default navbar/ footer */}
        <Route path="/" element={<StartPage />} />
        <Route path="/restaurang" element={<RestaurantPage />} />
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/admin/ordrar" element={<Orders />} />
          <Route path="/admin/produkter" element={<Products />} />
          <Route path="/admin/kunder" element={<Customers />} />
          <Route path="/admin/rapporter" element={<Reports />} />
          <Route path="/admin/rabatter" element={<Discounts />} />
          <Route path="/admin/frakthantering" element={<Shipping />} />
        </Route>
      </Routes>
      <CookieBanner />
    </AuthProvider>
  );
}

export default App;
