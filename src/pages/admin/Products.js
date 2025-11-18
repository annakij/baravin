import { useEffect, useState, useRef } from "react";
import api from "../../api/axiosInstance";
import RegionsEditGrid from "../../components/admin/products/RegionsEditGrid";
import WineryTable from "../../components/admin/products/WineryTable";
import WineboxTable from "../../components/admin/products/WineboxTable";
import InformationTab from "../../components/admin/products/ProductInformationTab";
import Loading from "../../components/admin/Loading";
import "./Products.css";

function Products() {
  const [activeTab, setActiveTab] = useState("regions");
  const [regions, setRegions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [initialLoading, setInitialLoading] = useState(true); // bara första gången
  const [refreshing, setRefreshing] = useState(false); // för tysta uppdateringar
  const [error, setError] = useState(null);
  const scrollPos = useRef(0);

  const tabs = [
    { id: "regions", label: "Regioner" },
    { id: "vineyards", label: "Vingårdar" },
    { id: "wines", label: "Vinboxar" },
    { id: "info", label: "Info" },
  ];

  // 🧠 Fetch regions
  const fetchData = async (silent = false) => {
    try {
      if (!silent) setRefreshing(true);
      const res = await api.get("/regions/get-all");
      setRegions(res.data);
    } catch (err) {
      console.error("Failed to load regions data", err);
      setError("Kunde inte ladda produktdata");
    } finally {
      if (initialLoading) setInitialLoading(false);
      if (!silent) setRefreshing(false);
    }
  };

  // 🔁 Initial load
  useEffect(() => {
    fetchData();
  }, []);

  // 💾 Bevara scroll innan refresh
  const preserveScroll = () => {
    scrollPos.current = window.scrollY;
  };

  // 🔄 Återställ scroll när datan laddats klart
  const restoreScroll = () => {
    requestAnimationFrame(() => {
      window.scrollTo({ top: scrollPos.current, behavior: "instant" });
    });
  };

  // 🧭 När data ändras efter tyst refresh
  useEffect(() => {
    if (!initialLoading && refreshing === false) {
      restoreScroll();
    }
  }, [regions, refreshing]);

  if (initialLoading) return <Loading />;
  if (error) return <p>{error}</p>;

  return (
    <div className="admin-page-container">
      <div className="admin-page-header">
        <h1 className="products-header">Produkter</h1>

        <div className="tabs-list">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`tab-trigger ${
                activeTab === tab.id ? "tab-trigger-active" : ""
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Shared topbar */}
      <div className="products-topbar">
        <input
          type="text"
          placeholder="Sök bland regioner, vingårdar, boxar..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Content */}
      <div className={`admin-page-content ${refreshing ? "content-refreshing" : ""}`}>
        {activeTab === "regions" && (
          <RegionsEditGrid
            regions={regions}
            searchTerm={searchTerm}
            onRefresh={async () => {
              preserveScroll();
              await fetchData(true);
            }}
          />
        )}
        {activeTab === "vineyards" && (
          <WineryTable
            regions={regions}
            searchTerm={searchTerm}
            onRefresh={async () => {
              preserveScroll();
              await fetchData(true);
            }}
          />
        )}
        {activeTab === "wines" && (
          <WineboxTable
            regions={regions}
            wineboxes={regions.flatMap((r) =>
              r.wineries.flatMap((w) => w.wineBoxes)
            )}
            searchTerm={searchTerm}
            onRefresh={async () => {
              preserveScroll();
              await fetchData(true);
            }}
          />
        )}
        {activeTab === "info" && <InformationTab />}
      </div>

      {/* Liten visuell overlay under tyst refresh */}
      {refreshing && (
        <div className="soft-refresh-overlay">
          <p>Uppdaterar data...</p>
        </div>
      )}
    </div>
  );
}

export default Products;
