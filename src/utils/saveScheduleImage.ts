const isAppleTouch = () =>
  /iP(hone|ad|od)/.test(navigator.userAgent) ||
  (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
};

export const saveScheduleImage = async (blob: Blob, filename: string) => {
  const file = new File([blob], filename, { type: "image/png" });

  if (typeof navigator.share === "function") {
    try {
      await navigator.share({ files: [file] });
      return "shared" as const;
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        return "aborted" as const;
      }
    }
  }

  if (isAppleTouch()) {
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank", "noopener");
    return "opened" as const;
  }

  downloadBlob(blob, filename);
  return "downloaded" as const;
};
