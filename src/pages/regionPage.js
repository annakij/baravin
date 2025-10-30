import { useLocation, useOutletContext, useParams } from "react-router-dom";
import { useAuth } from "../context/authContext";
import api from "../api/axiosInstance";
import { useEffect, useState } from "react";
import { ShoppingCart } from "lucide-react";
import Loading from "../components/admin/Loading";
import "./RegionPage.css";

function RegionDetailPage() {
  const { setCartCount } = useOutletContext();
  const location = useLocation();
  const { id } = useParams();
  const { user } = useAuth();
  const [region, setRegion] = useState(location.state || null);
  const [selectedBox, setSelectedBox] = useState(null);
  const [loading, setLoading] = useState(!location.state);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (location.state) {
      setRegion(location.state);
      setLoading(false);
      return;
    }

    const fetchRegion = async () => {
      try {
        setLoading(true);
        const res = await api.get("/regions");
        const regions = res.data || [];
        const found = regions[parseInt(id)];
        setRegion(found || null);
      } catch (err) {
        setError("Kunde inte hämta region.");
      } finally {
        setLoading(false);
      }
    };

    fetchRegion();
  }, [location.state, id]);

  const handleAddToCart = async (boxId) => {
    if (!user) {
      alert("Du måste vara inloggad för att lägga till produkter");
      return;
    }
    try {
      await api.put(`/cart?boxId=${boxId}`);
      setCartCount(prev => prev + 1);
    } catch (err) {
      console.error(err);
      setCartCount(prev => prev + 1);
    }
  };

  if (loading) return <Loading />;
  if (error) return <p>Något gick fel: {error}</p>;
  if (!region) return <p>Ingen region hittades</p>;

  const allWineBoxes = region.wineries?.flatMap(winery =>
    winery.wineBoxes?.map(box => ({ ...box, wineryName: winery.name })) || []
  ) || [];

  return (
    <div className="region-details">
      <h1>{region.name}</h1>
      <p>{region.description}</p>

      <div className="winery-section">
        <div className="wineboxes-container">
          {allWineBoxes.map((box, index) => (
            <div key={index} className="winebox-card">
              <div className="winebox-image">
                <img
                  src={`/images/regions/${region.name}.png`}
                  alt={region.name}
                />
              </div>
              <div className="winebox-content">
                <div className="winebox-info">
                  <h3>{box.name}</h3>
                  <p>{box.description}</p>
                  <p><strong>Pris:</strong> {box.price} kr</p>
                </div>
                <div className="winebox-buttons">
                  <button onClick={() => setSelectedBox(box)}>Detaljer</button>
                  <button onClick={() => handleAddToCart(box.id)}>
                    <ShoppingCart />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 🪟 Modal */}
      {selectedBox && (
        <div className="modal-overlay" onClick={() => setSelectedBox(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedBox.name}</h2>
            <h3>Innehåll:</h3>
            {selectedBox.bottles.map((bottle, index) => (
              <div key={index} className="bottle-card">
                <h4>{bottle.title} ({bottle.year})</h4>
                <p><strong>Druvor:</strong> {bottle.grape}</p>
                <p><strong>Område:</strong> {bottle.area}</p>
                <p><strong>Alkohol:</strong> {bottle.alcohol}</p>
                <p><strong>Vinframställning:</strong> {bottle.wineMaking}</p>
                <p><strong>Beskrivning:</strong> {bottle.description}</p>
                <p><strong>Antal flaskor:</strong> {bottle.count}</p>
              </div>
            ))}
            <button onClick={() => setSelectedBox(null)}>Stäng</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default RegionDetailPage;
