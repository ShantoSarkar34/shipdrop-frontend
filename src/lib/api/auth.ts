import { api } from "./http";
import type { TokenPair } from "../types";

export type RegisterRole = "CUSTOMER" | "DELIVERY_AGENT";

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  role: RegisterRole;
  phone?: string;
}

// These endpoints are public: they never carry a Bearer token and never trigger a refresh.
export const authApi = {
  login: async (input: LoginInput) =>
    (await api.post<TokenPair>("/auth/login", input, { auth: false })).data,

  register: async (input: RegisterInput) =>
    (await api.post<TokenPair>("/auth/register", input, { auth: false })).data,

  googleLogin: async (idToken: string) =>
    (await api.post<TokenPair>("/auth/google", { idToken }, { auth: false }))
      .data,

  logout: async (refreshToken: string) => {
    await api.post("/auth/logout", { refreshToken }, { auth: false });
  },
};
