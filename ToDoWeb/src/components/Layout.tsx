import "./Layout.css";
import { Link, Outlet } from "react-router-dom";

function Layout() {
  return (
    <div className="layout">
      <aside className="sidebar">
        <h2>Meny</h2>

        <nav>
            <Link to="/">Alla</Link>
            <Link to="/open">Öppna</Link>
            <Link to="/done">Lista klara</Link>

        </nav>
      </aside>

      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;

