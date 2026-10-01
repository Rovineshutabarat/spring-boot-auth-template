import { AuthProviderContext } from "@/components/providers/auth-provider";
import {
  clearOtpTimestamp,
  isOtpFresh,
  saveOtpTimestamp,
} from "@/lib/otp-cooldown";
import {
  clearPendingVerification,
  setPendingVerification,
} from "@/lib/pending-verification";
import { AuthService } from "@/services/auth.service";
import { OneTimePassword } from "@/types/entity/one.time.password";
import { VerificationType } from "@/types/enums/verification.type";
import { LoginRequest } from "@/types/payload/request/login.request";
import { OneTimePasswordRequest } from "@/types/payload/request/otp.request";
import { RegisterRequest } from "@/types/payload/request/register.request";
import { SendOtpRequest } from "@/types/payload/request/send-otp.request";
import { UpdatePasswordRequest } from "@/types/payload/request/update.password.request";
import { ErrorResponse } from "@/types/payload/response/common/error.response";
import { SuccessResponse } from "@/types/payload/response/common/success.response";
import { UseAuth } from "@/types/use.auth";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

const ROUTES = {
  HOMEPAGE: "/",
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  VERIFY_ACCOUNT: "/auth/verify-account",
  VERIFY_RESET: "/auth/verify-reset",
  FORGOT_PASSWORD: "/auth/forgot-password",
  CHANGE_PASSWORD: "/auth/change-password",
} as const;

const MESSAGE = {
  GENERIC: "Something went wrong.",
  INVALID_CODE: "Invalid or expired code. Please try again.",
  LOGOUT_FAILED: "Failed to log out.",
  PASSWORD_CHANGE_FAILED: "Failed to change your password.",
  ACCOUNT_CREATED: "Account created. Check your email for the verification code.",
  RESET_CODE_SENT: "Reset code sent. Expires in 5 minutes.",
  NEW_VERIFICATION_CODE: "A new verification code was sent to your email.",
  VERIFY_FIRST_USE_EXISTING:
    "Your account is not verified. Please use the code sent to your email.",
  VERIFY_FIRST_FRESH_CODE:
    "Your account is not verified. A new code was sent to your email.",
  VERIFY_ACCOUNT_THEN_RESET:
    "Your account is not verified. Verify your account first using the code sent to your email.",
  ACCOUNT_VERIFIED: "Your account has been verified. Please log in.",
  CODE_CONFIRMED: "Verification successful. Please set your new password.",
  PASSWORD_CHANGED: "Password changed successfully. Please log in.",
} as const;

const BACKEND_MESSAGE = {
  USER_DISABLED: "User is disabled",
  VERIFY_ACCOUNT_FIRST: "Please verify your account first.",
  PLEASE_WAIT: "Please wait before requesting another OTP.",
} as const;

type Router = ReturnType<typeof useRouter>;

const ACCOUNT_OTP = VerificationType.Values.ACCOUNT_VERIFICATION;
const RESET_OTP = VerificationType.Values.FORGOT_PASSWORD;

function goToVerifyAccount(email: string, router: Router) {
  setPendingVerification({ email, resetVerified: false });
  router.push(ROUTES.VERIFY_ACCOUNT);
}

function sendAccountOtp(email: string): Promise<unknown> {
  return AuthService.sendOtp({
    email,
    verificationType: ACCOUNT_OTP,
  });
}

export function useAuth(): UseAuth {
  const router = useRouter();

  const ctx = React.useContext(AuthProviderContext);

  if (ctx === undefined) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  const { session, setSession, isAuthenticated, hasRoles, isRefreshLoading } =
    ctx;

  const loginMutation = useMutation({
    mutationKey: ["login_mutation"],
    mutationFn: (data: LoginRequest) => AuthService.login(data),
    onSuccess: (response) => {
      setSession(response.data);
      router.push(ROUTES.HOMEPAGE);
    },
    onError: (error: any, variables: LoginRequest) => {
      setSession(null);
      const parsed = error.parsedBody as ErrorResponse;
      if (parsed?.message === BACKEND_MESSAGE.USER_DISABLED) {
        const email = variables.email;
        if (isOtpFresh(ACCOUNT_OTP)) {
          toast.warning(MESSAGE.VERIFY_FIRST_USE_EXISTING);
          goToVerifyAccount(email, router);
          return;
        }
        sendAccountOtp(email)
          .then(() => {
            toast.warning(MESSAGE.VERIFY_FIRST_FRESH_CODE);
            saveOtpTimestamp(ACCOUNT_OTP);
            goToVerifyAccount(email, router);
          })
          .catch((sendError: any) => {
            const sendParsed = sendError.parsedBody as ErrorResponse;
            if (sendParsed?.message === BACKEND_MESSAGE.PLEASE_WAIT) {
              toast.warning(MESSAGE.VERIFY_FIRST_USE_EXISTING);
              goToVerifyAccount(email, router);
            } else {
              toast.error(sendParsed?.message || MESSAGE.GENERIC);
            }
          });
      } else {
        toast.error(parsed?.message || MESSAGE.GENERIC);
      }
    },
  });

  const registerMutation = useMutation({
    mutationKey: ["register_mutation"],
    mutationFn: (data: RegisterRequest) => AuthService.register(data),
    onSuccess: (response) => {
      toast.success(MESSAGE.ACCOUNT_CREATED);
      setPendingVerification({ email: response.data.email, resetVerified: false });
      saveOtpTimestamp(ACCOUNT_OTP);
      router.push(ROUTES.VERIFY_ACCOUNT);
    },
    onError: (error: any) => {
      const parsed = error.parsedBody as ErrorResponse;
      toast.error(parsed?.message || MESSAGE.GENERIC);
    },
  });

  const logoutMutation = useMutation({
    mutationKey: ["logout_mutation"],
    mutationFn: () => AuthService.logout(),
    onSuccess: () => {
      setSession(null);
      clearPendingVerification();
      clearOtpTimestamp();
      router.push(ROUTES.LOGIN);
    },
    onError: () => toast.error(MESSAGE.LOGOUT_FAILED),
  });

  const sendOtpMutation = useMutation({
    mutationKey: ["send_otp_mutation"],
    mutationFn: (data: SendOtpRequest) => AuthService.sendOtp(data),
    onSuccess: (_response, variables) => {
      const isReset =
        variables.verificationType === RESET_OTP;
      toast.success(
        isReset ? MESSAGE.RESET_CODE_SENT : MESSAGE.NEW_VERIFICATION_CODE,
      );
      setPendingVerification({ email: variables.email, resetVerified: false });
      saveOtpTimestamp(variables.verificationType);
      router.push(isReset ? ROUTES.VERIFY_RESET : ROUTES.VERIFY_ACCOUNT);
    },
    onError: (error: any, variables: SendOtpRequest) => {
      const parsed = error.parsedBody as ErrorResponse;
      if (
        variables.verificationType === RESET_OTP &&
        parsed?.message === BACKEND_MESSAGE.VERIFY_ACCOUNT_FIRST
      ) {
        const email = variables.email;
        if (isOtpFresh(ACCOUNT_OTP)) {
          toast.warning(MESSAGE.VERIFY_ACCOUNT_THEN_RESET);
          goToVerifyAccount(email, router);
          return;
        }
        sendAccountOtp(email)
          .then(() => {
            toast.warning(MESSAGE.VERIFY_ACCOUNT_THEN_RESET);
            saveOtpTimestamp(ACCOUNT_OTP);
            goToVerifyAccount(email, router);
          })
          .catch((sendError: any) => {
            const sendParsed = sendError.parsedBody as ErrorResponse;
            if (sendParsed?.message === BACKEND_MESSAGE.PLEASE_WAIT) {
              toast.warning(MESSAGE.VERIFY_ACCOUNT_THEN_RESET);
              goToVerifyAccount(email, router);
            } else {
              toast.error(sendParsed?.message || MESSAGE.GENERIC);
            }
          });
      } else {
        toast.error(parsed?.message || MESSAGE.GENERIC);
      }
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
    onSuccess: (response: SuccessResponse<OneTimePassword>) => {
      if (response.data.verification_type === ACCOUNT_OTP) {
        toast.success(MESSAGE.ACCOUNT_VERIFIED);
        clearPendingVerification();
        clearOtpTimestamp(ACCOUNT_OTP);
        router.push(ROUTES.LOGIN);
      } else if (response.data.verification_type === RESET_OTP) {
        toast.success(MESSAGE.CODE_CONFIRMED);
        setPendingVerification({
          email: response.data.user.email,
          resetVerified: true,
        });
        clearOtpTimestamp(RESET_OTP);
        router.push(ROUTES.CHANGE_PASSWORD);
      }
    },
    onError: (error: any) => {
      const parsed = error.parsedBody as ErrorResponse;
      toast.error(parsed?.message || MESSAGE.INVALID_CODE);
    },
  });

  const changePasswordMutation = useMutation({
    mutationKey: ["change_password_mutation"],
    mutationFn: (data: UpdatePasswordRequest) =>
      AuthService.changePassword(data),
    onSuccess: () => {
      toast.success(MESSAGE.PASSWORD_CHANGED);
      clearPendingVerification();
      clearOtpTimestamp(RESET_OTP);
      router.push(ROUTES.LOGIN);
    },
    onError: (error: any) => {
      const parsed = error.parsedBody as ErrorResponse;
      toast.error(parsed?.message || MESSAGE.PASSWORD_CHANGE_FAILED);
    },
  });

  return {
    session: session,
    isAuthenticated: isAuthenticated,
    hasRoles: hasRoles,
    isLoading: loginMutation.isPending,
    isSigningIn: loginMutation.isPending,
    isSigningUp: registerMutation.isPending,
    isSendingOtp: sendOtpMutation.isPending,
    isVerifyingOtp: verifyOneTimePasswordMutation.isPending,
    isChangingPassword: changePasswordMutation.isPending,
    isRefreshLoading: isRefreshLoading,
    signIn: (data: LoginRequest) => loginMutation.mutate(data),
    signUp: (data: RegisterRequest) => registerMutation.mutate(data),
    logout: () => logoutMutation.mutate(),
    sendOtp: (data: SendOtpRequest) => sendOtpMutation.mutate(data),
    verifyOneTimePassword: (
      data: OneTimePasswordRequest,
      email: string,
      VType: VerificationType,
    ) => verifyOneTimePasswordMutation.mutate({ data, email, VType }),
    changePassword: (data: UpdatePasswordRequest) =>
      changePasswordMutation.mutate(data),
  };
}
