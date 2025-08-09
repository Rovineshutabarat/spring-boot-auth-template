"use client";
import React from "react";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";

type AuthGuardProps = {
  children: React.ReactNode;
  roles: string[];
};

const AuthGuard = ({ children, roles }: AuthGuardProps) => {
  const { session, isLoading } = useAuth();
  const router = useRouter();

  const isAuthorized =
    session?.user?.roles?.some((role) => roles.includes(role.name)) ?? false;

  React.useEffect(() => {
    if (!isLoading && !isAuthorized) {
      router.replace("/unauthorized");
    }
  }, [isLoading, isAuthorized, router]);

  if (isLoading) return <p>Loading..</p>;
  if (!isAuthorized) return null;

  return <>{children}</>;
};

export default AuthGuard;
