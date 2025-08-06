import { z } from "zod/v3";

export const OneTimePasswordRequest = z.object({
  code: z
    .string({
      required_error: "Verification code cannot be blank",
      invalid_type_error: "Verification code must be a string",
    })
    .min(6, {
      message:
        "Verification code is too short. Please enter at least 6 characters",
    })
    .max(6, {
      message:
        "Verification code is too long. Please enter no more than 6 characters",
    }),
});
