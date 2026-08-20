import { describe, expect, it, beforeEach, vi } from "vitest";
import { apiFetch } from "../api/ApiFetch"

describe("apiFetch", () => {

  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("ska skicka med JWT-token", async () => {
    localStorage.setItem("token", "test-token");

    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(
        new Response(null, { status: 200 })
      );

    await apiFetch("/ToDos");

    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:5163/api/ToDos",
      expect.objectContaining({
        headers: expect.any(Headers),
      })
    );

    const options = fetchMock.mock.calls[0][1];

    const headers = options?.headers as Headers;

    expect(headers.get("Authorization"))
      .toBe("Bearer test-token");
  });


  it("ska inte skicka Authorization utan token", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(
        new Response(null, { status: 200 })
      );

    await apiFetch("/ToDos");

    const options = fetchMock.mock.calls[0][1];

    const headers = options?.headers as Headers;

    expect(headers.get("Authorization"))
      .toBeNull();
  });

  it("ska ta bort token vid 401", async () => {
    localStorage.setItem("token", "test-token");

    vi.spyOn(globalThis, "fetch")
      .mockResolvedValue(
        new Response(null, { status: 401 })
      );

    await apiFetch("/ToDos");

    expect(localStorage.getItem("token")).toBeNull();
  });

});
