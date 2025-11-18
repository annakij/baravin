import { useState, useEffect } from "react";
import { Settings, Plus } from "lucide-react";
import api from "../../../api/axiosInstance";
import "./Products.css";
import Loading from "../Loading";

function WineryTable({ regions, searchTerm, onRefresh }) {
  const [filteredRegions, setFilteredRegions] = useState([]);
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [currentWinery, setCurrentWinery] = useState(null);
  const [newWinery, setNewWinery] = useState({
    name: "",
    address: "",
    email: "",
    phone: "",
    videoId: "4Q2ktdGlEk0",
    regionId: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 🔎 Filterar vingårdar baserat på söktermen
  useEffect(() => {
    if (!regions) return;
    const term = searchTerm?.toLowerCase() || "";

    const filtered = regions
      .map((region) => ({
        ...region,
        wineries:
          region.wineries?.filter((w) =>
            [w.name, w.address, w.email, w.phone]
              .filter(Boolean)
              .some((f) => f.toLowerCase().includes(term))
          ) || [],
      }))
      .filter((r) => r.wineries.length > 0);

    setFilteredRegions(filtered);
  }, [regions, searchTerm]);

  // 🧩 Modalhantering
  const closeModals = () => {
    setAddModal(false);
    setEditModal(false);
    setError(null);
    setCurrentWinery(null);
    setNewWinery({
      name: "",
      address: "",
      email: "",
      phone: "",
      videoId: "4Q2ktdGlEk0",
      regionId: "",
    });
  };

  // ✏️ Öppna editmodal
  const onEditWinery = (winery) => {
    setCurrentWinery({ ...winery });
    setEditModal(true);
  };

  // ➕ Skapa ny vingård
  const handleAddWinery = async () => {
    if (!newWinery.regionId) return setError("Du måste välja en region.");
    if (!newWinery.name.trim()) return setError("Namn är obligatoriskt.");

    try {
      setLoading(true);
      setError(null);

      const payload = {
        name: newWinery.name,
        address: newWinery.address,
        email: newWinery.email,
        phone: newWinery.phone,
        videoId: newWinery.videoId,
      };

      await api.post(`/wineries/${newWinery.regionId}`, payload);
      await onRefresh(); // 🟢 Uppdatera hela produktdatan

      closeModals();
    } catch (err) {
      console.error(err);
      setError(err.response?.data || "Kunde inte skapa vingård.");
    } finally {
      setLoading(false);
    }
  };

  // 💾 Uppdatera vingård
  const handleSaveEdit = async () => {
    if (!currentWinery?.id) return;
    try {
      setLoading(true);
      setError(null);

      await api.put(`/wineries/${currentWinery.id}`, currentWinery);
      await onRefresh();

      closeModals();
    } catch (err) {
      console.error(err);
      setError("Kunde inte uppdatera vingården.");
    } finally {
      setLoading(false);
    }
  };

  // ❌ Ta bort vingård
  const handleDelete = async () => {
    if (
      !window.confirm(
        `Är du säker på att du vill ta bort vingården "${currentWinery.name}"?\nOm den har boxar tas dessa också bort.`
      )
    )
      return;

    try {
      setLoading(true);
      setError(null);
      await api.delete(`/wineries/${currentWinery.id}`);
      await onRefresh();
      closeModals();
    } catch (err) {
      if (err.response?.status === 409) {
        setError(
          "Vingården kan inte tas bort eftersom dess boxar ingår i ordrar."
        );
      } else {
        setError("Kunde inte ta bort vingården.");
      }
    } finally {
      setLoading(false);
    }
  };

  // 🖼️ Render
  return (
    <>
      {loading && <Loading />}

      {/* 🔝 Topbar */}
      <div className="products-topbar">
        <button
          className="products-topbar-icon"
          onClick={() => setAddModal(true)}
          title="Lägg till ny vingård"
        >
          <Plus />
        </button>
      </div>

      {/* 📋 Lista över vingårdar */}
      <div className="top-products">
        {filteredRegions.length === 0 ? (
          <p>Inga vingårdar hittades.</p>
        ) : (
          filteredRegions.map((region) => (
            <div key={region.id || region.name}>
              <h3>{region.name}</h3>
              <ul>
                {region.wineries.map((winery) => (
                  <li key={winery.id || winery.name}>
                    <div>
                      <p>
                        <strong>{winery.name}</strong>
                      </p>
                      {winery.address && <p className="sub">{winery.address}</p>}
                      {winery.email && <p className="sub">{winery.email}</p>}
                      {winery.phone && <p className="sub">{winery.phone}</p>}
                      {winery.videoId && (
                        <p className="sub">Video ID: {winery.videoId}</p>
                      )}
                    </div>
                    <div>
                      <a
                        className="winery-edit"
                        onClick={() => onEditWinery(winery)}
                        title="Redigera vingård"
                      >
                        <Settings />
                      </a>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </div>

      {/* ➕ Add Winery Modal */}
      {addModal && (
        <div className="admin-modal-overlay" onClick={closeModals}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Lägg till ny vingård</h3>
            <p>* fält är obligatoriska</p>

            <label>Region* </label>
            <select
              value={newWinery.regionId}
              onChange={(e) =>
                setNewWinery({ ...newWinery, regionId: e.target.value })
              }
            >
              <option value="">Välj region...</option>
              {regions.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>

            <label>
              Namn*
              <input
                type="text"
                value={newWinery.name}
                onChange={(e) =>
                  setNewWinery({ ...newWinery, name: e.target.value })
                }
              />
            </label>

            <label>
              Adress
              <input
                type="text"
                value={newWinery.address}
                onChange={(e) =>
                  setNewWinery({ ...newWinery, address: e.target.value })
                }
              />
            </label>

            <label>
              Email
              <input
                type="email"
                value={newWinery.email}
                onChange={(e) =>
                  setNewWinery({ ...newWinery, email: e.target.value })
                }
              />
            </label>

            <label>
              Telefon
              <input
                type="text"
                value={newWinery.phone}
                onChange={(e) =>
                  setNewWinery({ ...newWinery, phone: e.target.value })
                }
              />
            </label>

            <label>
              Video ID
              <input
                type="text"
                value={newWinery.videoId}
                onChange={(e) =>
                  setNewWinery({ ...newWinery, videoId: e.target.value })
                }
              />
            </label>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <div className="modal-actions">
              <button onClick={closeModals} className="cancel-btn">
                Avbryt
              </button>
              <button
                onClick={handleAddWinery}
                disabled={loading}
              >
                {loading ? "Sparar..." : "Spara"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✏️ Edit Winery Modal */}
      {editModal && currentWinery && (
        <div className="admin-modal-overlay" onClick={closeModals}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Redigera vingård</h3>

            <label>
              Namn
              <input
                type="text"
                value={currentWinery.name || ""}
                onChange={(e) =>
                  setCurrentWinery({
                    ...currentWinery,
                    name: e.target.value,
                  })
                }
              />
            </label>

            <label>
              Adress
              <input
                type="text"
                value={currentWinery.address || ""}
                onChange={(e) =>
                  setCurrentWinery({
                    ...currentWinery,
                    address: e.target.value,
                  })
                }
              />
            </label>

            <label>
              Email
              <input
                type="email"
                value={currentWinery.email || ""}
                onChange={(e) =>
                  setCurrentWinery({
                    ...currentWinery,
                    email: e.target.value,
                  })
                }
              />
            </label>

            <label>
              Telefon
              <input
                type="text"
                value={currentWinery.phone || ""}
                onChange={(e) =>
                  setCurrentWinery({
                    ...currentWinery,
                    phone: e.target.value,
                  })
                }
              />
            </label>

            <label>
              Video ID
              <input
                type="text"
                value={currentWinery.videoId || ""}
                onChange={(e) =>
                  setCurrentWinery({
                    ...currentWinery,
                    videoId: e.target.value,
                  })
                }
              />
            </label>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <div className="modal-actions">
              <button onClick={handleDelete} className="btn-danger">
                Ta bort
              </button>
              <button onClick={closeModals} className="cancel-btn">
                Avbryt
              </button>
              <button
                onClick={handleSaveEdit}
                className="save-btn"
                disabled={loading}
              >
                {loading ? "Sparar..." : "Spara"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default WineryTable;
