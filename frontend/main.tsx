import "./index.css";

import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Internal components
import { Toaster } from "@/components/ui/toaster.tsx";
import { WalletProvider } from "@/components/WalletProvider.tsx";
import { RouterProvider } from "react-router-dom";
import router from "@/utils/router";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <WalletProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Toaster />
      </QueryClientProvider>
    </WalletProvider>
  </React.StrictMode>,
);
