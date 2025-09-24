import { useState, useEffect } from "react";
import api from "../../../api/axiosInstance.js";
import Loading from "../Loading.js";
import { Plus } from "lucide-react";
import AddRegionModal from "../../../components/admin/products/AddRegionModal.js";

function RegionsEditGrid() {
  const [regions, setRegions] = useState([]);
  const [filteredRegions, setFilteredRegions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editModal, setEditModal] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [currentRegion, setCurrentRegion] = useState(null);

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const res = await api.get("/regions/admin");
        setRegions(res.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRegions();
  }, []);

  // Search bar
  useEffect(() => {
    const term = searchTerm.toLowerCase();

    const filtered = regions.filter(
      (r) =>
        r.name?.toLowerCase().includes(term) ||
        r.description?.toLowerCase().includes(term)
    );

    setFilteredRegions(filtered);
  }, [searchTerm, regions]);

  const openModal = (region) => {
    setCurrentRegion(region);
    setEditModal(true);
  };

  const closeModal = () => {
    setEditModal(false);
    setCurrentRegion(null);
  };

  const handleSave = async () => {
    try {
      await api.put("/region", currentRegion);

      // Update State
      setRegions((prev) =>
        prev.map((r) => (r.id === currentRegion.id ? currentRegion : r))
      );

      closeModal();
    } catch (err) {
      alert("Kunde inte spara regionen: " + err.message);
    }
  };

  // Add new region + optional winery
  const handleAddRegion = async (newRegion) => {
    try {
      const res = await api.post("/regions", newRegion);

      setRegions((prev) => [...prev, res.data]);

      setAddModal(false);
    } catch (err) {
      alert("Kunde inte lägga till regionen: " + err.message);
    }
  };

  if (loading) return <Loading />;
  if (error) return <p>Något gick fel: {error}</p>;

  return (
    <>
      <div className="products-topbar">
        <input
          type="text"
          placeholder="Sök efter region..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <a className="products-topbar-icon" onClick={() => setAddModal(true)}>
          <Plus />
        </a>
      </div>

      <div className="regions-grid">
        {filteredRegions.map((region) => (
          <div
            key={region.name}
            className="region-card"
            onClick={() => openModal(region)}
          >
            <img
              src={`${process.env.PUBLIC_URL}/images/regions/${region?.name}.png`}
              alt={region?.name || "Valle"}
              onError={(e) => {
                e.currentTarget.src = `${process.env.PUBLIC_URL}/images/regions/Valle.png`;
              }}
            />
            <div className="region-content">
              <h2 className="region-title">{region.name}</h2>
              <p className="region-description">{region.description}</p>
              <a className="region-button">Klicka för redigering</a>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Region Modal */}
      {editModal && currentRegion && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>{currentRegion.name}</h3>
            <label>
              Namn:
              <input
                type="text"
                value={currentRegion.name}
                onChange={(e) =>
                  setCurrentRegion({ ...currentRegion, name: e.target.value })
                }
              />
            </label>
            <label>
              Beskrivning:
              <textarea
                value={currentRegion.description}
                onChange={(e) =>
                  setCurrentRegion({
                    ...currentRegion,
                    description: e.target.value,
                  })
                }
              />
            </label>
            <div className="modal-actions">
              <button onClick={closeModal} className="cancel-btn">
                Avbryt
              </button>
              <button onClick={handleSave} className="save-btn">
                Spara
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Region Modal */}
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
