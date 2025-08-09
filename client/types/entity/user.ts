import { Role } from "@/types/entity/role";

export type User = {
  username: string;
  email: string;
  roles: Role[];
};
