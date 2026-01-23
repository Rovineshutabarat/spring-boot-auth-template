"use client";

import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

type AuthGuardProps = {
  children: React.ReactNode;
  roles?: string[];
};

const AuthGuard = ({ children, roles }: AuthGuardProps) => {
  const { isAuthenticated, hasRoles, isRefreshLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isRefreshLoading) {
      if (!isAuthenticated) {
        router.push("/auth/login");
      } else if (roles && !hasRoles(roles)) {
        router.push("/unauthorized");
      }
    }
  }, [isRefreshLoading, isAuthenticated, roles, hasRoles, router]);

  if (isRefreshLoading || !isAuthenticated) return null;

  if (roles && !hasRoles(roles)) return null;

  return <>{children}</>;
};

export default AuthGuard;
