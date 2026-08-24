import { shouldRegisterServiceWorker } from "@/utils/shouldRegisterServiceWorker";

export const registerServiceWorker = () => {
  if (!("serviceWorker" in navigator)) {
    return;
  }

  if (!shouldRegisterServiceWorker(window.location.hostname)) {
    return;
  }

  const register = () => {
    void navigator.serviceWorker.register("/sw.js");
  };

  if (document.readyState === "complete") {
    register();
  } else {
    window.addEventListener("load", register, { once: true });
  }
};
