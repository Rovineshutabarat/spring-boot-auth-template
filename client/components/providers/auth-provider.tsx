"use client";
import React from "react";
import { AuthResponse } from "@/types/payload/response/auth.response";
import { setAccessToken } from "@/services/config/api.client";
import { refreshAccessToken } from "@/services/config/refresh.client";
import { Role } from "@/types/entity/role";
import { usePathname } from "next/navigation";

type AuthProviderContextState = {
  session: AuthResponse | null;
  setSession: (session: AuthResponse | null) => void;
  isAuthenticated: boolean;
  hasPermission: (roles: string[]) => boolean;
  isRefreshLoading: boolean;
};

export const AuthProviderContext = React.createContext<
  AuthProviderContextState | undefined
>(undefined);

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, setSessionState] = React.useState<AuthResponse | null>(null);
  const [isRefreshLoading, setIsRefreshLoading] = React.useState<boolean>(true);
  const pathname = usePathname();

  const setSession = React.useCallback((response: AuthResponse | null) => {
    setSessionState(response);
    setAccessToken(response?.accessToken ?? null);
  }, []);

  React.useEffect(() => {
    if (pathname.startsWith("/auth")) {
      return;
    }
    (async () => {
      try {
        const response = await refreshAccessToken();
        setSession(response);
      } catch {
        setSession(null);
      } finally {
        setIsRefreshLoading(false);
      }
    })();
  }, [setSession]);

  const hasPermission = React.useCallback(
    (permissions: string[]): boolean => {
      if (!session?.user?.roles || permissions.length === 0) {
        return false;
      }

      return session.user.roles.some((role: Role): boolean => {
        return permissions.includes(role.name);
      });
    },
    [session],
  );

  const isAuthenticated = React.useMemo(
    () => Boolean(session?.accessToken && session?.user),
    [session],
  );

  if (isRefreshLoading) return null;

  return (
    <AuthProviderContext.Provider
      value={{
        session,
        setSession,
        isAuthenticated: isAuthenticated,
        hasPermission,
        isRefreshLoading,
      }}
    >
      {children}
    </AuthProviderContext.Provider>
  );
}
