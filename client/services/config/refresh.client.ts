import ky from "ky";
import { SuccessResponse } from "@/types/payload/response/common/success.response";
import { AuthResponse } from "@/types/payload/response/auth.response";

let refreshPromise: Promise<AuthResponse> | null = null;

const refreshInstance = ky.create({
  prefixUrl: process.env.NEXT_PUBLIC_API_URL,
  credentials: "include",
  retry: { limit: 0 },
});

export async function refreshAccessToken(): Promise<AuthResponse> {
  if (!refreshPromise) {
    refreshPromise = refreshInstance
      .post("auth/refresh-token")
      .json<SuccessResponse<AuthResponse>>()
      .then((res) => res.data)
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}
