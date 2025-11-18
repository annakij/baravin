import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import AddRegionModal from "../../../components/admin/products/AddRegionModal.js";
import Loading from "../Loading.js";
import api from "../../../api/axiosInstance.js";

function RegionsEditGrid({ regions, searchTerm, onRefresh }) {
  const [filteredRegions, setFilteredRegions] = useState([]);
  const [editModal, setEditModal] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [currentRegion, setCurrentRegion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 🔎 Filtrering
  useEffect(() => {
    if (!regions) return;
    const term = searchTerm?.toLowerCase() || "";
    setFilteredRegions(
      regions.filter(
        (r) =>
          r.name?.toLowerCase().includes(term) ||
          r.description?.toLowerCase().includes(term)
      )
    );
  }, [regions, searchTerm]);

  // 🧩 Modal hantering
  const openEditModal = (region) => {
    setCurrentRegion({ ...region });
    setError(null);
    setEditModal(true);
  };

  const closeModals = () => {
    setEditModal(false);
    setAddModal(false);
    setCurrentRegion(null);
    setError(null);
  };

  // 💾 Spara uppdaterad region
  const handleSave = async () => {
    if (!currentRegion?.id) return setError("Ingen giltig region vald.");
    if (!currentRegion.name?.trim() || !currentRegion.description?.trim())
      return setError("Namn och beskrivning krävs.");

    try {
      setLoading(true);
      await api.put(`/regions/${currentRegion.id}`, {
        name: currentRegion.name,
        description: currentRegion.description,
      });

      await onRefresh(); // 🟢 Uppdatera hela datan i Products.js
      closeModals();
    } catch (err) {
      console.error("Kunde inte spara region:", err);
      setError("Kunde inte spara regionen: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // ❌ Ta bort region
  const handleDelete = async () => {
    if (
      !window.confirm(
        `Är du säker på att du vill ta bort regionen "${currentRegion.name}"?\nOm regionen har gårdar eller boxar tas de också bort.`
      )
    )
      return;

    try {
      setLoading(true);
      setError(null);

      await api.delete(`/regions/${currentRegion.id}`);

      await onRefresh(); // 🟢 Hämta ny data
      closeModals();
    } catch (err) {
      if (err.response?.status === 409) {
        setError(
          "Vinboxar i denna region finns i ordrar. Gör istället regionen inaktiv och skapa en ny."
        );
      } else {
        setError("Kunde inte ta bort regionen: " + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // ➕ Lägg till region
  const handleAddRegion = async (newRegion) => {
    try {
      setLoading(true);
      setError(null);
      await api.post("/regions", newRegion);
      await onRefresh(); // 🟢 Hämta uppdaterad lista
      setAddModal(false);
    } catch (err) {
      console.error("Kunde inte lägga till region:", err);
      setError("Kunde inte lägga till regionen: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🖼️ Render
  return (
    <>
      {loading && <Loading />}

      <div className="products-topbar">
        <button
          className="products-topbar-icon"
          onClick={() => setAddModal(true)}
          title="Lägg till ny region"
        >
          <Plus />
        </button>
      </div>

      <div className="regions-grid">
        {filteredRegions.length === 0 && !loading ? (
          <p>Inga regioner hittades.</p>
        ) : (
          filteredRegions.map((region) => (
            <div
              key={region.id}
              className="region-card"
              onClick={() => openEditModal(region)}
            >
              <img
                src={`${process.env.PUBLIC_URL}/images/regions/${region.name}.png`}
                alt={region.name}
                onError={(e) => {
                  e.currentTarget.src = `${process.env.PUBLIC_URL}/images/regions/Valle.png`;
                }}
              />
              <div className="region-content">
                <h2 className="region-title">{region.name}</h2>
                <p className="region-description">{region.description}</p>
                <span className="region-button">Klicka för redigering</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ✏️ Redigera modal */}
      {editModal && currentRegion && (
        <div className="admin-modal-overlay" onClick={closeModals}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Redigera region</h3>

            <label>
              Namn:
              <input
                type="text"
                value={currentRegion.name || ""}
                onChange={(e) =>
                  setCurrentRegion((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
              />
            </label>

            <label>
              Beskrivning:
              <textarea
                value={currentRegion.description || ""}
                onChange={(e) =>
                  setCurrentRegion((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
              />
            </label>

            {error && (
              <div className="modal-error">
                <p>{error}</p>
              </div>
            )}

            <div className="modal-actions">
              <button onClick={handleDelete} className="btn-danger">
                Ta bort
              </button>
              <button onClick={closeModals}>Avbryt</button>
              <button onClick={handleSave}>Spara</button>
            </div>
          </div>
        </div>
      )}

      {/* ➕ Lägg till modal */}
      {addModal && (
        <AddRegionModal
          onClose={() => setAddModal(false)}
          onSave={handleAddRegion}
        />
      )}
    </>
  );
}

export default RegionsEditGrid;
