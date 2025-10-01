import { useRef, useState, useEffect } from "react";
import api from "../../../api/axiosInstance";

export default function BlockEditor({ block, updateBlock }) {
  const fileInputRef = useRef(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await api.get("/regions");
        console.log("Regions API response:", res.data);
        const regions = res.data || [];

        const flattened = [];

        regions.forEach((region) => {
          region.wineries?.forEach((winery) => {
            winery.wineBoxes?.forEach((box) => {
              flattened.push({
                id: String(box.id),
                name: box.name,
                image: `${process.env.PUBLIC_URL}/images/regions/${region.name}.png`,
                url: `/region/${region.id}`,
              });
            });
          });
        });

        console.log("Flattened products:", flattened); // 👈 Debug
        setProducts(flattened);
      } catch (err) {
        console.error("Kunde inte hämta vinboxar:", err);
      }
    }

    loadProducts();
  }, []);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fd = new FormData();
    fd.append("image", file);
    const res = await api.post("/api/upload-image", fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    updateBlock({ ...block, url: res.data.url });
  };

  // --- Render per blocktyp ---
  if (block.type === "text") {
    return (
      <div>
        <p><strong>Block typ:</strong> Text</p>
        <p>Redigera texten direkt i förhandsgranskningen.</p>
      </div>
    );
  }

  if (block.type === "image") {
    return (
      <div>
        <p><strong>Block typ:</strong> Bild</p>
        <label>Bild-URL:</label>
        <input
          type="text"
          value={block.url || ""}
          onChange={(e) => updateBlock({ ...block, url: e.target.value })}
          className="input"
        />

        <button
          className="btn btn-secondary"
          onClick={() => fileInputRef.current.click()}
          style={{ marginTop: "8px" }}
        >
          Ladda upp bild
        </button>

        <input
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          ref={fileInputRef}
          onChange={handleUpload}
        />

        <label style={{ marginTop: "12px", display: "block" }}>Bredd (%):</label>
        <input
          type="range"
          min="10"
          max="100"
          value={block.width || 100}
          onChange={(e) => updateBlock({ ...block, width: e.target.value })}
        />
        <span>{block.width || 100}%</span>
      </div>
    );
  }

  if (block.type === "productGrid") {
    return (
      <div>
        <p><strong>Block typ:</strong> Produktdisplay</p>
        <div className="product-blockeditor">
        <label>
          Produkt 1:
          <select
            value={block.product1?.id || ""}
            onChange={(e) => {
                const product = products.find((p) => p.id === e.target.value);
                updateBlock({ ...block, product1: product });
            }}
          >
            <option value="">Välj produkt...</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </label>
        </div>
  
        <label>
          Produkt 2:
          <select
            value={block.product2?.id || ""}
            onChange={(e) => {
              const product = products.find((p) => p.id === e.target.value);
              updateBlock({ ...block, product2: product });
            }}
          >
            <option value="">Välj produkt...</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </label>
      </div>
    );
  }

  if (block.type === "link") {
    return (
      <div>
        <p><strong>Block typ:</strong> Länk</p>
        
        <label>Länktext:</label>
        <input
          type="text"
          value={block.text || "Länk"}
          onChange={(e) => updateBlock({ ...block, text: e.target.value })}
          className="input"
        />
  
        <label style={{ marginTop: "8px" }}>URL:</label>
        <input
          type="text"
          value={block.url || ""}
          onChange={(e) => updateBlock({ ...block, url: e.target.value })}
          className="input"
        />
      </div>
    );
  }
  

  if (block.type === "button") {
    return (
      <div>
        <p><strong>Block typ:</strong> Knapp</p>
        <label>Knapptext:</label>
        <input
          type="text"
          value={block.text || "Klicka här"}
          onChange={(e) => updateBlock({ ...block, text: e.target.value })}
          className="input"
        />

        <label style={{ marginTop: "8px" }}>Länk (URL):</label>
        <input
          type="text"
          value={block.url || ""}
          onChange={(e) => updateBlock({ ...block, url: e.target.value })}
          className="input"
        />
      </div>
    );
  }

  if (block.type === "divider") {
    return (
      <div>
        <p><strong>Block typ:</strong> Linje</p>
        <p>Ingen konfiguration.</p>
      </div>
    );
  }

  if (block.type === "spacer") {
    return (
      <div>
        <p><strong>Block typ:</strong> Mellanrum</p>
        <label>Höjd:</label>
        <input
          type="range"
          min="10"
          max="100"
          value={block.height || 20}
          onChange={(e) =>
            updateBlock({ ...block, height: parseInt(e.target.value, 10) })
          }
        />
        <span>{block.height || 20}px</span>
      </div>
    );
  }

  return <p>Ingen editor för denna blocktyp.</p>;
}
