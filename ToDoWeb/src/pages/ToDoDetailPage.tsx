import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type ToDo from "../../models/ToDo";
import config from '../../config.json';
import "./ToDoPage.css";

function ToDoDetailPage() {
    const { id } = useParams();
  const navigate = useNavigate();
    const [todo, setTodo] = useState<ToDo | null>(null);
    const url = `${config.API_URL}/ToDos/${id}`;

    useEffect(() => {
    fetch(url)
      .then((response) => response.json())
      .then((data: ToDo) => {
        setTodo(data);
      });
  }, [id, url]);

  async function submitTodo(updatedTodo: ToDo) {
  const url = `${config.API_URL}/ToDos/${id}`;

  console.log("Skickar:", updatedTodo);

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedTodo),
    });

    if (!response.ok) {
      throw new Error("Något gick fel vid sparningen");
    }

    // Backend returnerar inget innehåll
    setTodo(updatedTodo);

  } catch (error) {
    console.error("Fel vid sparning:", error);
  }
}

const toggleTodo = (): void => {
  console.log("Toggle Ja/Nej");

  if (!todo) return;

  const updatedTodo: ToDo = {
    ...todo,
    done: !todo.done,
  };

  setTodo(updatedTodo);

  submitTodo(updatedTodo);
};

if (!todo) {
  return <p>Laddar...</p>;
}

    async function handleDelete(id: number): Promise<void> {
      if (!window.confirm("Är du säker på att du vill ta bort uppgiften?")) {
        return;
      }

      try {
        const response = await fetch(`${config.API_URL}/ToDos/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Något gick fel vid borttagningen");
        }

        navigate("/");
      } catch (error) {
        console.error("Fel vid borttagning:", error);
      }
    }

  return (
    <div className="todo-detail">
      <h1>{todo.heading}</h1>
      <p>{todo.note}</p>

      <div className="todo-detail-row">
        <div className="todo-detail-label">Skapad:</div>
          <div>
           {new Date(todo.created).toLocaleDateString("sv-SE")}
          </div>
      </div>
      <div className="todo-detail-row">
        <div className="todo-detail-label">Klar senast:</div>
          <div>
           {new Date(todo.doDate).toLocaleDateString("sv-SE")}
          </div>
      </div>
      <div className="todo-detail-row">
        <div className="todo-detail-label">Klar:</div>
          <div>
             Klar: {todo.done ? "Ja" : "Nej"}
          </div>
      </div>
        {/* Åtgärdsknappar */}
        <div style={{ display: 'flex', gap: '8px' }}>
        <button 
            onClick={toggleTodo} 
            style={{ padding: '6px 12px', backgroundColor: '#f0f0f0', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer', fontSize: '0.9rem' }}
        >
            Klarmarkera
        </button>
        <Link
            to={`/todo/${todo.id}/edit`}
            className="detail-button"
            >
            Redigera
        </Link>
        <button 
            onClick={() => handleDelete(todo.id)} 
            style={{ padding: '6px 12px', backgroundColor: '#fff', color: '#dc3545', border: '1px solid #dc3545', borderRadius: '4px', cursor: 'pointer', fontSize: '0.9rem' }}
        >
            Ta bort
        </button>
        </div>
    </div>
  );
}

export default ToDoDetailPage;
