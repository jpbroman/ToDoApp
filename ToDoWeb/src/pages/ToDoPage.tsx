import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type ToDo from '../../models/ToDo';
import config from '../../config.json';
import "./ToDoPage.css";

function ToDoPage() {
    console.log('Home:');
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

  return (
    <div className="todo-page">
      <h1>ToDo</h1>
      <div className="todo-list">
        <div className="todo-row" style={{ margin: "0 0 4px 0", color: "#010102" }}>
          <div>Rubrik</div>
          <div>Skapad</div>
        </div>
        {todos.map((todo) => (
          <div className="todo-row" key={todo.id}>
            <div>
              <Link style={{ margin: "0 0 4px 0", color: "#007bff" }} to={`/todo/${todo.id}`}>
                {todo.heading}
              </Link>
            </div>

            <div>
              {new Date(todo.created).toLocaleDateString("sv-SE")}
            </div>

            <div>
              Klar: {todo.done ? "Ja" : "Nej"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ToDoPage;
