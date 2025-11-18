import { Minus, Plus } from "lucide-react";
import "./Modals.css";
import { useState, useEffect } from "react";
import api from "../../../api/axiosInstance";

function BoxModal({ box, onClose, onSaved, onDeleted }) {
  const [draft, setDraft] = useState({
    id: box.id,
    name: box.name || "",
    description: box.description || "",
    price: box.price || 0,
    availableQuantity: box.availableQuantity ?? 0,
    bottles: (box.bottles || []).map(b => ({ ...b })) // kopia
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [allBottles, setAllBottles] = useState([]);

  useEffect(() => {
    const fetchBottles = async () => {
      try {
        const res = await api.get("/wineboxes/bottles");
        setAllBottles(res.data || []);
      } catch (e) {
        console.error("Kunde inte hämta flaskor", e);
      }
    };
    fetchBottles();
  }, []);

  if (!box) return null;

  const updateBottle = (idx, patch) => {
    setDraft(d => {
      const next = [...d.bottles];
      next[idx] = { ...next[idx], ...patch };
      return { ...d, bottles: next };
    });
  };


  const removeBottle = (idx) => {
    setDraft(d => ({ ...d, bottles: d.bottles.filter((_, i) => i !== idx) }));
  };

  const addBottle = () => {
    setDraft(d => ({
      ...d,
      bottles: [
        ...d.bottles,
        { id: 0, title: "", year: new Date().getFullYear(), area: "", grape: "", alcohol: "", wineMaking: "", description: "", count: 1 }
      ]
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);

      // build payload as WineBoxModel
      const payload = {
        name: draft.name,
        description: draft.description,
        price: Number(draft.price),
        availableQuantity: Number(draft.availableQuantity),
        bottles: draft.bottles.map(b => ({
          id: b.id,
          title: b.title,
          area: b.area,
          grape: b.grape,
          year: Number(b.year),
          alcohol: b.alcohol,
          wineMaking: b.wineMaking,
          description: b.description,
          count: Number(b.count) || 1
        }))
      };
      const res = await api.put(`/wineboxes/${draft.id}`, payload);
      onSaved?.(res.data);
    } catch (e) {
      setError(e.response?.data || "Kunde inte spara vinboxen.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    // if (!confirm(`Ta bort box "${draft.name}"? Detta kan inte ångras.`)) return;
    try {
      setSaving(true);
      await api.delete(`/wineboxes/${draft.id}`);
      onDeleted?.(draft.id);
    } catch (e) {
      setError(e.response?.data || "Kunde inte ta bort vinboxen.");
      setSaving(false);
    }
  };

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>Redigera vinbox</h2>
        <p>* fält är obligatoriska</p>

        <label>Namn*</label>
        <input type="text" value={draft.name} onChange={e => setDraft(d => ({ ...d, name: e.target.value }))} />

        <label>Beskrivning*</label>
        <textarea value={draft.description} onChange={e => setDraft(d => ({ ...d, description: e.target.value }))} />

        <label>Pris (kr)</label>
        <input type="number" value={draft.price} onChange={e => setDraft(d => ({ ...d, price: e.target.value }))} />

        <label>Lager</label>
        <input type="number" value={draft.availableQuantity} onChange={e => setDraft(d => ({ ...d, availableQuantity: e.target.value }))} />

        <h3>Flaskor i boxen</h3>
        <div className="modal-bottles-grid">
          {draft.bottles.map((bottle, idx) => (
            <div key={`${bottle.id}-${idx}`} className="modal-bottle-card">
              <h4>{bottle.title || "Ny flaska"}</h4>

              {/* --- Dropdown för att välja existerande flaska --- */}
              <label>Välj existerande flaska:</label>
              <select
                value={bottle.id || ""}
                onChange={(e) => {
                  const selectedId = Number(e.target.value);
                  if (!selectedId) {
                    updateBottle(idx, {
                      id: 0,
                      title: "",
                      year: new Date().getFullYear(),
                      area: "",
                      grape: "",
                      alcohol: "",
                      wineMaking: "",
                      description: "",
                      count: 1
                    });
                  } else {
                    // Hämta vald flaska och förifyll
                    const existing = allBottles.find(b => b.id === selectedId);
                    if (existing) {
                      updateBottle(idx, { ...existing, count: 1 });
                    }
                  }
                }}
              >
                <option value="">+ Skapa ny flaska</option>
                {allBottles.map(b => (
                  <option key={b.id} value={b.id}>
                    {b.title} ({b.year})
                  </option>
                ))}
              </select>

              <label>Titel*</label>
              <input type="text" value={bottle.title} onChange={e => updateBottle(idx, { title: e.target.value })} />

              <label>År</label>
              <input type="number" value={bottle.year} onChange={e => updateBottle(idx, { year: e.target.value })} />

              <label>Område*</label>
              <input type="text" value={bottle.area} onChange={e => updateBottle(idx, { area: e.target.value })} />

              <label>Druva*</label>
              <input type="text" value={bottle.grape} onChange={e => updateBottle(idx, { grape: e.target.value })} />

              <label>Alkohol*</label>
              <input type="text" value={bottle.alcohol} onChange={e => updateBottle(idx, { alcohol: e.target.value })} />

              <label>Tillverkning*</label>
              <input type="text" value={bottle.wineMaking} onChange={e => updateBottle(idx, { wineMaking: e.target.value })} />

              <label>Beskrivning*</label>
              <textarea value={bottle.description} onChange={e => updateBottle(idx, { description: e.target.value })} />

              <label>Antal</label>
              <input type="number" value={bottle.count} onChange={e => updateBottle(idx, { count: e.target.value })} />

              <button className="btn-danger" onClick={() => removeBottle(idx)}> Ta bort flaska</button>
            </div>
          ))}
        </div>

        <button className="icon-modal-button" onClick={addBottle}><Plus /> Flaska</button>

        <hr/>
        {error && <p style={{color:"red"}}>{error}</p>}
        <div className="modal-actions">
          <button className="btn-danger" onClick={handleDelete} disabled={saving}>Ta bort</button>
          <button onClick={onClose} disabled={saving}>Avbryt</button>
          <button onClick={handleSave} disabled={saving}>
            {saving ? "Sparar..." : "Spara"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default BoxModal;
