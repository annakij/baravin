import React, { useEffect, useState } from "react";
import api from "../../../api/axiosInstance";
import "./Newsletter.css";
import { UserRoundCheck, UserRoundMinus } from "lucide-react";

function RecipientsTab({ recipients, setRecipients, sendToAll, setSendToAll }) {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchProfiles() {
      try {
        const res = await api.get("/customer/profiles");
        setCustomers(res.data || []);
      } catch (err) {
        console.error("Kunde inte hämta kunder:", err);
      }
    }
    fetchProfiles();
  }, []);

  // Searchbar
  const filteredCustomers = customers.filter((c) => {
    const name = `${c.firstName || ""} ${c.lastName || ""}`.trim();
    const email = c.email || "";
    return (
      name.toLowerCase().includes(search.toLowerCase()) ||
      email.toLowerCase().includes(search.toLowerCase())
    );
  });

  // Stats topbar
  const subscribed = customers.length;
  const unsubscribed = 0;

  // Toggle customers as checked
  const toggleCustomer = (id) => {
    setRecipients((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="recipients-tab">
      {/* Stats */}
      <div className="recipients-stats">
        <div className="stat-card">
          <UserRoundCheck className="stat-card-icon" />
          <h3>{subscribed}</h3>
          <p>Subscribed</p>
        </div>
        <div className="stat-card">
          <UserRoundMinus className="stat-card-icon" />
          <h3>{unsubscribed}</h3>
          <p>Unsubscribed</p>
        </div>
      </div>

      {/* Checkbox of all or selected recipients */}
      <div className="recipients-options">
        <label>
          <input
            type="radio"
            checked={sendToAll}
            onChange={() => setSendToAll(true)}
          />
          Skicka till alla kunder
        </label>
        <label>
          <input
            type="radio"
            checked={!sendToAll}
            onChange={() => setSendToAll(false)}
          />
          Välj specifika kunder
        </label>
      </div>
        {/* Footer with total recipients */}
      <div className="recipients-footer">
        <p>
          Totalt antal mottagare:{" "}
          {sendToAll ? subscribed : recipients.length}
        </p>
      </div>
      {/* Searchbar & List of customers */}
      {!sendToAll && (
        <>
          <input
            type="text"
            className="input search-input"
            placeholder="Sök på namn eller email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="recipients-list">
            {filteredCustomers.map((c, index) => (
              <div key={c.id || c.email || index} className="recipient-row">
                <label className="recipient-checkbox">
                  <input
                    type="checkbox"
                    checked={recipients.includes(c.email)}
                    onChange={() => toggleCustomer(c.email)}
                  />
                  <span className="recipient-name">
                    {c.firstName} {c.lastName}
                  </span>
                </label>
                <span className="recipient-email">{c.email}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default RecipientsTab;
