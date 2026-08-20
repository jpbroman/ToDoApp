import { type SubmitEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./LoginPage.css";
import { apiFetch } from "../../api/ApiFetch";

function RegisterPage() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");

    if (password !== confirmPassword) {
      setError("Lösenorden är inte lika");
      return;
    }

    try {
      const response = await apiFetch(
        `/Auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            password,
          }),
        }
      );

      if (!response.ok) {
        const data = await response.json();

        setError(
          data.message ?? "Kunde inte registrera användaren"
        );

        return;
      }

      // Registreringen lyckades. Tillbaks till login.
      navigate("/login");

    } catch (error) {
      console.error("Fel vid registrering:", error);
      setError("Kunde inte kontakta servern");
    }
  }

  return (
    <div className="login-page">
      <div className="login-box">
        <h1>Registrera användare</h1>

        <form onSubmit={handleSubmit}>

          <div className="login-field">
            <label htmlFor="username">
              Användarnamn
            </label>

            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) =>
                setUsername(e.target.value)
              }
              required
            />
          </div>

          <div className="login-field">
            <label htmlFor="password">
              Lösenord
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
            />
          </div>

          <div className="login-field">
            <label htmlFor="confirmPassword">
              Bekräfta lösenord
            </label>

            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(e.target.value)
              }
              required
            />
          </div>

          {error && (
            <p className="login-error">
              {error}
            </p>
          )}

          <button style={{ marginTop: "15px", marginBottom: "15px"}} type="submit">
            Registrera
          </button>
        </form>

        <div className="register-link">
          <Link to="/login">
            Tillbaka till Logga in
          </Link>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
