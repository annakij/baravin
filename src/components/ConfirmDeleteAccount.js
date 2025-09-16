import { useState, useRef, inputRef, popupRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import "./ConfirmDeleteAccount.css";

function ConfirmDeleteAccount({ isOpen, onClose }) {
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    if (!isOpen) return null;


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await api.post("/customer/delete-account", { password });
            alert("Ditt konto har raderats.");
            navigate("/privat");
            onClose();
        } catch (err) {
            console.error(err);
            setError("Något gick fel, kunde inte radera kontot.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
          className="confirm-popup"
          role="dialog"
          aria-modal="false"
          aria-labelledby="confirm-delete-title"
          ref={popupRef}
        >
          <form onSubmit={handleSubmit}>
            <div className="confirm-header">
              <h4 id="confirm-delete-title">Är du säker?</h4>
            </div>
    
            <p className="confirm-text">
              Är du säker på att du vill <strong>radera ditt konto</strong>? Detta
              kan inte ångras.
            </p>
    
            <label className="confirm-label">
              Ange lösenord för att bekräfta
              <input
                ref={inputRef}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="confirm-input"
                placeholder="Ditt lösenord"
                disabled={loading}
                autoComplete="current-password"
              />
            </label>
    
            {error && (
              <div className="confirm-error" role="alert">
                {error}
              </div>
            )}
    
            <div className="confirm-actions">
              <button
                onClick={onClose}
                disabled={loading}
              >
                Avbryt
              </button>
              <button
                type="submit"
                className="btn-danger"
                disabled={loading}
                aria-disabled={loading}
              >
                {loading ? "Tar bort..." : "Radera konto"}
              </button>
            </div>
          </form>
        </div>
      );
}

export default ConfirmDeleteAccount;