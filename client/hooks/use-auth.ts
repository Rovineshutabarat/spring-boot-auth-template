import { LoginRequest } from "@/types/payload/request/login.request";
import { RegisterRequest } from "@/types/payload/request/register.request";
import { useMutation } from "@tanstack/react-query";
import { AuthService } from "@/services/auth.service";
import { toast } from "sonner";
import { ErrorResponse } from "@/types/payload/response/common/error.response";
import { useRouter } from "next/navigation";
import { EmailRequest } from "@/types/payload/request/email.request";
import { OneTimePasswordRequest } from "@/types/payload/request/otp.request";
import { UpdatePasswordRequest } from "@/types/payload/request/update.password.request";
import React from "react";
import { AuthProviderContext } from "@/components/providers/auth-provider";
import { UseAuth } from "@/types/use.auth";

const ROUTES = {
  HOMEPAGE: "/",
  LOGIN: "/auth/login",
  VERIFY_ACCOUNT: "/auth/verify-account",
  CHANGE_PASSWORD: "/auth/change-password",
} as const;

const ERROR_MESSAGE = {
  GENERIC: "Something went wrong.",
  INVALID_CODE: "Invalid or expired code. Please try again.",
  LOGOUT_FAILED: "Failed to logout.",
  PASSWORD_CHANGE_FAILED: "Failed to change your password.",
  VERIFY_ACCOUNT_WARNING: "Please verify your account first.",
} as const;

const SESSION_STORAGE = { VERIFICATION_EMAIL: "verification_email" };

export function useAuth(): UseAuth {
  const router = useRouter();

  const ctx = React.useContext(AuthProviderContext);

  if (ctx === undefined) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  const {
    session,
    setSession,
    isAuthenticated,
    hasPermission,
    isRefreshLoading,
  } = ctx;

  const loginMutation = useMutation({
    mutationKey: ["login_mutation"],
    mutationFn: (data: LoginRequest) => AuthService.login(data),
    onSuccess: (response) => {
      setSession(response.data);
      router.push(ROUTES.HOMEPAGE);
    },
    onError: (error: any) => {
      setSession(null);
      const parsed = error.parsedBody as ErrorResponse;
      if (parsed.message === "User is disabled") {
        toast.warning(ERROR_MESSAGE.VERIFY_ACCOUNT_WARNING);
        router.push(ROUTES.VERIFY_ACCOUNT);
      } else {
        toast.error(parsed?.message || ERROR_MESSAGE.GENERIC);
        sessionStorage.clear();
      }
    },
  });

  const registerMutation = useMutation({
    mutationKey: ["register_mutation"],
    mutationFn: (data: RegisterRequest) => AuthService.register(data),
    onSuccess: (response) => {
      sessionStorage.setItem(
        SESSION_STORAGE.VERIFICATION_EMAIL,
        response.data.email,
      );
      router.push(ROUTES.VERIFY_ACCOUNT);
    },
    onError: (error: any) => {
      const parsed = error.parsedBody as ErrorResponse;
      toast.error(parsed?.message || ERROR_MESSAGE.GENERIC);
      sessionStorage.clear();
    },
  });

  const logoutMutation = useMutation({
    mutationKey: ["logout_mutation"],
    mutationFn: () => AuthService.logout(),
    onSuccess: () => {
      setSession(null);
      router.push(ROUTES.LOGIN);
    },
    onError: () => toast.error(ERROR_MESSAGE.LOGOUT_FAILED),
  });

  const sendOneTimePasswordMutation = useMutation({
    mutationKey: ["send_otp_mutation"],
    mutationFn: (data: EmailRequest) => AuthService.sendOneTimePassword(data),
    onSuccess: () => {
      sessionStorage.clear();
    },
  });

  const verifyAccountMutation = useMutation({
    mutationKey: ["verify_account_mutation"],
    mutationFn: (data: OneTimePasswordRequest) =>
      AuthService.verifyAccount(data),
    onSuccess: () => {
      router.push(ROUTES.LOGIN);
      sessionStorage.clear();
    },
    onError: () => {
      toast.error(ERROR_MESSAGE.INVALID_CODE);
      sessionStorage.clear();
    },
  });

  const verifyPasswordResetMutation = useMutation({
    mutationKey: ["verify_password_reset_mutation"],
    mutationFn: (data: OneTimePasswordRequest) =>
      AuthService.verifyPasswordReset(data),
    onSuccess: (response) => {
      sessionStorage.setItem(
        SESSION_STORAGE.VERIFICATION_EMAIL,
        response.data.email,
      );
      router.push(ROUTES.CHANGE_PASSWORD);
    },
    onError: () => {
      toast.error(ERROR_MESSAGE.INVALID_CODE);
      sessionStorage.clear();
    },
  });

  const changePasswordMutation = useMutation({
    mutationKey: ["change_password_mutation"],
    mutationFn: (data: UpdatePasswordRequest) =>
      AuthService.changePassword(data),
    onSuccess: () => {
      sessionStorage.clear();
      router.push(ROUTES.LOGIN);
    },
    onError: () => {
      toast.error(ERROR_MESSAGE.PASSWORD_CHANGE_FAILED);
    },
  });

  const isLoading = [
    loginMutation.isPending,
    registerMutation.isPending,
    sendOneTimePasswordMutation.isPending,
    verifyAccountMutation.isPending,
    verifyPasswordResetMutation.isPending,
    changePasswordMutation.isPending,
  ].some(Boolean);

  return {
    session: session,
    isAuthenticated: isAuthenticated,
    hasPermission: hasPermission,
    isLoading: isLoading,
    isRefreshLoading: isRefreshLoading,
    signIn: (data: LoginRequest) => loginMutation.mutate(data),
    signUp: (data: RegisterRequest) => registerMutation.mutate(data),
    logout: () => logoutMutation.mutate(),
    sendOneTimePassword: (data: EmailRequest) =>
      sendOneTimePasswordMutation.mutate(data),
    verifyAccount: (data: OneTimePasswordRequest) =>
      verifyAccountMutation.mutate(data),
    verifyPasswordReset: (data: OneTimePasswordRequest) =>
      verifyPasswordResetMutation.mutate(data),
    changePassword: (data: UpdatePasswordRequest) =>
      changePasswordMutation.mutate(data),
  };
}
