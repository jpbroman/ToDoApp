import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type ToDo from "../../models/ToDo";
import config from "../../config.json";
import "./ToDoPage.css";

interface ToDoPageProps {
  filter?: "all" | "done" | "open";
}

function ToDoPage({ filter = "all" }: ToDoPageProps) {
  const [todos, setTodos] = useState<ToDo[]>([]);

  useEffect(() => {
    async function fetchTodos() {
      const url = `${config.API_URL}/ToDos`;

      try {
        const response = await fetch(url);

        if (response.ok) {
          const data = await response.json();
          setTodos(data);
        }
      } catch (err) {
        console.error("Fel vid hämtning:", err);
      }
    }

    fetchTodos();
  }, []);

  const visibleTodos = todos.filter((todo) => {
    if (filter === "done") {
      return todo.done;
    }

    if (filter === "open") {
      return !todo.done;
    }

    return true;
  });

  return (
    <div className="todo-page">
      <h1>
        {filter === "done"
          ? "Klara ToDos"
          : filter === "open"
            ? "Öppna ToDos"
            : "Alla ToDos"}
      </h1>

      <div className="todo-list">
        {visibleTodos.map((todo) => (
          <div className="todo-row" key={todo.id}>
            <div>
              <Link to={`/todo/${todo.id}`}>{todo.heading}</Link>
            </div>

            <div>{todo.created}</div>

            <div>Klar: {todo.done ? "Ja" : "Nej"}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ToDoPage;

