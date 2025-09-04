import './App.css';
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/authContext";
import RegionsGridPage from "./pages/regionsGrid";
import RegionPage from "./pages/regionPage";
import RestaurantPage from "./pages/hoReCaPage";
import AuthenticatePage from "./pages/authenticatePage";
import AdminPanel from "./pages/adminPanel";
import StartPage from './pages/startPage';
import UserPage from './pages/userPage';

function App() {
  return (
    <AuthProvider>
        <Routes>
          <Route path='/' element={<StartPage />} />
          <Route path="/privat" element={<RegionsGridPage />} />
          <Route path="/restaurang" element={<RestaurantPage />} />
          <Route path="/region/:id" element={<RegionPage />} />
          <Route path="/authenticate" element={<AuthenticatePage />} />
          <Route path="/authenticate/signin" element={<AuthenticatePage />} />
          <Route path="/authenticate/register" element={<AuthenticatePage />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/userpage" element={<UserPage />} />
        </Routes>
    </AuthProvider>
  );
}

export default App;
