import { useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import "./Layout.css";
import { isLoggedIn, logout } from "../Auth";


function Layout() {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(isLoggedIn());

  useEffect(() => {
    function handleLogout() {
        setLoggedIn(false);
        navigate("/login");
    }

    window.addEventListener("auth-logout", handleLogout);

    return () => {
        window.removeEventListener("auth-logout", handleLogout);
    };
  }, [navigate]);

  function handleLogout() {
    logout();
    setLoggedIn(false);
    navigate("/login");
  }

  return (
    <div className="layout">
      <aside className="sidebar">
        <h2>Meny</h2>

        <nav>
          <Link to="/">Lista alla</Link>

          <Link to="/done">
            Lista klara
          </Link>

          <Link to="/open">
            Lista öppna
          </Link>

          <Link to="/todo/new">
            Lägg till ny
          </Link>

        </nav>

        <div className="login-menu">
          {loggedIn ? (
            <button onClick={handleLogout}>
              Logga ut
            </button>
          ) : (
            <Link to="/login">
              Logga in
            </Link>
          )}
        </div>
      </aside>

      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;

