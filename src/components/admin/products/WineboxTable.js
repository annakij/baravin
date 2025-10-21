import { useState, useEffect } from "react";
import { Settings, Plus, Eye, EyeOff } from "lucide-react";
import Loading from "../Loading";
import "./Products.css";
import BoxModal from "./BoxModal";
import BottleModal from "./BottleModal";
import AddWineboxModal from "./AddWineboxModal";
import api from "../../../api/axiosInstance";

function WineboxTable({ wineboxes, regions, searchTerm, onRefresh }) {
  const [filteredWineboxes, setFilteredWineboxes] = useState([]);
  const [selectedBox, setSelectedBox] = useState(null);
  const [selectedBottle, setSelectedBottle] = useState(null);
  const [addModal, setAddModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bulkEditModal, setBulkEditModal] = useState(false);
  const [bulkPrice, setBulkPrice] = useState("");
  const [error, setError] = useState(null);

  // 🔍 Filtrering (baserat på söktermen från Products)
  useEffect(() => {
    if (!wineboxes) return;
    const term = searchTerm?.toLowerCase() || "";

    const filtered = wineboxes.filter((box) => {
      const matchesBox =
        box.name?.toLowerCase().includes(term) ||
        box.description?.toLowerCase().includes(term) ||
        box.price?.toString().includes(term);

      const matchesBottle = box.bottles?.some(
        (bottle) =>
          bottle.title?.toLowerCase().includes(term) ||
          bottle.area?.toLowerCase().includes(term) ||
          bottle.grape?.toLowerCase().includes(term)
      );

      const matchesRegion =
        regions
          ?.find((r) =>
            r.wineries.some((w) => w.id === box.wineryId)
          )
          ?.name?.toLowerCase()
          .includes(term) ?? false;

      const matchesWinery =
        regions
          ?.flatMap((r) => r.wineries)
          ?.find((w) => w.id === box.wineryId)
          ?.name?.toLowerCase()
          .includes(term) ?? false;

      return matchesBox || matchesBottle || matchesRegion || matchesWinery;
    });

    setFilteredWineboxes(filtered);
  }, [searchTerm, wineboxes, regions]);

  // 🧠 Highlight helper
  const highlightMatch = (text, term) => {
    if (!term) return text;
    const regex = new RegExp(`(${term})`, "gi");
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? <mark key={i}>{part}</mark> : part
    );
  };

  // 👁️ Toggle availability
  const toggleAvailability = async (box) => {
    try {
      const res = await api.put(`/wineboxes/toggle-availability/${box.id}`);
      const { newStock } = res.data;

      // Lokalt snabbupdate
      setFilteredWineboxes((prev) =>
        prev.map((b) =>
          b.id === box.id ? { ...b, availableQuantity: newStock } : b
        )
      );

      // Full refetch
      await onRefresh();
    } catch (e) {
      console.error("Kunde inte uppdatera tillgänglighet", e);
    }
  };

  // 💸 Bulk edit modal
  const handleBulkEdit = async () => {
    if (!bulkPrice || isNaN(bulkPrice)) {
      setError("Ange ett giltigt prisvärde.");
      return;
    }
    try {
      setLoading(true);
      await api.post("/admin/update-prices", { priceDelta: bulkPrice });
      await onRefresh();
      setBulkEditModal(false);
      setBulkPrice("");
    } catch (e) {
      console.error("Kunde inte uppdatera priser", e);
      setError("Ett fel inträffade vid uppdatering av priser.");
    } finally {
      setLoading(false);
    }
  };

  if (!wineboxes) return <Loading />;

  return (
    <>
      {loading && <Loading />}

      {/* 🔝 Topbar */}
      <div className="products-topbar">
        <button
          className="products-topbar-icon"
          onClick={() => setAddModal(true)}
          title="Lägg till vinbox"
        >
          <Plus />
        </button>
        <button
          className="admin-bulk-edit-btn"
          onClick={() => setBulkEditModal(true)}
        >
          Ändra pris på alla boxar
        </button>
      </div>

      {/* 📦 Lista av boxar */}
      <div className="admin-winebox-table">
        {filteredWineboxes.length === 0 ? (
          <p>Inga vinboxar hittades.</p>
        ) : (
          filteredWineboxes.map((box) => {
            const winery = regions
              ?.flatMap((r) => r.wineries)
              ?.find((w) => w.id === box.wineryId);
            const region = regions?.find((r) =>
              r.wineries.some((w) => w.id === box.wineryId)
            );

            return (
              <div key={box.id} className="admin-winebox-card">
                <div className="winebox-card-header">
                  <div>
                    <p className="admin-winebox-name">
                      {highlightMatch(box.name, searchTerm)}{" "}
                      {region && (
                        <span className="region-sub">
                          ({highlightMatch(region.name, searchTerm)})
                        </span>
                      )}
                    </p>
                    {winery && (
                      <p className="sub">
                        Vingård: {highlightMatch(winery.name, searchTerm)}
                      </p>
                    )}
                  </div>

                  <div className="winebox-card-actions">
                    {box.availableQuantity > 0 ? (
                      <a
                        className="winery-edit"
                        onClick={() => toggleAvailability(box)}
                        title="Gör otillgänglig"
                      >
                        <Eye />
                      </a>
                    ) : (
                      <a
                        className="winery-edit"
                        onClick={() => toggleAvailability(box)}
                        title="Gör tillgänglig"
                      >
                        <EyeOff />
                      </a>
                    )}
                    <a
                      className="winery-edit"
                      onClick={() => setSelectedBox(box)}
                      title="Redigera vinbox"
                    >
                      <Settings />
                    </a>
                  </div>
                </div>

                <p className="admin-winebox-desc">
                  <strong>Innehåll:</strong> {box.description}
                </p>
                <p className="admin-winebox-price">
                  <strong>Pris:</strong> {box.price} kr
                </p>
                <p className="admin-winebox-qty">
                  <strong>Lager:</strong> {box.availableQuantity}
                </p>

                {/* 🍾 Flaskor */}
                <div className="admin-bottles-grid">
                  {box.bottles?.map((bottle) => (
                    <div
                      key={`${box.id}-${bottle.id}`}
                      className="admin-bottle-card"
                    >
                      <div className="winebox-card-header">
                        <p>
                          <strong>
                            {highlightMatch(bottle.title, searchTerm)}
                          </strong>
                        </p>
                        <a
                          className="winery-edit"
                          onClick={() =>
                            setSelectedBottle({
                              ...bottle,
                              wineBoxId: box.id,
                            })
                          }
                          title="Redigera flaska"
                        >
                          <Settings />
                        </a>
                      </div>
                      <p className="sub">
                        <strong>Område:</strong>{" "}
                        {highlightMatch(bottle.area, searchTerm)}
                      </p>
                      <p className="sub">
                        <strong>Druva:</strong>{" "}
                        {highlightMatch(bottle.grape, searchTerm)} (
                        {bottle.year})
                      </p>
                      <p className="sub">
                        <strong>Innehåll:</strong> {bottle.alcohol},{" "}
                        {bottle.wineMaking}
                      </p>
                      <p className="sub">
                        <strong>Beskrivning:</strong> {bottle.description}
                      </p>
                      <p className="sub">
                        <strong>Antal:</strong> {bottle.count}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ➕ Lägg till box */}
      {addModal && (
        <AddWineboxModal
          onClose={() => setAddModal(false)}
          regions={regions}
          onSaved={async () => {
            await onRefresh();
            setAddModal(false);
          }}
        />
      )}

      {/* ✏️ Redigera box */}
      {selectedBox && (
        <BoxModal
          box={selectedBox}
          onClose={() => setSelectedBox(null)}
          onSaved={async () => {
            await onRefresh();
            setSelectedBox(null);
          }}
          onDeleted={async () => {
            await onRefresh();
            setSelectedBox(null);
          }}
        />
      )}

      {/* 🍷 Redigera flaska */}
      {selectedBottle && (
        <BottleModal
          bottle={selectedBottle}
          onClose={() => setSelectedBottle(null)}
          onSaved={async () => {
            await onRefresh();
            setSelectedBottle(null);
          }}
          onRemoved={async () => {
            await onRefresh();
            setSelectedBottle(null);
          }}
        />
      )}

      {/* 💸 Bulk Edit Modal */}
      {bulkEditModal && (
        <div className="admin-modal-overlay" onClick={() => setBulkEditModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Massuppdatera priser</h3>
            <p>Ange ett heltalsvärde att justera alla boxars pris med.</p>
            <input
              type="number"
              value={bulkPrice}
              onChange={(e) => setBulkPrice(e.target.value)}
              placeholder="t.ex. +10 eller -15"
            />
            {error && <p className="modal-error">{error}</p>}
            <div className="modal-actions">
              <button onClick={() => setBulkEditModal(false)}>Avbryt</button>
              <button onClick={handleBulkEdit} disabled={loading}>
                {loading ? "Sparar..." : "Uppdatera"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default WineboxTable;
