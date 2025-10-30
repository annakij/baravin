import { useEffect, useState } from "react";
import { Plus, Trash2, Calendar, Clock } from "lucide-react";
import api from "../../api/axiosInstance";
import DiscountForm from "../../components/admin/discounts/DiscountForm";
import Loading from "../../components/admin/Loading";
import "./Discounts.css";

function Discounts() {
  const [discounts, setDiscounts] = useState([]);
  const [filteredDiscounts, setFilteredDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchDiscounts = async () => {
    try {
      const res = await api.get("/discount");
      setDiscounts(res.data || []);
    } catch (err) {
      console.error("Kunde inte hämta rabatter:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscounts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Är du säker på att du vill ta bort denna rabattkod?")) return;
    try {
      await api.delete(`/discount/${id}`);
      setDiscounts((prev) => prev.filter((d) => d.id !== id));
    } catch (err) {
      alert("Kunde inte ta bort rabatten – den kan vara kopplad till en order.");
    }
  };

  useEffect(() => {
    const term = searchTerm.toLowerCase().trim();
  
    const statusMap = {
      active: ["active", "aktiv"],
      upcoming: ["upcoming", "kommande"],
      expired: ["expired", "utgången"]
    };
  
    const filtered = discounts.filter((d) => {
    const status = getStatus(d).toLowerCase();
  
    const matchesCode = d.code?.toLowerCase().includes(term);
    const matchesAmount = d.amount.toString().includes(term);
  
    const matchesStatus = Object.entries(statusMap).some(([key, words]) => {
    return key === status && words.some((w) => w.includes(term));
    });
  
    return matchesCode || matchesAmount || matchesStatus;
  });
  
    setFilteredDiscounts(filtered);
  }, [searchTerm, discounts]);
  

  const handleSave = async (data, editId) => {
    try {
      if (editId) {
        await api.put(`/discount/${editId}`, data);
      } else {
        await api.post("/discount", data);
      }
      setShowForm(false);
      setSelected(null);
      fetchDiscounts();
    } catch (err) {
      console.error("Kunde inte spara rabatt:", err);
      alert("Något gick fel vid sparandet av rabatten.");
    }
  };

  const getStatus = (d) => {
    const now = new Date();
    const start = new Date(d.dateActivated);
    const end = d.dateDeactivated ? new Date(d.dateDeactivated) : null;
    if (now < start) return "upcoming";
    if (end && now > end) return "expired";
    return "active";
  };

  if (loading) return <Loading />;

  return (
    <div className="discounts-page">
      <div className="header-row">
        <h1>Rabatter</h1>
        <input
            type="text"
            placeholder="Sök på rabatt..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="discounts-search-input"
          />
        <button
          className="products-topbar-icon"
          onClick={() => {
            setSelected(null);
            setShowForm(true);
          }}
        >
          <Plus/>
        </button>
      </div>

      {filteredDiscounts.length === 0 && <p>Inga rabatter matchar din sökning.</p>}

      <div className="discounts-grid">
        {filteredDiscounts.map((d) => {
          const status = getStatus(d);
          return (
            <div key={d.id} className={`discount-card ${status}`} onClick={() => {
              setSelected(d);
              setShowForm(true);
            }}>
              <div className="discount-header">
                <h1 className="discount-code">{d.code}</h1>
                <span className={`status-badge ${status}`}>
                {status === "active" && "Aktiv"}
                {status === "upcoming" && "Kommande"}
                {status === "expired" && "Utgången"}
              </span>
              </div>

              <p className="amount">Summa: {d.amount} kr</p>

              <div className="dates">
                <p>
                  <Calendar size={14} /> {new Date(d.dateActivated).toLocaleDateString("sv-SE")}
                </p>
                {d.dateDeactivated && (
                  <p>
                    <Clock size={14} /> {new Date(d.dateDeactivated).toLocaleDateString("sv-SE")}
                  </p>
                )}
              </div>

              <div className="card-actions">
                <p className="dates">Klicka för redigering..</p>
                <a className="discounts-delete-btn" onClick={(e) => { e.stopPropagation(); handleDelete(d.id); }}>
                  <Trash2 size={22} />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {showForm && (
        <DiscountForm
          onClose={() => setShowForm(false)}
          onSave={handleSave}
          editDiscount={selected}
        />
      )}
    </div>
  );
}

export default Discounts;
