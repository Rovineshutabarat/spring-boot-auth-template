import { LoginRequest } from "@/types/payload/request/login.request";
import { ApiClient } from "@/services/config/api.client";
import { SuccessResponse } from "@/types/payload/response/common/success.response";
import { AuthResponse } from "@/types/payload/response/auth.response";
import { RegisterRequest } from "@/types/payload/request/register.request";
import { User } from "@/types/entity/user";
import { EmailRequest } from "@/types/payload/request/email.request";
import { OneTimePasswordRequest } from "@/types/payload/request/otp.request";
import { UpdatePasswordRequest } from "@/types/payload/request/update.password.request";

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

  // static async refreshToken(): Promise<SuccessResponse<AuthResponse>> {
  //   return ApiClient.post("auth/refresh-token").json<
  //     SuccessResponse<AuthResponse>
  //   >();
  // }
  static async sendOneTimePassword(
    data: EmailRequest,
  ): Promise<SuccessResponse<void>> {
    return ApiClient.post("auth/send-otp", {
      json: data,
    }).json<SuccessResponse<void>>();
  }

  static async verifyAccount(
    data: OneTimePasswordRequest,
  ): Promise<SuccessResponse<User>> {
    return ApiClient.post("auth/verify-account", {
      json: data,
    }).json<SuccessResponse<User>>();
  }

  static async verifyPasswordReset(
    data: OneTimePasswordRequest,
  ): Promise<SuccessResponse<User>> {
    return ApiClient.post("auth/verify-password-reset", {
      json: data,
    }).json<SuccessResponse<User>>();
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
