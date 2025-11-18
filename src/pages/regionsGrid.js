import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NewsletterBanner from "../components/NewsletterBanner.js";
import api from "../api/axiosInstance.js";
import Loading from "../components/admin/Loading";
import "./RegionsGrid.css";

// Displays a grid of wine regions fetched from the backend API
function RegionsGridPage() {
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const res = await api.get("/regions"); // baseURL from axios + "/regions"
        setRegions(res.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRegions();
  }, []);

  if (loading) return <Loading />;
  if (error) return <p>Något gick fel: {error}</p>;

  return (
      <main className="main-content">
        <NewsletterBanner />
        <div className="regions-grid">
          {regions.map((region, index) => (
            <div
              key={index}
              className="region-card"
              onClick={() => navigate(`/region/${index}`, { state: region })}
            >
              <img
              src={`${process.env.PUBLIC_URL}/images/regions/${region?.name}.png`}
              alt={region?.name || "Valle"}
              onError={(e) => {
                e.currentTarget.src = `${process.env.PUBLIC_URL}/images/regions/Valle.png`;
              }}
            />

              <div className="region-content">
                <h2 className="region-title">{region.name}</h2>
                <p className="region-description">{region.description}</p>
                <a className="region-button">Utforska Vinboxar →</a>
              </div>
            </div>
          ))}
        </div>
      </main>
  );
}


export default RegionsGridPage;
