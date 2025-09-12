import "./AuthForms.css";
import { useState } from "react";
import api from "../api/axiosInstance";

function EditPasswordDropdown({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    currentPassword: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  if (!isOpen) return null;

  const validateField = (name, value) => {
    let error = "";
  
    if (name === "password") {
      if (value.length < 8) {
        error = "Lösenordet måste vara minst 8 tecken.";
      } else if (!/\d/.test(value)) {
        error = "Lösenordet måste innehålla minst en siffra.";
      }
    }
  
    if (name === "confirmPassword" && value !== formData.password) {
      error = "Lösenorden matchar inte.";
    }
  
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    const fieldError = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: fieldError }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      await api.post("/token/changePassword", formData);
      setSuccessMessage("Lösenordet har uppdaterats.");
      setTimeout(() => {
        onClose();
        setSuccessMessage("");
      }, 2000);
      setFormData({
        currentPassword: "",
        password: "",
        confirmPassword: ""
      });
      setErrors({});
      onClose();
    } catch (err) {
      console.error(err);
      setErrorMessage(
        err.response?.data?.message || "Kunde inte uppdatera lösenordet."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`password-dropdown ${isOpen ? "open" : ""}`}>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nuvarande lösenord</label>
          <input
            type="password"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label>Nytt lösenord</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>
        {errors.password && (
          <p className="error">{errors.password}</p>
        )}

        <div className="form-group">
          <label>Verifiera nytt lösenord</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            disabled={loading}
          />
          {errors.confirmPassword && (
            <p className="error">{errors.confirmPassword}</p>
          )}
        </div>
        <div className="dropdown-actions">
          <button type="submit" disabled={loading}>
            {loading ? "Sparar..." : "Spara"}
          </button>
          <button type="button" onClick={onClose} disabled={loading}>
            Avbryt
          </button>
        </div>
      </form>
      {successMessage && (
        <p className="success" role="alert">
          {successMessage}
        </p>
      )}
      {errorMessage && (
        <p className="error" role="alert">
          {errorMessage}
        </p>
      )}
    </div>
  );
}

export default EditPasswordDropdown;
