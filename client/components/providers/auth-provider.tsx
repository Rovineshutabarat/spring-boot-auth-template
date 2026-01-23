"use client";
import { setAccessToken } from "@/services/config/api.client";
import { refreshAccessToken } from "@/services/config/refresh.client";
import { Role } from "@/types/entity/role";
import { AuthResponse } from "@/types/payload/response/auth.response";
import { usePathname } from "next/navigation";
import React from "react";

type AuthProviderContextState = {
  session: AuthResponse | null;
  setSession: (session: AuthResponse | null) => void;
  isAuthenticated: boolean;
  hasRoles: (roles: string[]) => boolean;
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
      setIsRefreshLoading(false);
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
  }, [pathname, setSession]);

  const hasRoles = React.useCallback(
    (roles: string[]): boolean => {
      if (!session?.user?.roles || roles.length === 0) {
        return false;
      }

      return session.user.roles.some((role: Role): boolean => {
        return roles.includes(role.name);
      });
    },
    [session],
  );

  const isAuthenticated = React.useMemo(
    () => Boolean(session?.accessToken && session?.user),
    [session],
  );

  return (
    <AuthProviderContext.Provider
      value={{
        session,
        setSession,
        isAuthenticated: isAuthenticated,
        hasRoles,
        isRefreshLoading,
      }}
    >
      {children}
    </AuthProviderContext.Provider>
  );
}
