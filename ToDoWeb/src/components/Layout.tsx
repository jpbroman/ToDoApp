import "./Layout.css";
import { Link, Outlet } from "react-router-dom";

function Layout() {
  return (
    <div className="layout">
      <aside className="sidebar">
        <h2>Meny</h2>

        <nav>
          <Link to="/">Hem</Link>
          <Link to="/todo/new">
            Lägg till
          </Link>
          <button>Lista öppna</button>
          <button>Lista klara</button>
        </nav>
      </aside>

      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;

