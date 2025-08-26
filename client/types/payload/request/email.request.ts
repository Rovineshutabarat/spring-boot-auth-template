import { z } from "zod/v3";

export const EmailRequest = z.object({
  email: z
    .string({
      required_error: "Email cannot be blank",
      invalid_type_error: "Email must be a string",
    })
    .email({ message: "Please provide a valid email address" })
    .min(1, { message: "Email cannot be blank" })
    .min(5, {
      message: "Email is too short. Please enter at least 5 characters",
    })
    .max(100, {
      message: "Email is too long. Please enter no more than 100 characters",
    }),
});

export type EmailRequest = z.infer<typeof EmailRequest>;
