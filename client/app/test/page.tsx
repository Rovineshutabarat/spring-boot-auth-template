"use client";

import React from "react";
import { useAuth } from "@/hooks/use-auth";
import AuthGuard from "@/components/ui/auth-guard";

const Page = () => {
  const { session } = useAuth();
  return <AuthGuard roles={["ROLE_USER"]}>{session?.user.email}</AuthGuard>;
};

export default Page;
