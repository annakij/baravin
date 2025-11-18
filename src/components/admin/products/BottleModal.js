import "./Modals.css";
import { useState } from "react";
import api from "../../../api/axiosInstance";

function BottleModal({ bottle, onClose, onSaved, onRemoved }) {
    const [draft, setDraft] = useState(() => ({
      id: bottle?.id,
      wineBoxId: bottle?.wineBoxId,
      title: bottle?.title || "",
      year: bottle?.year || new Date().getFullYear(),
      area: bottle?.area || "",
      grape: bottle?.grape || "",
      alcohol: bottle?.alcohol || "",
      wineMaking: bottle?.wineMaking || "",
      description: bottle?.description || "",
      count: bottle?.count || 1
    }));
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
  
    if (!bottle) return null;

  const save = async () => {
    try {
      setSaving(true); setError(null);
      const payload = {
        title: draft.title,
        year: Number(draft.year),
        area: draft.area,
        grape: draft.grape,
        alcohol: draft.alcohol,
        wineMaking: draft.wineMaking,
        description: draft.description,
        count: Number(draft.count) || 1
      };
      const res = await api.put(`/wineboxes/${draft.wineBoxId}/bottles/${draft.id}`, payload);
      onSaved?.(res.data);
    } catch (e) {
      setError(e.response?.data || "Kunde inte spara flaska.");
    } finally {
      setSaving(false);
    }
  };

   return (
     <div className="admin-modal-overlay" onClick={onClose}>
       <div className="modal" onClick={(e) => e.stopPropagation()}>
         <h2>Redigera flaska</h2>
         <p>* fält är obligatoriska</p>

        <label>Titel*</label>
        <input type="text" value={draft.title} onChange={e => setDraft(d => ({ ...d, title: e.target.value }))} />

        <label>År</label>
        <input type="number" value={draft.year} onChange={e => setDraft(d => ({ ...d, year: e.target.value }))} />

        <label>Område*</label>
        <input type="text" value={draft.area} onChange={e => setDraft(d => ({ ...d, area: e.target.value }))} />

        <label>Druva*</label>
        <input type="text" value={draft.grape} onChange={e => setDraft(d => ({ ...d, grape: e.target.value }))} />

        <label>Alkohol*</label>
        <input type="text" value={draft.alcohol} onChange={e => setDraft(d => ({ ...d, alcohol: e.target.value }))} />

        <label>Tillverkning*</label>
        <input type="text" value={draft.wineMaking} onChange={e => setDraft(d => ({ ...d, wineMaking: e.target.value }))} />

        <label>Beskrivning*</label>
        <textarea value={draft.description} onChange={e => setDraft(d => ({ ...d, description: e.target.value }))}></textarea>

        <label>Antal</label>
        <input type="number" value={draft.count} onChange={e => setDraft(d => ({ ...d, count: e.target.value }))} />

        {error && <p style={{color:"red"}}>{error}</p>}
         <div className="modal-actions">
          <button onClick={onClose} disabled={saving}>Avbryt</button>
          <button onClick={save} disabled={saving}>{saving ? "Sparar..." : "Spara"}</button>
         </div>
       </div>
     </div>
   );
 }

 export default BottleModal;
