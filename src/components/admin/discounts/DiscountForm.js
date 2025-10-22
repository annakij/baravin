import { useState } from "react";
import { X } from "lucide-react";

function DiscountForm({ onClose, onSave, editDiscount }) {
  const [form, setForm] = useState(
    editDiscount || {
      code: "",
      amount: "",
      dateActivated: new Date().toISOString().slice(0, 10),
      dateDeactivated: "",
    }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.code || !form.amount) {
      alert("Kod och belopp krävs!");
      return;
    }

    onSave(
      {
        code: form.code.trim(),
        amount: parseFloat(form.amount),
        dateActivated: form.dateActivated,
        dateDeactivated: form.dateDeactivated || null,
      },
      editDiscount?.id
    );
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>{editDiscount ? "Redigera rabatt" : "Ny rabatt"}</h2>
          <p>*fält är obligatoriska</p>
        </div>

        <form onSubmit={handleSubmit} className="discount-form">
          <label>
            Rabattkod*
            <input
              type="text"
              name="code"
              value={form.code}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Belopp (kr)*
            <input
              type="number"
              name="amount"
              min="1"
              step="1"
              value={form.amount}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Startdatum*
            <input
              type="date"
              name="dateActivated"
              value={form.dateActivated.slice(0, 10)}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Slutdatum
            <input
              type="date"
              name="dateDeactivated"
              value={form.dateDeactivated?.slice(0, 10) || ""}
              onChange={handleChange}
            />
          </label>

          <div className="modal-actions">
            <button type="button" onClick={onClose}>
              Avbryt
            </button>
            <button type="submit">
              Spara
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default DiscountForm;
