import { LoginRequest } from "@/types/payload/request/login.request";
import { OneTimePasswordRequest } from "@/types/payload/request/otp.request";
import { RegisterRequest } from "@/types/payload/request/register.request";
import { SendOtpRequest } from "@/types/payload/request/send-otp.request";
import { UpdatePasswordRequest } from "@/types/payload/request/update.password.request";
import { AuthResponse } from "@/types/payload/response/auth.response";
import { VerificationType } from "./enums/verification.type";

export type UseAuth = {
  session: AuthResponse | null;
  isAuthenticated: boolean;
  hasRoles: (roles: string[]) => boolean;
  isLoading: boolean;
  isSigningIn: boolean;
  isSigningUp: boolean;
  isSendingOtp: boolean;
  isVerifyingOtp: boolean;
  isChangingPassword: boolean;
  isRefreshLoading: boolean;
  signIn: (data: LoginRequest) => void;
  signUp: (data: RegisterRequest) => void;
  logout: () => void;
  sendOtp: (data: SendOtpRequest) => void;
  verifyOneTimePassword: (
    data: OneTimePasswordRequest,
    email: string,
    VType: VerificationType,
  ) => void;
  changePassword: (data: UpdatePasswordRequest) => void;
};
