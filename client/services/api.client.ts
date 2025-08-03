import ky from "ky";
import { ErrorResponse } from "@/types/payload/response/common/error.response";
import { getSession, setSession } from "@/hooks/use-auth";
import { SuccessResponse } from "@/types/payload/response/common/success.response";
import { AuthResponse } from "@/types/payload/response/auth.response";
import { toast } from "sonner";

const PROTECTED_PATHS = ["/test"];

function shouldRedirectOnUnauthorized(): boolean {
  if (typeof window === "undefined") return false;

  const currentPath = window.location.pathname;
  return PROTECTED_PATHS.some((path) => currentPath.startsWith(path));
}

export const ApiClient = ky.extend({
  prefixUrl: "http://localhost:4000/api",
  headers: {
    "Content-Type": "application/json",
  },
  hooks: {
    beforeError: [
      async (error) => {
        (error as any).parsedBody = await error.response.json<ErrorResponse>();
        return error;
      },
    ],
    beforeRequest: [
      (request) => {
        const session = getSession();
        if (session) {
          request.headers.set("Authorization", `Bearer ${session.accessToken}`);
        }
      },
    ],
    afterResponse: [
      async (request, options, response) => {
        if (response.status == 401) {
          try {
            const response = await ky
              .post("http://localhost:4000/api/auth/refresh-token", {
                credentials: "include",
              })
              .json<SuccessResponse<AuthResponse>>();

            setSession(response.data);

            const url = new URL(request.url);
            return await ApiClient(
              url.pathname.replace(/^\/api\//, ""),
              options,
            );
          } catch (error) {
            // FIXME: this code only work when we refresh the page
            if (shouldRedirectOnUnauthorized()) {
              toast.error("Your session has expired. Please log in again.");
              window.location.href = "/auth/login";
            }
            throw error;
          }
        }
        return response;
      },
    ],
  },
  credentials: "include",
});
