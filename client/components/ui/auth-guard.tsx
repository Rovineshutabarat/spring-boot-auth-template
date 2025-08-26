"use client";

import React, { Fragment } from "react";
import { useAuth } from "@/hooks/use-auth";
import Unauthorized from "next/dist/client/components/builtin/unauthorized";

type AuthGuardProps = {
  children: React.ReactNode;
  roles: string[];
};

const AuthGuard = ({ children, roles }: AuthGuardProps) => {
  const { hasPermission, isRefreshLoading } = useAuth();

  if (!isRefreshLoading && !hasPermission(roles)) return <Unauthorized />;

  if (isRefreshLoading) return null;

  return <Fragment>{children}</Fragment>;
};

export default AuthGuard;
