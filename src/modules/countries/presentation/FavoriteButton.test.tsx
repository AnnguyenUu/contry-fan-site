import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { FavoriteButton } from "./FavoriteButton";

describe("FavoriteButton", () => {
  it("labels itself as 'add' when not a favorite, and calls onToggle when clicked", async () => {
    const onToggle = vi.fn<() => void>();
    render(<FavoriteButton isFavorite={false} name="Canada" onToggle={onToggle} />);

    const button = screen.getByRole("button", { name: "Add Canada to favourites" });
    expect(button).toHaveAttribute("aria-pressed", "false");

    await userEvent.click(button);
    expect(onToggle).toHaveBeenCalledOnce();
  });

  it("labels itself as 'remove' when already a favorite", () => {
    render(<FavoriteButton isFavorite name="Canada" onToggle={() => {}} />);
    expect(screen.getByRole("button", { name: "Remove Canada from favourites" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });
});
