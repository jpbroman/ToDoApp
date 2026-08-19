import "./Layout.css";
import { Link, Outlet } from "react-router-dom";

function Layout() {
  return (
    <div className="layout">
      <aside className="sidebar">
        <h2>Meny</h2>

        <nav>
        <Link to="/">Alla ToDos</Link>
        <Link to="/open">Öppna ToDos</Link>
        <Link to="/done">Klara ToDos</Link>
        <Link to="/todo/new">Lägg till ny</Link>
        </nav>
      </aside>

      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;

