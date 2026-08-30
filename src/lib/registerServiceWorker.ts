export const registerServiceWorker = () => {
  if (!("serviceWorker" in navigator)) {
    return;
  }

  const register = () => {
    void navigator.serviceWorker.register("/sw.js", { type: "module" });
  };

  if (document.readyState === "complete") {
    register();
  } else {
    window.addEventListener("load", register, { once: true });
  }
};
