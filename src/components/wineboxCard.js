import useLocation from "react-router-dom";
import "./WineboxCard.css";

function WineboxCard({ product, addToCart }) {
    return (
      <div className="card">
      {fakeData.map((region) => (
        <div key={region.id}>
          <h2>{region.name}</h2>
          <p>{region.description}</p>

          {region.wineBoxes && region.wineBoxes.map((box) => (
            <div key={box.id} className="winebox">
              <h3>{box.name}</h3>
              <p>{box.description}</p>

              {/* Vart hämtas bilder? lagrade i databas? */}
              <img src={box.image} alt={box.name} />
              <button onClick={() => addToCart(box)}>Lägg i varukorgen</button>
            </div>
          ))}
        </div>
      ))}
    </div>

    )}

export default WineboxCard;