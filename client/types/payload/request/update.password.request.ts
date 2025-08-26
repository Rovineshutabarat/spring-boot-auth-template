import { z } from "zod/v3";

export const UpdatePasswordRequest = z
  .object({
    email: z.string(),
    oldPassword: z
      .string({ required_error: "Old Password cannot be blank" })
      .min(1, { message: "Old Password cannot be blank" })
      .min(6, {
        message:
          "Old Password is too short. Please enter at least 6 characters",
      })
      .max(100, {
        message:
          "Old Password is too long. Please enter no more than 100 characters",
      }),
    password: z
      .string({ required_error: "New Password cannot be blank" })
      .min(1, { message: "New Password cannot be blank" })
      .min(6, {
        message:
          "New Password is too short. Please enter at least 6 characters",
      })
      .max(100, {
        message:
          "New Password is too long. Please enter no more than 100 characters",
      }),
  })
  .transform(({ oldPassword, ...data }) => data);

export type UpdatePasswordRequest = z.infer<typeof UpdatePasswordRequest>;
