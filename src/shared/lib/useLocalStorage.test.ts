import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useLocalStorage } from "./useLocalStorage";

describe("useLocalStorage", () => {
  it("returns the initial value when nothing is stored", () => {
    const { result } = renderHook(() => useLocalStorage("test-key", "default"));
    expect(result.current[0]).toBe("default");
  });

  it("reads a previously persisted value on mount", () => {
    window.localStorage.setItem("test-key", JSON.stringify("stored"));
    const { result } = renderHook(() => useLocalStorage("test-key", "default"));
    expect(result.current[0]).toBe("stored");
  });

  it("persists updates to localStorage", () => {
    const { result } = renderHook(() => useLocalStorage("test-key", "default"));

    act(() => {
      result.current[1]("updated");
    });

    expect(result.current[0]).toBe("updated");
    expect(window.localStorage.getItem("test-key")).toBe(JSON.stringify("updated"));
  });

  it("supports functional updates", () => {
    const { result } = renderHook(() => useLocalStorage("counter", 1));

    act(() => {
      result.current[1]((previous) => previous + 1);
    });

    expect(result.current[0]).toBe(2);
  });

  it("degrades to in-memory state when localStorage.setItem throws", () => {
    const setItemSpy = vi.spyOn(window.localStorage.__proto__, "setItem").mockImplementation(() => {
      throw new Error("quota exceeded");
    });

    const { result } = renderHook(() => useLocalStorage("test-key", "default"));
    act(() => {
      result.current[1]("updated");
    });

    expect(result.current[0]).toBe("updated");

    setItemSpy.mockRestore();
  });
});
