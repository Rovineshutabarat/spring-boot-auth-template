import { z } from "zod/v3";
import { LoginRequest } from "@/types/payload/request/login.request";
import { RegisterRequest } from "@/types/payload/request/register.request";
import { useMutation } from "@tanstack/react-query";
import { AuthService } from "@/services/auth.service";
import { toast } from "sonner";
import { ErrorResponse } from "@/types/payload/response/common/error.response";
import { useRouter } from "next/navigation";
import { AuthResponse } from "@/types/payload/response/auth.response";
import { EmailRequest } from "@/types/payload/request/email.request";
import { OneTimePasswordRequest } from "@/types/payload/request/otp.request";
import { UpdatePasswordRequest } from "@/types/payload/request/update.password.request";
import React from "react";

type LoginRequest = z.infer<typeof LoginRequest>;
type RegisterRequest = z.infer<typeof RegisterRequest>;
type EmailRequest = z.infer<typeof EmailRequest>;
type OneTimePasswordRequest = z.infer<typeof OneTimePasswordRequest>;
type UpdatePasswordRequest = z.infer<typeof UpdatePasswordRequest>;

let session: AuthResponse | null = null;

export function setSession(_session: AuthResponse | null) {
  session = _session;
}

export function getSession(): AuthResponse | null {
  return session;
}

type UseAuth = {
  session: AuthResponse | null;
  signIn: (data: LoginRequest) => void;
  signUp: (data: RegisterRequest) => void;
  isLoading: boolean;
  logout: () => void;
  sendOneTimePassword: (data: EmailRequest) => void;
  verifyAccount: (data: OneTimePasswordRequest) => void;
  verifyPasswordReset: (data: OneTimePasswordRequest) => void;
  changePassword: (data: UpdatePasswordRequest) => void;
};

export function useAuth(): UseAuth {
  const router = useRouter();

  const loginMutation = useMutation({
    mutationKey: ["login_mutation"],
    mutationFn: (data: LoginRequest) => AuthService.login(data),
    onSuccess: (response) => {
      setSession(response.data);
      router.push("/");
    },
    onError: (error: any) => {
      setSession(null);
      const parsed = error.parsedBody as ErrorResponse;
      if (parsed.message === "User is disabled") {
        // FIXME: it should set email in session storage and send verification code | 06/08/2025
        toast.warning("Please verify your account first.");
      } else {
        toast.error(parsed?.message || "Something went wrong");
      }
    },
  });

  const registerMutation = useMutation({
    mutationKey: ["register_mutation"],
    mutationFn: (data: RegisterRequest) => AuthService.register(data),
    onSuccess: (response) => {
      sessionStorage.setItem("verification_email", response.data.email);
      router.push("/auth/verify-account");
    },
    onError: (error: any) => {
      sessionStorage.clear();
      const parsed = error.parsedBody as ErrorResponse;
      toast.error(parsed?.message || "Something went wrong");
    },
  });

  const logoutMutation = useMutation({
    mutationKey: ["logout_mutation"],
    mutationFn: () => AuthService.logout(),
    onSuccess: (response) => {
      toast.success(response.message);
      setSession(null);
    },
    onError: () => toast.error("Failed to logout."),
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
    onSuccess: (response) => {
      sessionStorage.clear();
      toast.success(response.message);
      router.push("/auth/login");
    },
    onError: () => {
      sessionStorage.clear();
      toast.error("Invalid or expired code. Please try again.");
    },
  });

  const verifyPasswordResetMutation = useMutation({
    mutationKey: ["verify_password_reset_mutation"],
    mutationFn: (data: OneTimePasswordRequest) =>
      AuthService.verifyPasswordReset(data),
    onSuccess: (response) => {
      sessionStorage.setItem("verification_email", response.data.email);
      router.push("/auth/change-password");
    },
    onError: () => {
      sessionStorage.clear();
      toast.error("Invalid or expired code. Please try again.");
    },
  });

  const changePasswordMutation = useMutation({
    mutationKey: ["change_password_mutation"],
    mutationFn: (data: UpdatePasswordRequest) =>
      AuthService.changePassword(data),
    onSuccess: () => {
      sessionStorage.clear();
      router.push("/auth/login");
    },
    onError: () => {
      toast.error("Failed to change password");
    },
  });

  const isLoading = React.useMemo(
    () =>
      registerMutation.isPending ||
      loginMutation.isPending ||
      sendOneTimePasswordMutation.isPending ||
      verifyAccountMutation.isPending ||
      verifyPasswordResetMutation.isPending ||
      changePasswordMutation.isPending,
    [
      registerMutation.isPending,
      loginMutation.isPending,
      sendOneTimePasswordMutation.isPending,
      verifyAccountMutation.isPending,
      verifyPasswordResetMutation.isPending,
      changePasswordMutation.isPending,
    ],
  );

  return {
    session: getSession(),
    signIn: (data: LoginRequest) => loginMutation.mutate(data),
    signUp: (data: RegisterRequest) => registerMutation.mutate(data),
    isLoading: isLoading,
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
