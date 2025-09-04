import React, { useState } from "react";
import api from "axios";
import "./AuthForms.css";
import TermsConditions from "../pages/TermsConditions";

function RegisterForm() {
  const [formData, setFormData] = useState({
    email: "",
    mobile: "",
    firstName: "",
    lastName: "",
    address1: "",
    address2: "",
    city: "",
    postalCode: "",
    country: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [showTerms, setShowTerms] = useState(false);

  const validateField = (name, value) => {
    let error = "";

    if (name === "email" && value && !value.includes("@")) {
      error = "Ogiltig e-postadress.";
    }

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
    const { name, value, type, checked } = e.target;

    const val = type === "checkbox" ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: val,
    }));

    // Live validering
    const fieldError = validateField(name, val);
    setErrors((prev) => ({ ...prev, [name]: fieldError }));
  };

  const validateForm = () => {
    const newErrors = {};
    Object.entries(formData).forEach(([key, value]) => {
      const error = validateField(key, value);
      if (error) newErrors[key] = error;
    });
    if (!formData.termsAccepted) {
      newErrors.termsAccepted = "Du måste godkänna villkoren.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = { ...formData };

    try {
      const res = await api.post("token/register", payload);

      alert("Registrering lyckades!");

      console.log("Response:", res.data);

    } catch (err) {

      console.error(err);
      
      if (err.response && err.response.data) {
        console.error("Server response data:", err.response.data);
      }
      alert("Registrering misslyckades.");
    }
  };

  return (
    <div className="form-container">
      <h2>Skapa konto</h2>
      <form onSubmit={handleSubmit}>
        {/* Kontaktinformation */}
        <fieldset>
          <legend>Kontaktinformation</legend>
          <div className="form-group">
            <label>E-post</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            {errors.email && <p className="error">{errors.email}</p>}
          </div>
          <div className="form-group">
            <label>Lösenord</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            {errors.password && <p className="error">{errors.password}</p>}
          </div>
          <div className="form-group">
            <label>Verifiera lösenord</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            {errors.confirmPassword && (
              <p className="error">{errors.confirmPassword}</p>
            )}
          </div>
        </fieldset>

        {/* Leveransadress */}
        <fieldset>
          <legend>Leveransadress</legend>
          <div className="form-row">
            <div className="form-group">
              <label>Förnamn</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
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
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label>Adress</label>
            <input
              type="text"
              name="address1"
              value={formData.address1}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>C/O</label>
            <input
              type="text"
              name="address2"
              value={formData.address2}
              onChange={handleChange}
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Postnummer</label>
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Stad</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </div>
          </div>
            <div className="form-group">
              <label>Mobilnummer</label>
              <input type="text" name="mobile" value={formData.mobile} 
              onChange={handleChange}
              required
              />
            </div>
          <div className="form-group">
            <label>Land</label>
            <input type="text" name="country"
              value={formData.country}
              onChange={handleChange}
              required
            />
          </div>
        </fieldset>

        <div>
          <input className="checkbox" type="checkbox" name="termsAccepted"
            checked={formData.termsAccepted}
            onChange={handleChange}
            required
          />
          <span>
            Jag är över 25 år och har läst och godkänner{" "}
            <a className="link" onClick={() => setShowTerms(true)}> villkoren </a>
          </span>
        </div>
        {errors.termsAccepted && (
          <p className="error">{errors.termsAccepted}</p>
        )}

        {/* Modal for terms */}
        {showTerms && (
          <div className="modal-overlay" onClick={() => setShowTerms(false)} >
            <div className="modal">
              <a
                onClick={() => setShowTerms(false)}
                className="modal-close"
              >X</a>
              <TermsConditions />
            </div>
          </div>
        )}

        <div className="submit-row">
        <button type="submit" className="submit-btn">
          Registrera
        </button>
        <p><br/>Har du redan ett konto? <a className="link" href="/authenticate/loggain">Logga in!</a></p>
        </div>

      </form>
    </div>
  );
}

export default RegisterForm;
