import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import abruzzoImg from "../images/Abruzzo.png";
import Footer from "../components/footer.js";
import Navbar from "../components/navbar.js";
import "./regionsGrid.css";


function RegionsGridPage() {
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetch(process.env.PUBLIC_URL + '/fulldata.json')
      .then((res) => res.json())
      .then((data) => setRegions(data || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Laddar...</p>;
  if (error) return <p>Något gick fel: {error}</p>;

  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <div className="regions-grid">
          {regions.map((region, index) => (
            <div
              key={index}
              className="region-card"
              onClick={() => navigate(`/region/${index}`, { state: region })}
            >
              <img src={abruzzoImg} alt={region.name} />
              <div className="region-content">
                <h2 className="region-title">{region.name}</h2>
                <p className="region-description">{region.description}</p>
                <a className="region-button">Explore Wineboxes →</a>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}


export default RegionsGridPage;
