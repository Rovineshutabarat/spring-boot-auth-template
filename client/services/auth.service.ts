import { z } from "zod/v3";
import { LoginRequest } from "@/types/payload/request/login.request";
import { ApiClient } from "@/services/api.client";
import { SuccessResponse } from "@/types/payload/response/common/success.response";
import { AuthResponse } from "@/types/payload/response/auth.response";
import { RegisterRequest } from "@/types/payload/request/register.request";
import { User } from "@/types/entity/user";

type LoginRequest = z.infer<typeof LoginRequest>;
type RegisterRequest = z.infer<typeof RegisterRequest>;

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
}
