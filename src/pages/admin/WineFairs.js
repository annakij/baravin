import { useState, useEffect } from "react";
import "./WineFairs.css";

function WineFairs() {
  const [fairs, setFairs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // MOCKDATA istället för API
    const mockFairs = [
      {
        id: 1,
        title: "Stockholm Wine Expo",
        place: "Stockholm Waterfront",
        description: "En helg fylld med vinprovningar från världens alla hörn.",
        dateStart: "2025-11-10T00:00:00",
        dateEnd: "2025-11-12T00:00:00",
      },
      {
        id: 2,
        title: "Göteborg Vinmässa",
        place: "Svenska Mässan, Göteborg",
        description: "Mingla bland utställare och upptäck nya favoriter.",
        dateStart: "2025-12-05T00:00:00",
        dateEnd: null,
      },
      {
        id: 3,
        title: "Malmö Wine Festival",
        place: "Malmö Arena",
        description: "Fokus på ekologiska och biodynamiska viner.",
        dateStart: "2026-01-20T00:00:00",
        dateEnd: "2026-01-21T00:00:00",
      },
    ];

    // simulera laddning
    setTimeout(() => {
      setFairs(mockFairs);
      setLoading(false);
    }, 500);

    // Om du vill aktivera API igen senare:
    /*
    const fetchFairs = async () => {
      try {
        const res = await api.get("/winefairs");
        setFairs(res.data || []);
      } catch (err) {
        console.error(err);
        setError("Kunde inte hämta vinmässor");
      } finally {
        setLoading(false);
      }
    };
    fetchFairs();
    */
  }, []);

  if (loading) return <p>Laddar vinmässor...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="winefairs-container">
      <h1>Vinmässor</h1>

      {/* Kalender-lik display */}
      <div className="calendar-view">
        {fairs.length === 0 ? (
          <p>Inga inplanerade mässor</p>
        ) : (
          fairs.map((fair) => (
            <div key={fair.id} className="calendar-event">
              <span className="calendar-date">
                {new Date(fair.dateStart).toLocaleDateString()}
                {fair.dateEnd &&
                  ` – ${new Date(fair.dateEnd).toLocaleDateString()}`}
              </span>
              <span className="calendar-title">{fair.title}</span>
            </div>
          ))
        )}
      </div>

      {/* Lista med kort */}
      <div className="winefair-list">
        {fairs.map((fair) => (
          <div key={fair.id} className="winefair-card">
            <h3 className="winefair-title">{fair.title}</h3>
            <p className="winefair-place">
              <strong>Plats:</strong> {fair.place}
            </p>
            <p className="winefair-date">
              <strong>Datum:</strong>{" "}
              {new Date(fair.dateStart).toLocaleDateString()}{" "}
              {fair.dateEnd &&
                `– ${new Date(fair.dateEnd).toLocaleDateString()}`}
            </p>
            <p className="winefair-description">{fair.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WineFairs;
