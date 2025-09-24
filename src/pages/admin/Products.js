import { useState } from "react";
import RegionsEditGrid from "../../components/admin/products/RegionsEditGrid";
import WineryTable from "../../components/admin/products/WineryTable"
import WineboxTable from "../../components/admin/products/WineboxTable"
import "./Products.css";

function Products () {

    const [activeTab, setActiveTab] = useState("regions")

  const tabs = [
    { id: "regions", label: "Regioner" },
    { id: "vineyards", label: "Vingårdar" },
    { id: "wines", label: "Vinboxar" },
  ]


return (
    <div className="products-container">
      <h1 className="products-header">Produkter</h1>

      {/* Flikarna */}
      <div className="tabs-list">
        {tabs.map(tab => (
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

      {/* Innehållet */}
      <div className="tabs-content">
        {activeTab === "regions" && (
          <>
            <RegionsEditGrid />
          </>
        )}
        {activeTab === "vineyards" && (
          <>
            <WineryTable />
          </>
        )}
        {activeTab === "wines" && (
          <>
            <WineboxTable />
          </>
        )}
      </div>
    </div>
);

};

export default Products;