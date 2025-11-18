import { useState } from "react";
import api from "../api/axiosInstance"; // se till att denna finns
import "./AuthForms.css";

function RequestResetPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      const res = await api.post("/token/request-reset", { email: email.trim() });
      
      setMessage(
        res.data?.message ||
        "Om e-postadressen finns registrerad har ett återställningsmail skickats."
      );
      setEmail("");
    } catch (err) {
      console.error("Fel vid återställning:", err);
      setError("Ett fel uppstod. Försök igen senare.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Återställ lösenord</h2>
      <fieldset>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>E-postadress</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              disabled={loading}
              placeholder="namn@exempel.se"
            />
          </div>

          {message && <div className="form-success">{message}</div>}
          {error && <div className="form-error" role="alert">{error}</div>}

          <div className="submit-row">
            <button type="submit" disabled={loading}>
              {loading ? "Skickar..." : "Återställ lösenord"}
            </button>
            <p>
              <br />
              Har du redan ett konto?{" "}
              <a className="link" href="/authenticate/loggain">
                Logga in!
              </a>
            </p>
          </div>
        </form>
      </fieldset>
    </div>
  );
}

export default RequestResetPassword;
