import { z } from "zod/v3";

export const RegisterRequest = z
  .object({
    username: z
      .string({ required_error: "Username cannot be blank" })
      .min(1, { message: "Username cannot be blank" })
      .min(5, {
        message: "Username is too short. Please enter at least 5 characters",
      })
      .max(50, {
        message:
          "Username is too long. Please enter no more than 50 characters",
      }),

    email: z
      .string({ required_error: "Email cannot be blank" })
      .min(1, { message: "Email cannot be blank" })
      .email({ message: "Please provide a valid email address" })
      .min(5, {
        message: "Email is too short. Please enter at least 5 characters",
      })
      .max(100, {
        message: "Email is too long. Please enter no more than 100 characters",
      }),

    password: z
      .string({ required_error: "Password cannot be blank" })
      .min(1, { message: "Password cannot be blank" })
      .min(6, {
        message: "Password is too short. Please enter at least 6 characters",
      })
      .max(100, {
        message:
          "Password is too long. Please enter no more than 100 characters",
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password does not match",
    path: ["confirmPassword"],
  })
  .transform(({ confirmPassword, ...data }) => data);

export type RegisterRequest = z.infer<typeof RegisterRequest>;
