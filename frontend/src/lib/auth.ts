import type { User } from "../types";

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const USER_KEY = "user";

export function getAccessToken(): string | null {
  return localStorage.getItem(
    ACCESS_TOKEN_KEY,
  );
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(
    REFRESH_TOKEN_KEY,
  );
}

export function getStoredUser(): User | null {
  const storedUser =
    localStorage.getItem(USER_KEY);

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser) as User;
  } catch {
    localStorage.removeItem(USER_KEY);

    return null;
  }
}

export function setStoredUser(
  user: User,
): void {
  localStorage.setItem(
    USER_KEY,
    JSON.stringify(user),
  );
}

export function setAuthData(
  accessToken: string,
  refreshToken: string,
  user: User,
): void {
  localStorage.setItem(
    ACCESS_TOKEN_KEY,
    accessToken,
  );

  localStorage.setItem(
    REFRESH_TOKEN_KEY,
    refreshToken,
  );

  setStoredUser(user);
}

export function clearAuthData(): void {
  localStorage.removeItem(
    ACCESS_TOKEN_KEY,
  );

  localStorage.removeItem(
    REFRESH_TOKEN_KEY,
  );

  localStorage.removeItem(USER_KEY);
}