import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import api from "../../lib/api";
import {
  clearAuthData,
  getAccessToken,
  getRefreshToken,
  getStoredUser,
  setAuthData,
  setStoredUser,
} from "../../lib/auth";

import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
} from "../../types/auth";

import type { User } from "../../types";

interface AuthContextValue {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  login: (
    email: string,
    password: string,
  ) => Promise<void>;

  register: (
    data: RegisterRequest,
  ) => Promise<void>;

  logout: () => Promise<void>;

  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<
  AuthContextValue | undefined
>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({
  children,
}: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(
    getStoredUser(),
  );

  const [accessToken, setAccessToken] =
    useState<string | null>(
      getAccessToken(),
    );

  const [refreshToken, setRefreshToken] =
    useState<string | null>(
      getRefreshToken(),
    );

  const [isLoading, setIsLoading] =
    useState(true);

  const isAuthenticated = Boolean(
    accessToken && user,
  );

  const clearAuthentication = useCallback(() => {
    clearAuthData();

    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
  }, []);

  const refreshUser = useCallback(async () => {
    const token = getAccessToken();

    if (!token) {
      setUser(null);
      setAccessToken(null);
      setRefreshToken(null);
      setIsLoading(false);

      return;
    }

    try {
      const response = await api.get<User>(
        "/auth/me/",
      );

      setUser(response.data);
      setStoredUser(response.data);
      setAccessToken(token);

      const storedRefreshToken =
        getRefreshToken();

      setRefreshToken(storedRefreshToken);
    } catch {
      clearAuthentication();
    } finally {
      setIsLoading(false);
    }
  }, [clearAuthentication]);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      const token = getAccessToken();
      const storedUser = getStoredUser();

      if (!token) {
        if (mounted) {
          setIsLoading(false);
        }

        return;
      }

      /*
       * We already have a stored user, but we still
       * validate the access token against the backend.
       */
      if (storedUser && mounted) {
        setUser(storedUser);
      }

      try {
        await refreshUser();
      } catch {
        if (mounted) {
          clearAuthentication();
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
    };
  }, [clearAuthentication, refreshUser]);

  const login = useCallback(
    async (
      email: string,
      password: string,
    ): Promise<void> => {
      const credentials: LoginRequest = {
        email: email.trim().toLowerCase(),
        password,
      };

      const response =
        await api.post<LoginResponse>(
          "/auth/login/",
          credentials,
        );

      const {
        access,
        refresh,
        user: responseUser,
      } = response.data;

      setAuthData(
        access,
        refresh,
        responseUser,
      );

      setAccessToken(access);
      setRefreshToken(refresh);
      setUser(responseUser);
    },
    [],
  );

  const register = useCallback(
    async (
      data: RegisterRequest,
    ): Promise<void> => {
      await api.post(
        "/auth/register/",
        data,
      );
    },
    [],
  );

  const logout = useCallback(
    async (): Promise<void> => {
      const currentRefreshToken =
        getRefreshToken();

      try {
        if (currentRefreshToken) {
          await api.post(
            "/auth/logout/",
            {
              refresh: currentRefreshToken,
            },
          );
        }
      } catch {
        /*
         * Local authentication must still be
         * cleared if the backend request fails.
         */
      } finally {
        clearAuthentication();
      }
    },
    [clearAuthentication],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      accessToken,
      refreshToken,
      isAuthenticated,
      isLoading,
      login,
      register,
      logout,
      refreshUser,
    }),
    [
      user,
      accessToken,
      refreshToken,
      isAuthenticated,
      isLoading,
      login,
      register,
      logout,
      refreshUser,
    ],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside an AuthProvider.",
    );
  }

  return context;
}