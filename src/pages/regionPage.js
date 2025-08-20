import { useParams } from "react-router-dom";

function RegionPage() {
  const { id } = useParams();

  return (
    <div>
      <h1>Region {id}</h1>
      <p>Här kan du visa beskrivning och vinboxar för regionen.</p>
    </div>
  );
}

export default RegionPage;
