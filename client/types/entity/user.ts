import { Role } from "@/types/entity/role";

export type User = {
  id: number;
  username: string;
  email: string;
  roles: Role[];
};
