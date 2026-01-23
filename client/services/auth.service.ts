import { ApiClient } from "@/services/config/api.client";
import { OneTimePassword } from "@/types/entity/one.time.password";
import { User } from "@/types/entity/user";
import { VerificationType } from "@/types/enums/verification.type";
import { EmailRequest } from "@/types/payload/request/email.request";
import { LoginRequest } from "@/types/payload/request/login.request";
import { OneTimePasswordRequest } from "@/types/payload/request/otp.request";
import { RegisterRequest } from "@/types/payload/request/register.request";
import { UpdatePasswordRequest } from "@/types/payload/request/update.password.request";
import { AuthResponse } from "@/types/payload/response/auth.response";
import { SuccessResponse } from "@/types/payload/response/common/success.response";
import { toast } from "sonner";

export class AuthService {
  static async login(
    data: LoginRequest,
  ): Promise<SuccessResponse<AuthResponse>> {
    return ApiClient.post("auth/login", {
      json: data,
    }).json<SuccessResponse<AuthResponse>>();
  }

  static async register(data: RegisterRequest): Promise<SuccessResponse<User>> {
    return ApiClient.post("auth/register", {
      json: data,
    }).json<SuccessResponse<User>>();
  }

  static async logout(): Promise<SuccessResponse<void>> {
    return ApiClient.post("auth/logout").json<SuccessResponse<void>>();
  }

  static async sendOneTimePassword(
    data: EmailRequest,
  ): Promise<SuccessResponse<void>> {
    toast.success("A verification code has been sent to your email");
    return ApiClient.post("auth/send-otp", {
      json: data,
    }).json<SuccessResponse<void>>();
  }

  static async verifyOneTimePassword(
    data: OneTimePasswordRequest,
    email: string,
    VType: VerificationType,
  ): Promise<SuccessResponse<OneTimePassword>> {
    return ApiClient.post(`auth/verify-otp?email=${email}&type=${VType}`, {
      json: data,
    }).json<SuccessResponse<OneTimePassword>>();
  }

  static async findUserByEmail(email: string): Promise<SuccessResponse<User>> {
    return ApiClient.get("auth/user", {
      searchParams: {
        email: email,
      },
    }).json<SuccessResponse<User>>();
  }

  static async changePassword(
    data: UpdatePasswordRequest,
  ): Promise<SuccessResponse<User>> {
    return ApiClient.post("auth/change-password", {
      json: data,
    }).json<SuccessResponse<User>>();
  }
}
