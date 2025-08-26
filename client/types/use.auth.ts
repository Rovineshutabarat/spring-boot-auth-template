import { AuthResponse } from "@/types/payload/response/auth.response";
import { LoginRequest } from "@/types/payload/request/login.request";
import { RegisterRequest } from "@/types/payload/request/register.request";
import { EmailRequest } from "@/types/payload/request/email.request";
import { OneTimePasswordRequest } from "@/types/payload/request/otp.request";
import { UpdatePasswordRequest } from "@/types/payload/request/update.password.request";

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
  verifyAccount: (data: OneTimePasswordRequest) => void;
  verifyPasswordReset: (data: OneTimePasswordRequest) => void;
  changePassword: (data: UpdatePasswordRequest) => void;
};
