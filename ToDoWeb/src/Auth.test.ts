import { describe, expect, it, beforeEach } from "vitest";
import { isLoggedIn, logout } from "./Auth";

describe("auth", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("ska vara utloggad när token saknas", () => {
    expect(isLoggedIn()).toBe(false);
  });

  it("ska vara inloggad när token finns", () => {
    localStorage.setItem("token", "test-token");

    expect(isLoggedIn()).toBe(true);
  });

  it("logout ska ta bort token", () => {
    localStorage.setItem("token", "test-token");

    logout();

    expect(isLoggedIn()).toBe(false);
  });
});
