import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

const storage = new Map<string, string>();

const localStorageMock = {
  getItem: vi.fn((key: string) => storage.get(key) ?? null),

  setItem: vi.fn((key: string, value: string) => {
    storage.set(key, value);
  }),

  removeItem: vi.fn((key: string) => {
    storage.delete(key);
  }),

  clear: vi.fn(() => {
    storage.clear();
  }),

  get length() {
    return storage.size;
  },

  key: vi.fn((index: number) => {
    return Array.from(storage.keys())[index] ?? null;
  }),
};

Object.defineProperty(globalThis, "localStorage", {
  value: localStorageMock,
  writable: true,
});

afterEach(() => {
  cleanup();
});
