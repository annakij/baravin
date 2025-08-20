import './App.css';
import { Routes, Route } from "react-router-dom";
import RegionsGridPage from "./pages/regionsGrid";
import RegionPage from "./pages/regionPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<RegionsGridPage />} />
      <Route path="/region/:id" element={<RegionPage />} />
    </Routes>
  );
}

export default App;
