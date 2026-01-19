import { AuthProviderContext } from "@/components/providers/auth-provider";
import { AuthService } from "@/services/auth.service";
import { VerificationType } from "@/types/enums/verification.type";
import { EmailRequest } from "@/types/payload/request/email.request";
import { LoginRequest } from "@/types/payload/request/login.request";
import { OneTimePasswordRequest } from "@/types/payload/request/otp.request";
import { RegisterRequest } from "@/types/payload/request/register.request";
import { UpdatePasswordRequest } from "@/types/payload/request/update.password.request";
import { ErrorResponse } from "@/types/payload/response/common/error.response";
import { UseAuth } from "@/types/use.auth";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

const ROUTES = {
  HOMEPAGE: "/",
  LOGIN: "/auth/login",
  VERIFY: "/auth/verify",
  CHANGE_PASSWORD: "/auth/change-password",
} as const;

const ERROR_MESSAGE = {
  GENERIC: "Something went wrong.",
  INVALID_CODE: "Invalid or expired code. Please try again.",
  LOGOUT_FAILED: "Failed to logout.",
  PASSWORD_CHANGE_FAILED: "Failed to change your password.",
  VERIFY_ACCOUNT_WARNING: "Please verify your account first.",
} as const;

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
        const email = sessionStorage.getItem("verification_email");
        router.push(
          ROUTES.VERIFY.concat(
            `?email=${email}&type=${VerificationType.Values.ACCOUNT_VERIFICATION}`,
          ),
        );
      } else {
        toast.error(parsed?.message || ERROR_MESSAGE.GENERIC);
      }
    },
  });

  const registerMutation = useMutation({
    mutationKey: ["register_mutation"],
    mutationFn: (data: RegisterRequest) => AuthService.register(data),
    onSuccess: (response) => {
      localStorage.setItem("lastOtpRequest", Date.now().toString());
      router.push(
        ROUTES.VERIFY.concat(
          `?email=${response.data.email}&type=${VerificationType.Values.ACCOUNT_VERIFICATION}`,
        ),
      );
    },
    onError: (error: any) => {
      const parsed = error.parsedBody as ErrorResponse;
      toast.error(parsed?.message || ERROR_MESSAGE.GENERIC);
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
    onError: (error: any) => {
      const parsed = error.parsedBody as ErrorResponse;
      toast.error(parsed?.message || ERROR_MESSAGE.GENERIC);
    },
  });

  const verifyOneTimePasswordMutation = useMutation({
    mutationKey: ["verify_otp_mutation"],
    mutationFn: ({
      data,
      email,
      VType,
    }: {
      data: OneTimePasswordRequest;
      email: string;
      VType: VerificationType;
    }) => {
      return AuthService.verifyOneTimePassword(data, email, VType);
    },
    onSuccess: () => {
      toast.success("Verification successful!");
      router.push(ROUTES.LOGIN);
    },
    onError: () => toast.error(ERROR_MESSAGE.INVALID_CODE),
  });

  const changePasswordMutation = useMutation({
    mutationKey: ["change_password_mutation"],
    mutationFn: (data: UpdatePasswordRequest) =>
      AuthService.changePassword(data),
    onSuccess: () => {
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
    verifyOneTimePassword: (
      data: OneTimePasswordRequest,
      email: string,
      VType: VerificationType,
    ) => verifyOneTimePasswordMutation.mutate({ data, email, VType }),
    changePassword: (data: UpdatePasswordRequest) =>
      changePasswordMutation.mutate(data),
  };
}
