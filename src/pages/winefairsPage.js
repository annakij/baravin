import { useState, useEffect } from "react";
import { MapPin, Calendar } from "lucide-react";
import "./WineFairsPage.css";
import Loading from "../components/admin/Loading";

function WinefairsPage() {
  const [fairs, setFairs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // --- MOCKDATA (tas bort när backend är klar) ---
    const mockFairs = [
      {
        id: 1,
        title: "Stockholm Wine Expo",
        place: "Stockholm Waterfront",
        description:
          "En helg fylld med vinprovningar från världens alla hörn.",
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

    setTimeout(() => {
      setFairs(mockFairs);
      setLoading(false);
    }, 300);

    // --- Framtida API-anrop ---
    /*
    const fetchFairs = async () => {
      try {
        const res = await api.get("/winefairs/upcoming-events");
        setFairs(res.data || []);
      } catch (err) {
        console.error(err);
        setError("Kunde inte hämta vinmässor just nu");
      } finally {
        setLoading(false);
      }
    };
    fetchFairs();
    */
  }, []);

  if (loading) return <Loading/>;
  if (error) return <p>{error}</p>;

  return (
    <div className="winefairs-page">
      <header className="winefairs-header">
        <h1>Kommande Vinmässor</h1>
        <p>
          Kom och träffa oss på olika mässor – upptäck nya smaker,
          gårdar, trender inom vinvärlden eller bara kom förbi för gott vin tugg!
        </p>
      </header>

      {fairs.length === 0 ? (
        <p className="empty">Inga planerade vinmässor just nu.</p>
      ) : (
        <div className="winefairs-grid">
          {fairs.map((fair) => (
            <div key={fair.id} className="winefair-card">
              <div className="winefair-info">
                <h3 className="winefair-title">{fair.title}</h3>
                <p className="winefair-place">
                  <MapPin/> <strong>{fair.place}</strong>
                </p>
                <p className="winefair-date">
                  <Calendar/>{" "}
                  {new Date(fair.dateStart).toLocaleDateString("sv-SE", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                  {fair.dateEnd &&
                    ` – ${new Date(fair.dateEnd).toLocaleDateString("sv-SE", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}`}
                </p>
                <p className="winefair-description">{fair.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default WinefairsPage;
