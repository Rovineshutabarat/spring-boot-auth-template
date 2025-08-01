"use client";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";

type AppLayoutProps = {
  children: React.ReactNode;
};

const queryClient = new QueryClient();
const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      <Toaster
        visibleToasts={4}
        expand={true}
        // theme={theme as "dark" | "light"}
        richColors={true}
      />
    </>
  );
};

export default AppLayout;
