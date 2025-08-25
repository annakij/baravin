import { useLocation } from "react-router-dom";
import mockImg from '../images/Abruzzo.png';
import './regionPage.css';

function RegionDetailPage() {
  const location = useLocation();
  const region = location.state;

  if (!region) {
    return <p>Ingen region hittades</p>;
  }

  return (
    <div className="region-detail">
      <h1>{region.name}</h1>
      <p>{region.description}</p>

      {region.wineries?.map((winery, wIndex) => (
        <div key={wIndex} className="winery-section">
          <h2>{winery.name}</h2>

          {winery.wineBoxes?.map((box, bIndex) => (
            <div key={bIndex}>
              <h3>{box.name} - {box.description} ({box.price} kr)</h3>
              <div className="wineboxes-container">
                {box.bottles?.map((bottle, index) => (
                  <div key={index} className="winebox-card">
                    <div className="winebox-image">
                      <img
                        src={mockImg}
                        alt={bottle.title}
                      />
                    </div>
                    <div className="winebox-content">
                      <h4>{bottle.title} ({bottle.year})</h4>
                      <p><strong>Druvor:</strong> {bottle.grape}</p>
                      <p><strong>Område:</strong> {bottle.area}</p>
                      <p><strong>Alkohol:</strong> {bottle.alcohol}</p>
                      <p><strong>Vinframställning:</strong> {bottle.wineMaking}</p>
                      <p>{bottle.description}</p>
                      <p><strong>Antal flaskor:</strong> {bottle.count}</p>
                      <button className="add-to-cart-btn">Lägg till i kundvagn</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default RegionDetailPage;
