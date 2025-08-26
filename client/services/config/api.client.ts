import ky from "ky";
import { ErrorResponse } from "@/types/payload/response/common/error.response";
import { refreshAccessToken } from "@/services/config/refresh.client";
import { toast } from "sonner";

let ACCESS_TOKEN: string | null = null;

export function setAccessToken(token: string | null) {
  ACCESS_TOKEN = token;
}

const RETRIED_HEADER = "X-Retried";

export const ApiClient = ky.extend({
  prefixUrl: process.env.NEXT_PUBLIC_API_URL,
  credentials: "include",
  retry: { limit: 0 },
  hooks: {
    beforeError: [
      async (error) => {
        try {
          (error as any).parsedBody =
            await error.response.json<ErrorResponse>();
        } catch {
          // ignore parsed error
        }
        return error;
      },
    ],
    beforeRequest: [
      (request) => {
        if (ACCESS_TOKEN) {
          request.headers.set("Authorization", `Bearer ${ACCESS_TOKEN}`);
        }
      },
    ],
    afterResponse: [
      async (request, options, response) => {
        if (
          response.status !== 401 ||
          request.headers.get(RETRIED_HEADER) === "1"
        ) {
          return response;
        }

        if (typeof window !== "undefined" && window.location.pathname.startsWith("/auth")) {
          return response;
        }

        try {
          const newSession = await refreshAccessToken();
          setAccessToken(newSession.accessToken);

          const retryHeaders = new Headers(options.headers ?? {});
          retryHeaders.set("Authorization", `Bearer ${newSession.accessToken}`);
          retryHeaders.set(RETRIED_HEADER, "1");

          return await ApiClient(request, {
            ...options,
            headers: retryHeaders,
          });
        } catch (error) {
          toast.error("Your session has expired. Please log in again.");
          window.location.href = "/auth/login";
          throw error;
        }
      },
    ],
  },
});
