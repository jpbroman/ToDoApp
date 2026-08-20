import { describe, expect, it, vi } from "vitest";
import { createElement } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { MemoryRouter } from "react-router-dom";
import ToDoPage from "./ToDoPage";
import { apiFetch } from "../../api/ApiFetch";

vi.mock("../../api/ApiFetch", () => ({
  apiFetch: vi.fn(),
}));

describe("ToDoPage", () => {
  it("ska visa ToDos från API:t", async () => {
    vi.mocked(apiFetch).mockResolvedValue({
      ok: true,
      json: async () => [
        {
          id: 1,
          heading: "Handla mat",
          note: "Mjölk och bröd",
          created: "2026-08-20",
          doDate: "2026-08-21",
          done: false,
        },
        {
          id: 2,
          heading: "Gå ut med hunden",
          note: "En lång promenad",
          created: "2026-08-20",
          doDate: "2026-08-20",
          done: true,
        },
      ],
    } as Response);

    render(createElement(MemoryRouter, null, createElement(ToDoPage)));

    expect(await screen.findByText("Handla mat"))
      .toBeInTheDocument();

    expect(screen.getByText("Gå ut med hunden"))
      .toBeInTheDocument();
  });

  it("ska bara visa klara ToDos med filter done", async () => {
    vi.mocked(apiFetch).mockResolvedValue({
        ok: true,
        json: async () => [
        {
            id: 1,
            heading: "Handla mat",
            note: "Mjölk och bröd",
            created: "2026-08-20",
            doDate: "2026-08-21",
            done: false,
        },
        {
            id: 2,
            heading: "Gå ut med hunden",
            note: "En lång promenad",
            created: "2026-08-20",
            doDate: "2026-08-20",
            done: true,
        },
        ],
    } as Response);

    render(
      createElement(
        MemoryRouter,
        null,
        createElement(ToDoPage, { filter: "done" })
      )
    );

    expect(
        await screen.findByText("Gå ut med hunden")
    ).toBeInTheDocument();

    expect(
        screen.queryByText("Handla mat")
    ).not.toBeInTheDocument();
    });
    
    it("ska bara visa öppna ToDos med filter open", async () => {
        vi.mocked(apiFetch).mockResolvedValue({
            ok: true,
            json: async () => [
            {
                id: 1,
                heading: "Handla mat",
                note: "Mjölk och bröd",
                created: "2026-08-20",
                doDate: "2026-08-21",
                done: false,
            },
            {
                id: 2,
                heading: "Gå ut med hunden",
                note: "En lång promenad",
                created: "2026-08-20",
                doDate: "2026-08-20",
                done: true,
            },
            ],
        } as Response);

        render(
          createElement(
            MemoryRouter,
            null,
            createElement(ToDoPage, { filter: "open" })
          )
        );

        expect(
            await screen.findByText("Handla mat")
        ).toBeInTheDocument();

        expect(
            screen.queryByText("Gå ut med hunden")
        ).not.toBeInTheDocument();
    });

     it("ska skapa rätt länk till detaljsidan", async () => {
        vi.mocked(apiFetch).mockResolvedValue({
            ok: true,
            json: async () => [
            {
                id: 9,
                heading: "Testa länken",
                note: "Anteckning",
                created: "2026-08-20",
                doDate: "2026-08-21",
                done: false,
            },
            ],
        } as Response);

        render(
          createElement(
            MemoryRouter,
            null,
            createElement(ToDoPage)
          )
        );

        const link = await screen.findByRole("link", {
            name: "Testa länken",
        });

        expect(link).toHaveAttribute("href", "/todo/9");
    });

    it("ska inte visa några ToDos när API-anropet misslyckas", async () => {
        vi.mocked(apiFetch).mockResolvedValue({
            ok: false,
            status: 500,
        } as Response);

        render(
            createElement(
            MemoryRouter,
            null,
            createElement(ToDoPage)
            )
        );

        await waitFor(() => {
            expect(
            screen.queryByRole("link", { name: "Testa länken" })
            ).not.toBeInTheDocument();
        });
    });
});
