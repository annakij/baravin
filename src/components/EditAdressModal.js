import "./AuthForms.css";
import { useState, useEffect } from "react";
import api from "../api/axiosInstance";

function EditAddressModal({ isOpen, onClose, currentProfile, onSave }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address1: "",
    address2: "",
    city: "",
    postalCode: "",
    mobile: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fyll formuläret med nuvarande profil
  useEffect(() => {
    if (currentProfile) {
      setFormData({
        firstName: currentProfile.firstName || "",
        lastName: currentProfile.lastName || "",
        address1: currentProfile.address1 || "",
        address2: currentProfile.address2 || "",
        city: currentProfile.city || "",
        postalCode: currentProfile.postalCode || "",
        mobile: currentProfile.mobile || "",
      });
    }
  }, [currentProfile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.put("/customer/profile", formData);
      onSave(response.data);
      onClose();
    } catch (err) {
      console.error(err);
      setError("Kunde inte uppdatera profilen.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal">
        <h2>Redigera Profil</h2>
        <form onSubmit={handleSubmit} className="form-container">
          <div className="form-group">
            <label>Förnamn</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>
          <div className="form-group">
            <label>Efternamn</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>
          <div className="form-group">
            <label>Adress 1</label>
            <input
              type="text"
              name="address1"
              value={formData.address1}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>
          <div className="form-group">
            <label>Adress 2 (C/O)</label>
            <input
              type="text"
              name="address2"
              value={formData.address2}
              onChange={handleChange}
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label>Stad</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>
          <div className="form-group">
            <label>Postnummer</label>
            <input
              type="text"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>
          <div className="form-group">
            <label>Telefon</label>
            <input
              type="text"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>

          {error && <p className="error">{error}</p>}

          <div className="modal-actions">
            <button type="button" onClick={onClose} disabled={loading}>
              Avbryt
            </button>
            <button type="submit" disabled={loading}>
              {loading ? "Sparar..." : "Spara"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditAddressModal;
