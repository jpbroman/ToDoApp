import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import ToDoPage from "./pages/ToDoPage";
import ToDoDetailPage from "./pages/ToDoDetailPage";
import ToDoFormPage from "./pages/ToDoFormPage";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import RegisterPage from "./pages/RegisterPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Publik route */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Skyddade routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>

            <Route path="/" element={<ToDoPage />} />

            <Route
              path="/done"
              element={<ToDoPage filter={"done"} />}
            />

            <Route
              path="/open"
              element={<ToDoPage filter={"open"} />}
            />

            <Route
              path="/todo/:id"
              element={<ToDoDetailPage />}
            />

            <Route
              path="/todo/new"
              element={<ToDoFormPage />}
            />

            <Route
              path="/todo/:id/edit"
              element={<ToDoFormPage />}
            />

          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
