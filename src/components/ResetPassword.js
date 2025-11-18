import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import "./AuthForms.css";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (newPassword !== confirmNewPassword) {
      setError("Lösenorden matchar inte.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/token/confirm-reset", {
        email,
        token,
        newPassword,
        confirmNewPassword
      });

      setMessage("Ditt lösenord har uppdaterats!");
      setTimeout(() => navigate("/authenticate/loggain"), 2500);
    } catch (err) {
      console.error(err);
      setError("Det gick inte att återställa lösenordet. Länken kan ha gått ut.");
    } finally {
      setLoading(false);
    }
  };

  if (!token || !email) {
    return (
      <div className="form-container">
        <h2>Ogiltig länk</h2>
        <p>Länken för återställning är ogiltig eller ofullständig.</p>
      </div>
    );
  }

  return (
    <div className="form-container">
      <h2>Välj nytt lösenord</h2>
      <fieldset>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nytt lösenord</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label>Upprepa nytt lösenord</label>
          <input
            type="password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        {message && <div className="form-success">{message}</div>}
        {error && <div className="form-error" role="alert">{error}</div>}

        <div className="submit-row">
          <button type="submit" disabled={loading}>
            {loading ? "Uppdaterar..." : "Slutför"}
          </button>
        </div>
      </form>
      </fieldset>
    </div>
  );
}

export default ResetPassword;
