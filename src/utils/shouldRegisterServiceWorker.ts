export const shouldRegisterServiceWorker = (hostname: string) =>
  hostname !== "localhost" && hostname !== "127.0.0.1";
