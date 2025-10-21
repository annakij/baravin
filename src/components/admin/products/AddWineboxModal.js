import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import api from "../../../api/axiosInstance";
import "./Modals.css";

function AddWineboxModal({ onClose, onSaved, regions }) {
  const [wineries, setWineries] = useState([]);
  const [bottles, setBottles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [winebox, setWinebox] = useState({
    name: "",
    description: "",
    price: 0,
    availableQuantity: 99,
    wineryId: "",
    bottles: [],
  });

  useEffect(() => {
    if (regions?.length) {
      const allWineries = regions.flatMap((region, regionIndex) =>
        (region.wineries || []).map((winery, wineryIndex) => ({
          ...winery,
          regionName: region.name,
          uniqueKey: `${regionIndex}-${wineryIndex}-${winery.id}`
        }))
      );
      setWineries(allWineries);
    }
  }, [regions]);

  useEffect(() => {
    const fetchBottles = async () => {
      try {
        const res = await api.get("/wineboxes/bottles");
        setBottles(res.data || []);
      } catch (e) {
        console.error("Kunde inte hämta flaskor", e);
      }
    };
    fetchBottles();
  }, []);

  const updateBottle = (idx, patch) => {
    setWinebox((prev) => {
      const updated = [...prev.bottles];
      updated[idx] = { ...updated[idx], ...patch };
      return { ...prev, bottles: updated };
    });
  };

  const addBottle = () => {
    setWinebox((prev) => ({
      ...prev,
      bottles: [
        ...prev.bottles,
        {
          tempId: "",
          title: "",
          year: new Date().getFullYear(),
          area: "",
          grape: "",
          alcohol: "",
          wineMaking: "",
          description: "",
          count: 1,
        },
      ],
    }));
  };

  const removeBottle = (index) => {
    setWinebox((prev) => ({
      ...prev,
      bottles: prev.bottles.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async () => {
    // Validate winery selection
    if (!winebox.wineryId) {
      setError("Du måste välja en vingård.");
      return;
    }

    // Validate required fields
    if (!winebox.name?.trim()) {
      setError("Namnet är obligatoriskt.");
      return;
    }
    if (!winebox.description?.trim()) {
      setError("Beskrivningen är obligatoriskt.");
      return;
    }

    // Validate price
    if (isNaN(parseFloat(winebox.price)) || parseFloat(winebox.price) <= 0) {
      setError("Priset måste vara större än 0.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const payload = {
        name: winebox.name.trim(),
        description: winebox.description.trim(),
        price: parseFloat(winebox.price),
        availableQuantity: parseInt(winebox.availableQuantity) || 0,
        bottles: winebox.bottles.map(bottle => ({
          ...bottle,
          count: parseInt(bottle.count) || 1
        }))
      };

      const res = await api.post(`/wineboxes/${winebox.wineryId}`, payload);
      onSaved?.(res.data);
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Kunde inte skapa vinbox.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>Lägg till ny vinbox</h2>
        <p>* fält är obligatoriska</p>
        <label>Välj vingård* </label>
        <select
          value={winebox.wineryId || ""}
          onChange={(e) => {
            const selectedId = e.target.value;
            setWinebox((prev) => ({
              ...prev,
              wineryId: selectedId,
              name: "", 
              description: ""
            }));
          }}
        >
          <option value="">Välj vingård...</option>
          {wineries.map((winery) => (
            <option 
              key={winery.uniqueKey} 
              value={winery.id}
            >
              {winery.name} ({winery.regionName})
            </option>
          ))}
        </select>

        <label>
          Namn*
          <input
            type="text"
            value={winebox.name}
            onChange={(e) => setWinebox({ ...winebox, name: e.target.value })}
          />
        </label>

        <label>
          Beskrivning (innehållande flaskor)*
          <textarea
            value={winebox.description}
            onChange={(e) =>
              setWinebox({ ...winebox, description: e.target.value })
            }
          />
        </label>

        <label>
          Pris (kr)
          <input
            type="number"
            value={winebox.price}
            onChange={(e) => setWinebox({ ...winebox, price: e.target.value })}
          />
        </label>

        <label>
          Lagerantal
          <input
            type="number"
            value={winebox.availableQuantity}
            onChange={(e) =>
              setWinebox({ ...winebox, availableQuantity: e.target.value })
            }
          />
        </label>

        {/* Bottles */}
        <h3>Flaskor i boxen</h3>
        {winebox.bottles.map((bottle, idx) => (
          <div
            key={bottle.id || bottle.tempId || idx}
            className="modal-bottle-card"
          >
            <label>Välj existerande flaska:</label>
            <select
              value={bottle.id || ""}
              onChange={(e) => {
                const selectedId = Number(e.target.value);
                if (!selectedId) {
                  updateBottle(idx, {
                    id: undefined,
                    title: "",
                    year: new Date().getFullYear(),
                    area: "",
                    grape: "",
                    alcohol: "",
                    wineMaking: "",
                    description: "",
                    count: 1,
                  });
                } else {
                  const existing = bottles.find((b) => b.id === selectedId);
                  if (existing) updateBottle(idx, { ...existing, count: 1 });
                }
              }}
            >
              <option value="">Skapa ny flaska</option>
              {bottles.map((b) => (
                <option key={`opt-${b.id}`} value={b.id}>
                  {b.title} ({b.year})
                </option>
              ))}
            </select>

            <label>Titel*</label>
            <input
              type="text"
              value={bottle.title}
              onChange={(e) => updateBottle(idx, { title: e.target.value })}
              disabled={bottle.id > 0}
            />

            <label>År</label>
            <input
              type="number"
              value={bottle.year}
              onChange={(e) => updateBottle(idx, { year: e.target.value })}
              disabled={bottle.id > 0}
            />

            <label>Område*</label>
            <input
              type="text"
              value={bottle.area}
              onChange={(e) => updateBottle(idx, { area: e.target.value })}
              disabled={bottle.id > 0}
            />

            <label>Druva*</label>
            <input
              type="text"
              value={bottle.grape}
              onChange={(e) => updateBottle(idx, { grape: e.target.value })}
              disabled={bottle.id > 0}
            />

            <label>Alkohol*</label>
            <input
              type="text"
              value={bottle.alcohol}
              onChange={(e) => updateBottle(idx, { alcohol: e.target.value })}
              disabled={bottle.id > 0}
            />

            <label>Tillverkning*</label>
            <input
              type="text"
              value={bottle.wineMaking}
              onChange={(e) =>
                updateBottle(idx, { wineMaking: e.target.value })
              }
              disabled={bottle.id > 0}
            />

            <label>Beskrivning*</label>
            <textarea
              value={bottle.description}
              onChange={(e) =>
                updateBottle(idx, { description: e.target.value })
              }
              disabled={bottle.id > 0}
            />

            <label>Antal</label>
            <input
              type="number"
              value={bottle.count}
              onChange={(e) => updateBottle(idx, { count: e.target.value })}
            />

            <button className="btn-danger" onClick={() => removeBottle(idx)}>
              Ta bort flaska
            </button>
          </div>
        ))}

        <hr />
        <button className="icon-modal-button" onClick={addBottle}>
          <Plus /> Flaska
        </button>
        <hr />

        {error && <p style={{ color: "red" }}>{error}</p>}

        <div className="modal-actions">
          <button onClick={onClose}>Avbryt</button>
          <button onClick={handleSave} className="btn-primary" disabled={loading}>
            {loading ? "Sparar..." : "Spara vinbox"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddWineboxModal;
