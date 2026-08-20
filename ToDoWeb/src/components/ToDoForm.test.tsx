import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ToDoForm from "./ToDoForm";


describe("ToDoForm", () => {
  it("ska visa formulärets fält", () => {
    render(
      <ToDoForm
        onSave={vi.fn()}
        onCancel={vi.fn()}
      />
    );

    expect(screen.getByLabelText("Rubrik")).toBeTruthy();
    expect(screen.getByLabelText("Anteckning")).toBeTruthy();
    expect(screen.getByLabelText("Datum")).toBeTruthy();

    expect(screen.getByRole("button", { name: "Spara" }))
      .toBeTruthy();

    expect(screen.getByRole("button", { name: "Avbryt" }))
      .toBeTruthy();
  });

  it("ska skicka formulärdata när man klickar Spara", async () => {
    const onSave = vi.fn();

    const user = userEvent.setup();

    render(
      <ToDoForm
        onSave={onSave}
        onCancel={vi.fn()}
      />
    );

    await user.type(
      screen.getByLabelText("Rubrik"),
      "Testa Vitest"
    );

    await user.type(
      screen.getByLabelText("Anteckning"),
      "Min testanteckning"
    );

    await user.type(
      screen.getByLabelText("Datum"),
      "2026-09-01"
    );

    await user.click(
      screen.getByRole("button", { name: "Spara" })
    );

    expect(onSave).toHaveBeenCalledTimes(1);

    expect(onSave).toHaveBeenCalledWith({
      id: 0,
      heading: "Testa Vitest",
      note: "Min testanteckning",
      created: expect.any(String),
      doDate: "2026-09-01",
      done: false,
    });
  });
});
