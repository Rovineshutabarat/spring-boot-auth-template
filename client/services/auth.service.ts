import { ApiClient } from "@/services/config/api.client";
import { OneTimePassword } from "@/types/entity/one.time.password";
import { User } from "@/types/entity/user";
import { VerificationType } from "@/types/enums/verification.type";
import { LoginRequest } from "@/types/payload/request/login.request";
import { OneTimePasswordRequest } from "@/types/payload/request/otp.request";
import { RegisterRequest } from "@/types/payload/request/register.request";
import { SendOtpRequest } from "@/types/payload/request/send-otp.request";
import { UpdatePasswordRequest } from "@/types/payload/request/update.password.request";
import { AuthResponse } from "@/types/payload/response/auth.response";
import { SuccessResponse } from "@/types/payload/response/common/success.response";

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

  static async sendOtp(
    data: SendOtpRequest,
  ): Promise<SuccessResponse<void>> {
    return ApiClient.post("auth/send-otp", {
      json: data,
    }).json<SuccessResponse<void>>();
  }

  static async verifyOneTimePassword(
    data: OneTimePasswordRequest,
    email: string,
    verificationType: VerificationType,
  ): Promise<SuccessResponse<OneTimePassword>> {
    return ApiClient.post("auth/verify-otp", {
      json: {
        email,
        code: data.code,
        verificationType,
      },
    }).json<SuccessResponse<OneTimePassword>>();
  }

  static async changePassword(
    data: UpdatePasswordRequest,
  ): Promise<SuccessResponse<User>> {
    return ApiClient.post("user/update-password", {
      json: data,
    }).json<SuccessResponse<User>>();
  }
}
