import './App.css';
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/authContext";
import RegionsGridPage from "./pages/RegionsGrid";
import RegionPage from "./pages/RegionPage";
import RestaurantPage from "./pages/HoReCaPage";
import AuthenticatePage from "./pages/AuthenticatePage";
import AdminPanel from "./pages/AdminPanel";
import StartPage from './pages/StartPage';
import UserPage from './pages/UserPage';
import ContactPage from './pages/ContactPage';
import InstructionsPage from './pages/InstructionsPage';
import PrivateLayout from './pages/PrivatePage';
import WinefairsPage from './pages/WinefairsPage';
import TermsConditions from './pages/TermsConditions';
import CookieBanner from './components/CookieBanner';

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
        </Route>

        {/* Pages without default navbar/ footer */}
        <Route path="/" element={<StartPage />} />
        <Route path="/restaurang" element={<RestaurantPage />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
      <CookieBanner />
    </AuthProvider>
  );
}

export default App;
