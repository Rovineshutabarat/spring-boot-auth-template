"use client";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";

type AppLayoutProps = {
  children: React.ReactNode;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
      refetchOnWindowFocus: false,
      retry: 2,
      retryDelay: 1000,
    },
  },
});

const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <>
      <Toaster
        visibleToasts={4}
        expand={true}
        // theme={theme as "dark" | "light"}
        richColors={true}
      />
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </>
  );
};

export default AppLayout;
