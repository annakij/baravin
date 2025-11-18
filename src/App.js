import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/authContext";
import { ProtectedRoute } from './components/ProtectedRoute';
import RegionsGridPage from "./pages/RegionsGrid.js";
import RegionPage from "./pages/RegionPage.js";
import RestaurantPage from "./pages/HoReCaPage.js";
import AuthenticatePage from "./pages/AuthenticatePage.js";
import StartPage from './pages/StartPage.js';
import UserPage from './pages/UserPage.js';
import ContactPage from './pages/ContactPage';
import InstructionsPage from './pages/InstructionsPage';
import PrivateLayout from './pages/PrivatePage.js';
import WinefairsPage from './pages/WinefairsPage.js';
import TermsConditions from './pages/TermsConditions';
import CookieBanner from './components/CookieBanner';
import Cart from './components/Cart';
import AdminLayout from './components/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import Checkout from './components/Checkout';
import Orders from './pages/admin/Orders';
import Products from './pages/admin/Products';
import Customers from './pages/admin/Customers';
import Reports from './pages/admin/Reports';
import Discounts from './pages/admin/Discounts';
import Shipping from './pages/admin/Shipping';
import WineFairs from './pages/admin/WineFairs';
import MailManagement from './pages/admin/MailManagement.js';
import RequestResetPassword from "./components/RequestResetPassword.js";
import ResetPassword from "./components/ResetPassword.js";
import About from "./pages/About.js";

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
          <Route path="/historia" element={<About />} />
          <Route path="/villkor" element={<TermsConditions />} />
          <Route path="/anvandarsida" element={<UserPage />} />
          <Route path="/region/:id" element={<RegionPage />} />
          <Route path="/authenticate" element={<AuthenticatePage />} />
          <Route path="/authenticate/loggain" element={<AuthenticatePage />} />
          <Route path="/authenticate/registrera" element={<AuthenticatePage />} />
          <Route path="/authenticate/request-reset" element={<RequestResetPassword />} />
          <Route path="/authenticate/reset-password" element={<ResetPassword />} />
          <Route path="/kundvagn" element={<Cart />} />
          <Route path="/kassa" element={<Checkout />} />
        </Route>

        {/* Pages without default navbar/ footer */}
        <Route path="/" element={<StartPage />} />
        <Route path="/restaurang" element={<RestaurantPage />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute requireAdmin>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/hem" replace />} />
          <Route path="hem" element={<Dashboard />} />
          <Route path="ordrar" element={<Orders />} />
          <Route path="produkter" element={<Products />} />
          <Route path="kunder" element={<Customers />} />
          <Route path="rapporter" element={<Reports />} />
          <Route path="rabatter" element={<Discounts />} />
          <Route path="frakthantering" element={<Shipping />} />
          <Route path="vinmassor" element={<WineFairs />} />
          <Route path="nyhetsbrev" element={<MailManagement />} />
          <Route path="*" element={<Navigate to="/privat" replace />} />
        </Route>

        {/* Catch all unmatched routes */}
        <Route path="*" element={<Navigate to="/privat" replace />} />
      </Routes>
      <CookieBanner />
    </AuthProvider>
  );
}

export default App;
