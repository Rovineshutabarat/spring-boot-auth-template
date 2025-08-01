import { User } from "@/types/entity/user";

export type AuthResponse = {
  accessToken: string;
  user: User;
};
