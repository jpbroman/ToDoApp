import { type SubmitEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./LoginPage.css";
import "../../api/ApiFetch";
import { apiFetch } from "../../api/ApiFetch";

function LoginPage() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    // Ta bort tidigare felmeddelande
    setError("");

    try {
      const response = await apiFetch(
        `/Auth/login`,
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
        let message = "Fel användare eller lösenord";

        try {
          const errorData = await response.json();

          if (errorData.message) {
            message = errorData.message;
          }
        } catch {
          // API:t returnerade inget JSON-svar
        }

        setError(message);
        return;
      }

      const data = await response.json();

      localStorage.setItem("token", data.token);

      console.log("Login lyckades!");
//      console.log("JWT sparad", data.token);

      // Gå till huvudmenyn / ToDo-listan
      navigate("/");
    } catch (error) {
      console.error("Fel vid login:", error);
      setError("Kunde inte kontakta servern");
    }
  }

  return (
    <div className="login-page">
      <div className="login-box">
        <div>
            <h1>ToDo App</h1>
        </div>
        <h2>Logga in</h2>

        <form onSubmit={handleSubmit}>

          <div className="login-field">
            <label htmlFor="username">
              Användarnamn
            </label>

            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
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
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          {error && (
            <p className="login-error">
              {error}
            </p>
          )}

          <button style={{ marginTop: "15px", marginBottom: "15px"}} type="submit">
            Logga in
          </button>
          <div>
            <Link to="/register">
                Registrera ny användare
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
