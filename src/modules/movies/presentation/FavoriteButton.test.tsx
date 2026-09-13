import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { FavoriteButton } from "./FavoriteButton";

describe("FavoriteButton", () => {
  it("labels itself as 'add' when not a favorite, and calls onToggle when clicked", async () => {
    const onToggle = vi.fn<() => void>();
    render(<FavoriteButton isFavorite={false} title="Inception" onToggle={onToggle} />);

    const button = screen.getByRole("button", { name: "Add Inception to favourites" });
    expect(button).toHaveAttribute("aria-pressed", "false");

    await userEvent.click(button);
    expect(onToggle).toHaveBeenCalledOnce();
  });

  it("labels itself as 'remove' when already a favorite", () => {
    render(<FavoriteButton isFavorite title="Inception" onToggle={() => {}} />);
    expect(screen.getByRole("button", { name: "Remove Inception from favourites" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });
});
