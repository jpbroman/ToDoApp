import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import ToDoPage from "./pages/ToDoPage";
import ToDoDetailPage from "./pages/ToDoDetailPage";
import ToDoFormPage from "./pages/ToDoFormPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route
            path="/"
            element={<ToDoPage filter="all" />}
          />

          <Route
            path="/done"
            element={<ToDoPage filter="done" />}
          />

          <Route
            path="/open"
            element={<ToDoPage filter="open" />}
          />
          <Route path="/todo/:id" element={<ToDoDetailPage />} />

          <Route path="/todo/new" element={<ToDoFormPage />} />
          <Route path="/todo/:id/edit" element={<ToDoFormPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
