"use client";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import AuthProvider from "@/components/providers/auth-provider";

type AppLayoutProps = {
  children: React.ReactNode;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
      refetchOnWindowFocus: false,
      retry: (failureCount, error: any) => {
        if (error?.response?.status === 401) return false;
        return failureCount < 1;
      },
      retryDelay: 1000,
    },
    mutations: {
      retry: 0,
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
      <QueryClientProvider client={queryClient}>
        <AuthProvider>{children}</AuthProvider>
      </QueryClientProvider>
    </>
  );
};

export default AppLayout;
