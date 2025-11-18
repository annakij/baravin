// AddRegionModal.jsx
import { useState } from "react";
import { Minus } from "lucide-react";
import "./Modals.css";

function AddRegionModal({ onClose, onSave }) {
  const [region, setRegion] = useState({
    name: "",
    description: "",
    wineries: [],
  });

  const [newWinery, setNewWinery] = useState({
    name: "",
    address: "",
    email: "",
    phone: "",
    videoId: "4Q2ktdGlEk0",
  });

  const handleAddWinery = () => {
    if (!newWinery.name.trim()) return;
    setRegion((prev) => ({
      ...prev,
      wineries: [...prev.wineries, newWinery],
    }));
    setNewWinery({
      name: "",
      address: "",
      email: "",
      phone: "",
      videoId: "4Q2ktdGlEk0",
    });
  };

  const handleRemoveWinery = (index) => {
    setRegion((prev) => ({
      ...prev,
      wineries: prev.wineries.filter((_, i) => i !== index),
    }));
  };

  const handleSave = () => {
    onSave(region);
    onClose();
  };

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="modal add-region-modal" onClick={(e) => e.stopPropagation()}>
        <h3>Lägg till ny region</h3>
        <p>* fält är obligatoriska</p>

        {/* Region Fields */}
        <label htmlFor="region-name">
          Namn*
          <input
            id="region-name"
            name="regionName"
            type="text"
            value={region.name}
            onChange={(e) => setRegion({ ...region, name: e.target.value })}
          />
        </label>

        <label htmlFor="region-description">
          Beskrivning*
          <textarea
            id="region-description"
            name="regionDescription"
            value={region.description}
            onChange={(e) => setRegion({ ...region, description: e.target.value })}
          />
        </label>

        <hr />

        {/* Wineries */}
        <h4>Vingårdar (frivilligt)</h4>
        {region.wineries.length > 0 && (
          <ul className="winery-list">
            {region.wineries.map((w, i) => (
              <li key={i} className="winery-item">
                <div className="winery-info">
                  <strong>{w.name}</strong> – {w.email} ({w.phone})
                  <a
                    className="remove-winery-btn"
                    onClick={() => handleRemoveWinery(i)}
                    title="Ta bort vingård"
                  >
                    <Minus />
                  </a>
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* Add New Winery */}
        <div className="add-winery-form">
          <input
            type="text"
            id="winery-name"
            name="wineryName"
            placeholder="Namn"
            value={newWinery.name}
            onChange={(e) => setNewWinery({ ...newWinery, name: e.target.value })}
          />
          <input
            type="text"
            id="winery-address"
            name="wineryAddress"
            placeholder="Adress"
            value={newWinery.address}
            onChange={(e) => setNewWinery({ ...newWinery, address: e.target.value })}
          />
          <input
            type="email"
            id="winery-email"
            name="wineryEmail"
            placeholder="Email"
            value={newWinery.email}
            onChange={(e) => setNewWinery({ ...newWinery, email: e.target.value })}
          />
          <input
            type="text"
            id="winery-phone"
            name="wineryPhone"
            placeholder="Telefon"
            value={newWinery.phone}
            onChange={(e) => setNewWinery({ ...newWinery, phone: e.target.value })}
          />
          <input
            type="text"
            id="winery-videoId"
            name="wineryVideoId"
            placeholder="Video ID"
            value={newWinery.videoId}
            onChange={(e) => setNewWinery({ ...newWinery, videoId: e.target.value })}
          />
          <button className="icon-modal-button" onClick={handleAddWinery}>
            + Vingård
          </button>
        </div>

        {/* Modal Actions */}
        <div className="modal-actions">
          <button onClick={onClose}>
            Avbryt
          </button>
          <button onClick={handleSave}>
            Spara
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddRegionModal;
