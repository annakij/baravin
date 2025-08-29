import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import mockImg from "../images/regions/Abruzzo.png";
import {ShoppingCart} from "lucide-react";
import Footer from "../components/footer.js";
import Navbar from "../components/navbar.js";
import "./regionPage.css";

function RegionDetailPage() {
  const location = useLocation();
  const regionFromState = location.state;
  const [region, setRegion] = useState(regionFromState || null);
  const [selectedBox, setSelectedBox] = useState(null);
  const [loading, setLoading] = useState(!regionFromState);
  const [error, setError] = useState(null);

  useEffect(() => {
    // hämta från API om region inte redan skickades via state
    if (!regionFromState) {
      const fetchRegion = async () => {
        try {
          setLoading(true);
          const res = await fetch(); 
          if (!res.ok) throw new Error("Kunde inte hämta region");
          const data = await res.json();
          setRegion(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchRegion();
    }
  }, [regionFromState, location.pathname]);

  if (loading) return <p>Laddar region...</p>;
  if (error) return <p>Något gick fel: {error}</p>;
  if (!region) return <p>Ingen region hittades</p>;

  const allWineBoxes = region.wineries?.flatMap(winery =>
    winery.wineBoxes?.map(box => ({ ...box, wineryName: winery.name })) || []
  ) || [];

  return (
    <>
    <Navbar/>
    <div className="region-detail">
      <h1>{region.name}</h1>
      <p>{region.description}</p>

      {region.wineries?.map((winery, wIndex) => (
        <div key={wIndex} className="winery-section">

        <div className="wineboxes-container">
          {allWineBoxes.map((box, index) => (
            <div key={index} className="winebox-card">
              <div className="winebox-image">
              <img 
                src={`${process.env.PUBLIC_URL}/images/regions/${region.name}.png`} 
                alt={region.name} 
              />
              </div>
              <div className="winebox-content">
                <h3>{box.name}</h3>
                <p>{box.description}</p>
                <p><strong>Pris:</strong> {box.price} kr</p>
                <p><em>Från: {box.wineryName}</em></p>
                <div className="winebox-buttons">
                  <button onClick={() => setSelectedBox(box)}>Detaljer</button>
                  <button><ShoppingCart /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
        </div>
      ))}

      {/* MODAL VINBOX DETALJER */}
      {selectedBox && (
        <div className="modal-overlay" onClick={() => setSelectedBox(null)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>{selectedBox.name}</h2>

            <h3>Innehåll:</h3>
            {selectedBox.bottles.map((bottle, i) => (
              <div key={i} className="bottle-card">
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
    <Footer/>
    </>
  );
}

export default RegionDetailPage;
