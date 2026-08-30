import { afterEach, describe, expect, it, vi } from "vitest";
import { saveScheduleImage } from "@/utils/saveScheduleImage";

describe("saveScheduleImage", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("shares a file without waiting for canShare", async () => {
    const share = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", { share });

    const result = await saveScheduleImage(
      new Blob(["png"], { type: "image/png" }),
      "raspisanie-2026-09-01.png",
    );

    expect(result).toBe("shared");
    expect(share).toHaveBeenCalledWith({
      files: [expect.any(File)],
    });
  });

  it("does not download when the user closes the share sheet", async () => {
    const share = vi.fn().mockRejectedValue(Object.assign(new Error("dismiss"), { name: "AbortError" }));
    const open = vi.spyOn(window, "open").mockImplementation(() => null);
    vi.stubGlobal("navigator", { share });

    const result = await saveScheduleImage(
      new Blob(["png"], { type: "image/png" }),
      "raspisanie-2026-09-01.png",
    );

    expect(result).toBe("aborted");
    expect(open).not.toHaveBeenCalled();
  });

  it("opens the image on iPhone when share is unavailable", async () => {
    const open = vi.spyOn(window, "open").mockImplementation(() => null);
    vi.stubGlobal("navigator", {
      userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)",
      platform: "iPhone",
    });
    vi.stubGlobal("URL", {
      createObjectURL: () => "blob:schedule",
      revokeObjectURL: vi.fn(),
    });

    const result = await saveScheduleImage(
      new Blob(["png"], { type: "image/png" }),
      "raspisanie-2026-09-01.png",
    );

    expect(result).toBe("opened");
    expect(open).toHaveBeenCalledWith("blob:schedule", "_blank", "noopener");
  });

  it("downloads the file on desktop when sharing is unavailable", async () => {
    const click = vi.fn();
    const remove = vi.fn();
    const createElement = document.createElement.bind(document);

    vi.stubGlobal("URL", {
      createObjectURL: () => "blob:schedule",
      revokeObjectURL: vi.fn(),
    });
    vi.stubGlobal("navigator", {
      userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
      platform: "MacIntel",
      maxTouchPoints: 0,
    });
    vi.spyOn(document, "createElement").mockImplementation((tagName) => {
      if (tagName === "a") {
        return { href: "", download: "", click, remove } as HTMLAnchorElement;
      }

      return createElement(tagName);
    });
    vi.spyOn(document.body, "append").mockImplementation(() => undefined);

    const result = await saveScheduleImage(
      new Blob(["png"], { type: "image/png" }),
      "raspisanie-2026-09-01.png",
    );

    expect(result).toBe("downloaded");
    expect(click).toHaveBeenCalledOnce();
  });
});
