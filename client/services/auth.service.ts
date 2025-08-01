import { z } from "zod/v3";
import { LoginRequest } from "@/types/payload/request/login.request";
import { ApiClient } from "@/services/api.client";
import { SuccessResponse } from "@/types/payload/response/common/success.response";
import { AuthResponse } from "@/types/payload/response/auth.response";
import { RegisterRequest } from "@/types/payload/request/register.request";
import { User } from "@/types/entity/user";
import { ErrorResponse } from "@/types/payload/response/common/error.response";
import { HTTPError } from "ky";

type LoginRequest = z.infer<typeof LoginRequest>;
type RegisterRequest = z.infer<typeof RegisterRequest>;
export namespace AuthService {
  export async function login(data: LoginRequest) {
    return ApiClient.post("auth/login", {
      json: data,
    }).json<SuccessResponse<AuthResponse>>();
  }

  export async function register(data: RegisterRequest) {
    return ApiClient.post("auth/register", {
      json: data,
    }).json<SuccessResponse<User>>();
  }
}
