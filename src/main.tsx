import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router";
import App from "./App";
import { createQueryClient } from "@/lib/createQueryClient";
import { registerServiceWorker } from "@/lib/registerServiceWorker";
import { restoreQueryCache } from "@/lib/restoreQueryCache";
import { subscribeQueryPersistence } from "@/lib/subscribeQueryPersistence";
import "./styles/index.css";

const queryClient = createQueryClient();

const boot = async () => {
  await restoreQueryCache(queryClient);
  subscribeQueryPersistence(queryClient);
  registerServiceWorker();

  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </QueryClientProvider>
    </React.StrictMode>,
  );
};

void boot();
