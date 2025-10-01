// src/pages/admin/MailManagement.jsx
import React, { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import api from "../../api/axiosInstance";
import { renderNewsletterHtml } from "../../utils/renderNewsletter";
import EditorTab from "../../components/admin/newsletter/EditorTab";
import TemplatesTab from "../../components/admin/newsletter/TemplatesTab";
import RecipientsTab from "../../components/admin/newsletter/RecipientsTab";
import "./MailManagement.css";

function MailManagement() {
  const [activeTab, setActiveTab] = useState("Skapa/ redigera");

  // Global states for whole Mail page
  const [templateToLoad, setTemplateToLoad] = useState(null);
  const [blocks, setBlocks] = useState([]);
  const [recipients, setRecipients] = useState([]);
  const [sendToAll, setSendToAll] = useState(true);
  const [subject, setSubject] = useState("");

  const handleSend = async () => {
    try {

      const html = renderNewsletterHtml(blocks);

      const payload = {
        subject,
        html,
        recipients: sendToAll ? "all" : recipients,
      };

      const res = await api.post("/email/send-campaign", payload);
      alert("Nyhetsbrev skickat!");
      console.log("Resultat:", res.data);
    } catch (err) {
      console.error("Fel vid utskick:", err);
      alert("Kunde inte skicka nyhetsbrevet.");
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="mail-container">
        {/* Top bar */}
        <div className="mail-topbar">
          <h1>Nyhetsbrev utskick</h1>
          <div className="mail-actions">
            <button className="btn btn-primary" onClick={handleSend}>Skicka nyhetsbrev</button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mail-tabs">
        {["Skapa/ redigera", "Mallar", "Mottagare"].map((tab) => (
        <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`mail-tab ${activeTab === tab ? "active" : ""}`}
        >
            {tab}
        </button>
        ))}
        </div>

        {/* Tab Content */}
        <div className="mail-content">
        {activeTab === "Skapa/ redigera" && (
        <EditorTab blocks={blocks} 
                    setBlocks={setBlocks} 
                    loadedTemplate={templateToLoad}
                    subject={subject}
                    setSubject={setSubject} />
        )}
        {activeTab === "Mallar" && (
        <TemplatesTab
            onLoadTemplate={(t) => {
            setBlocks(t.blocks || []);
            setActiveTab("Skapa/ redigera");
            setTemplateToLoad(t);
            }}
        />
        )}
        {activeTab === "Mottagare" && (
            <RecipientsTab
              recipients={recipients}
              setRecipients={setRecipients}
              sendToAll={sendToAll}
              setSendToAll={setSendToAll}
            />
          )}
        </div>
      </div>
    </DndProvider>
  );
}

export default MailManagement;
