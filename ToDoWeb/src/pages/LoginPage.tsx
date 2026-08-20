import { useNavigate } from "react-router-dom";
import { useState } from "react";
import config from "../../config.json";
import "./LoginPage.css";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
        const response = await fetch(
        `${config.API_URL}/Auth/login`,
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
            throw new Error("Fel användarnamn eller lösenord");
        }

        const data = await response.json();

        localStorage.setItem("token", data.token);

        console.log("Login lyckades!");
        console.log("JWT sparad", localStorage.getItem("token"));

        navigate("/");
    } catch (error) {
        console.error("Login misslyckades:", error);
    }
  };

    return (
    <div className="login-page">
        <div className="login-box">
        <h1>Logga in</h1>

        <form className="login-form" onSubmit={handleSubmit}>

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
            />
            </div>

            <button
            className="login-button"
            type="submit"
            >
            Logga in
            </button>

        </form>
        </div>
    </div>
    );
}

export default LoginPage;