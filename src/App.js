import './App.css';
import { Routes, Route, Router } from "react-router-dom";
import RegionsGridPage from "./pages/regionsGrid";
import RegionPage from "./pages/regionPage";
import RestaurantPage from "./pages/hoReCaPage";
import StartPage from './pages/startPage';

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<StartPage />} />
        <Route path="/privat" element={<RegionsGridPage />} />
        <Route path="/restaurang" element={<RestaurantPage />} />
        <Route path="/region/:id" element={<RegionPage />} />
      </Routes>
  </>
  );
}

export default App;
