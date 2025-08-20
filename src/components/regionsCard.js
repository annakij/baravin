import fakeData from "../data/fulldata.json";
import "../index.css";


function RegionsCard() {
    return (
    <div className="card">
        {/* <img src={region.image} alt={region.name} vart hämtas alla bilder? också databas?/> */}
        {fakeData.map((region) => (
            <div key={region.name}>
            <h2>{region.name}</h2>
            </div>
      ))}
    </div>
    )}

export default RegionsCard;
