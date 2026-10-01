import type { User } from "@/types/user";
import { api } from "./http";

export async function fetchMe(): Promise<User> {
  return (await api.get<User>("/users/me")).data;
}
