import { useState } from "react";
import type ToDo from "../../models/ToDo";
import "./ToDoForm.css";

interface ToDoFormProps {
  todo?: ToDo;
  onSave: (todo: ToDo) => void;
  onCancel: () => void;
}

function ToDoForm({
  todo,
  onSave,
  onCancel,
}: ToDoFormProps) {
  const [heading, setHeading] = useState(todo?.heading ?? "");
  const [note, setNote] = useState(todo?.note ?? "");

  const [doDate, setDoDate] = useState(
    todo?.doDate
        ? new Date(todo.doDate).toISOString().split("T")[0]
        : ""
  );

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();

    const formTodo: ToDo = {
        id: todo?.id ?? 0,
        heading,
        note,
        created: todo?.created ?? new Date().toISOString().split("T")[0],
        doDate,
        done: todo?.done ?? false,
    };

    onSave(formTodo);
    };

  return (
    <form onSubmit={handleSubmit} className="todo-form">
      <h1>{todo ? "Redigera ToDo" : "Ny ToDo"}</h1>

      <div className="form-row">
        <label htmlFor="heading">Rubrik</label>
        <input
          id="heading"
          type="text"
          value={heading}
          onChange={(e) => setHeading(e.target.value)}
          required
        />
      </div>

      <div className="form-row">
        <label htmlFor="note">Anteckning</label>
        <textarea
          id="note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>

      <div className="form-row">
        <label htmlFor="doDate">Datum</label>
        <input
          id="doDate"
          type="date"
          value={doDate}
          onChange={(e) => setDoDate(e.target.value)}
          required
        />
      </div>

      <div className="form-buttons">
        <button type="submit">Spara</button>

        <button type="button" onClick={onCancel}>
          Avbryt
        </button>
      </div>
    </form>
  );
}

export default ToDoForm;
