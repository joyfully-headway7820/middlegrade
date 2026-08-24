import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const pngSize = (path: string) => {
  const buf = readFileSync(path);

  expect(buf.subarray(0, 8)).toEqual(
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  );

  return {
    width: buf.readUInt32BE(16),
    height: buf.readUInt32BE(20),
  };
};

describe("PWA icons", () => {
  it("exposes a square PNG as the iPhone home-screen icon", () => {
    const html = readFileSync(join(root, "index.html"), "utf8");
    const size = pngSize(join(root, "public/apple-touch-icon.png"));

    expect(html).toContain('rel="apple-touch-icon"');
    expect(html).toContain('href="/apple-touch-icon.png"');
    expect(size).toEqual({ width: 180, height: 180 });
  });

  it("declares PNG icons with the sizes the install prompt expects", () => {
    const manifest = JSON.parse(
      readFileSync(join(root, "public/manifest.webmanifest"), "utf8"),
    ) as {
      icons: Array<{ src: string; sizes: string; type: string }>;
    };

    expect(manifest.icons).toEqual([
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ]);
    expect(pngSize(join(root, "public/icon-192.png"))).toEqual({
      width: 192,
      height: 192,
    });
    expect(pngSize(join(root, "public/icon-512.png"))).toEqual({
      width: 512,
      height: 512,
    });
  });
});
