import React, { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import "./Newsletter.css";

function TemplatesTab({ onLoadTemplate }) {
  const [templates, setTemplates] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("newsletterTemplates") || "[]");
    setTemplates(saved);
  }, []);

  const handleDelete = (name) => {
    if (!window.confirm("Är du säker på att du vill radera mallen?")) return;
    const updated = templates.filter((t) => t.name !== name);
    setTemplates(updated);
    localStorage.setItem("newsletterTemplates", JSON.stringify(updated));
  };

  return (
    <div className="templates-tab">
      {templates.length === 0 ? (
        <p>Inga sparade mallar ännu.</p>
      ) : (
        <div className="templates-grid">
          {templates.map((t, i) => (
            <div key={i} className="template-card">
              <h3 className="template-name">{t.name}</h3>
              <p className="template-date">
                Skapad:{" "}
                {t.modified || new Date().toISOString().split("T")[0]}
              </p>
              <div className="template-actions">
                <button
                  className="btn btn-secondary"
                  onClick={() => onLoadTemplate(t)}
                >
                  Ladda in mall
                </button>
                <a
                  className="btn-icon"
                  onClick={() => handleDelete(t.name)}
                >
                  <Trash2 size={18} />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TemplatesTab;
