import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";

function RegionsGridPage() {
  const [regions, setRegions] = useState([]); // alltid en array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetch("/fulldata.json")
      .then((res) => res.json())
      .then((data) => {
        console.log("DATA från JSON:", data);
        setRegions(data.regions || [])
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Laddar...</p>;
  if (error) return <p>Något gick fel: {error}</p>;

  return (
    <div className="grid grid-cols-4 gap-3 p-4">
      {regions.map((region, index) => (
        <div
          key={index}
          className="cursor-pointer border rounded-lg p-4 hover:shadow-md transition"
          onClick={() => navigate(`/region/${index}`)}
        >
          <h2 className="text-lg font-bold">{region.name}</h2>
          <p className="text-sm">{region.description}</p>
        </div>
      ))}
    </div>
  );
}

export default RegionsGridPage;
