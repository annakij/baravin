import { useState } from "react";
import { useAuth } from "../context/authContext.js";
import { authenticate } from "../api/auth.js";
import { useNavigate } from "react-router-dom";
import "./AuthForms.css"


const SignInForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const userData = await authenticate(email.trim(), password);
      // userData should contain jwtToken and user info (or at least user info if server sets refresh cookie)
      login(userData); // save token (in-memory) + user via context
      navigate("/privat");
    } catch (err) {
      console.error("Login failed", err);
      setError("Inloggningen misslyckades. Kontrollera e-post och lösenord.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Logga in</h2>
      <fieldset>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>E-post</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label>Lösenord</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              disabled={loading}
            />
          </div>

          {error && <div className="form-error" role="alert">{error}</div>}

          <div className="submit-row">
            <button type="submit" disabled={loading}>
              {loading ? "Loggar in..." : "Logga in"}
            </button>
            <p><br/>Har du inget konto?{" "}
              <a className="link" href="/authenticate/registrera">Registrera dig!</a>
            </p>
            <p>Glömt ditt lösenord?{" "}
              <a className="link" href="/authenticate/request-reset">Klicka här</a>
            </p>
          </div>
        </form>
      </fieldset>
    </div>
  );
};

export default SignInForm;
