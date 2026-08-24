import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Modal } from "@/components/ui/Modal";

describe("Modal", () => {
  it("centers the dialog on every viewport", () => {
    render(
      <Modal title="Обложка" onClose={() => undefined}>
        фото
      </Modal>,
    );

    const dialog = screen.getByRole("dialog", { name: "Обложка" });

    expect(dialog.parentElement).toHaveClass("items-center");
    expect(dialog.parentElement).not.toHaveClass("items-end");
    expect(dialog).toHaveClass("rounded-2xl");
  });
});
