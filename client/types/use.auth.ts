import { EmailRequest } from "@/types/payload/request/email.request";
import { LoginRequest } from "@/types/payload/request/login.request";
import { OneTimePasswordRequest } from "@/types/payload/request/otp.request";
import { RegisterRequest } from "@/types/payload/request/register.request";
import { UpdatePasswordRequest } from "@/types/payload/request/update.password.request";
import { AuthResponse } from "@/types/payload/response/auth.response";
import { VerificationType } from "./enums/verification.type";

export type UseAuth = {
  session: AuthResponse | null;
  isAuthenticated: boolean;
  hasPermission: (roles: string[]) => boolean;
  isLoading: boolean;
  isRefreshLoading: boolean;
  signIn: (data: LoginRequest) => void;
  signUp: (data: RegisterRequest) => void;
  logout: () => void;
  sendOneTimePassword: (data: EmailRequest) => void;
  verifyOneTimePassword: (
    data: OneTimePasswordRequest,
    email: string,
    VType: VerificationType,
  ) => void;
  changePassword: (data: UpdatePasswordRequest) => void;
};
