import { useState } from "react";
import { useAuth } from "../context/authContext.js";
import { authenticate } from "../api/auth";
import { useNavigate } from "react-router-dom";
import "./registerForm.css"


const SignInForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = await authenticate(email, password);
      login(userData); // save token + user
      navigate("/privat");
    } catch (err) {
      console.error("Login failed", err);
      alert("Login failed");
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
        type="text"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
    </div>
    <div className="form-group">
        <label>Lösenord</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
    </div>
    <div className="submit-row">
      <button type="submit">Sign In</button>
      <p>Har du inget konto? {""}
        <a className="link" href="/authenticate/register">Registrera dig!</a></p>
        <p>Glömt ditt lösenord? {""}
        <a className="link" href="/">Klicka här</a></p>
    </div>
    </form>

    </fieldset>

    </div>
  );
};

export default SignInForm;
