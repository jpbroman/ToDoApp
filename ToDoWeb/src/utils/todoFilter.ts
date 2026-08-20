import type ToDo from "../../models/ToDo";

export function filterTodos(
  todos: ToDo[],
  filter: "all" | "done" | "open"
): ToDo[] {
  if (filter === "done") {
    return todos.filter((todo) => todo.done);
  }

  if (filter === "open") {
    return todos.filter((todo) => !todo.done);
  }

  return todos;
}
