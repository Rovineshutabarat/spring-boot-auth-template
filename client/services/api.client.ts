import ky from "ky";
import { ErrorResponse } from "@/types/payload/response/common/error.response";

export const ApiClient = ky.extend({
  prefixUrl: "http://localhost:4000/api",
  hooks: {
    beforeError: [
      async (error) => {
        (error as any).parsedBody = await error.response.json<ErrorResponse>();
        return error;
      },
    ],
  },
});
