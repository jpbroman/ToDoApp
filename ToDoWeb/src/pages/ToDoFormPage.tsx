import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type ToDo from "../../models/ToDo";
import config from "../../config.json";
import ToDoForm from "../components/ToDoForm";

function ToDoFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [todo, setTodo] = useState<ToDo | undefined>();
  const [loading, setLoading] = useState(true);

  const isEdit = Boolean(id);

  useEffect(() => {
    async function fetchTodo() {
      // Ny Todo
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${config.API_URL}/ToDos/${id}`
        );

        if (!response.ok) {
          throw new Error("Kunde inte hämta Todo");
        }

        const data: ToDo = await response.json();

        console.log("Todo för redigering:", data);

        setTodo(data);
      } catch (error) {
        console.error("Fel vid hämtning:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchTodo();
  }, [id]);

  if (loading) {
    return <p>Laddar...</p>;
  }

  // Om vi redigerar men inte hittade Todo
  if (isEdit && !todo) {
    return <p>Kunde inte hitta Todo.</p>;
  }

  async function handleSave(updatedTodo: ToDo) {
    const url = isEdit
      ? `${config.API_URL}/ToDos/${id}`
      : `${config.API_URL}/ToDos`;

    const response = await fetch(url, {
      method: isEdit ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedTodo),
    });

    if (!response.ok) {
      console.error("Kunde inte spara Todo");
      return;
    }

    navigate(isEdit ? `/todo/${id}` : "/");
  }

  return (
    <ToDoForm
      todo={todo}
      onSave={handleSave}
      onCancel={() =>
        navigate(isEdit ? `/todo/${id}` : "/")
      }
    />
  );
}

export default ToDoFormPage;
