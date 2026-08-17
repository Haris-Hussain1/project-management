import api from "../../lib/api";
import type {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
} from "./types";

export async function loginUser(
  payload: LoginPayload,
): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>(
    "/auth/login/",
    payload,
  );

  return response.data;
}

export async function registerUser(
  payload: RegisterPayload,
): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>(
    "/auth/register/",
    payload,
  );

  return response.data;
}

export async function getCurrentUser() {
  const response = await api.get("/auth/me/");
  return response.data;
}

export async function refreshAccessToken(
  refresh: string,
) {
  const response = await api.post<AuthResponse>(
    "/auth/token/refresh/",
    {
      refresh,
    },
  );

  return response.data;
}