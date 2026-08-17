import axios, {
  type AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";

const API_URL = "http://127.0.0.1:8000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

interface RetryableRequestConfig
  extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

let isRefreshing = false;

let refreshSubscribers: Array<
  (token: string) => void
> = [];

const subscribeToTokenRefresh = (
  callback: (token: string) => void,
) => {
  refreshSubscribers.push(callback);
};

const notifyTokenRefresh = (
  token: string,
) => {
  refreshSubscribers.forEach(
    (callback) => callback(token),
  );

  refreshSubscribers = [];
};

const clearAuthentication = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
};

api.interceptors.request.use(
  (config) => {
    const accessToken =
      localStorage.getItem("accessToken");

    if (accessToken) {
      config.headers.Authorization =
        `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest =
      error.config as
        | RetryableRequestConfig
        | undefined;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const isUnauthorized =
      error.response?.status === 401;

    const isRefreshRequest =
      originalRequest.url?.includes(
        "/auth/refresh/",
      );

    if (
      !isUnauthorized ||
      originalRequest._retry ||
      isRefreshRequest
    ) {
      return Promise.reject(error);
    }

    const refreshToken =
      localStorage.getItem("refreshToken");

    if (!refreshToken) {
      clearAuthentication();

      window.location.href = "/login";

      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise((resolve) => {
        subscribeToTokenRefresh(
          (newAccessToken) => {
            originalRequest.headers.Authorization =
              `Bearer ${newAccessToken}`;

            resolve(api(originalRequest));
          },
        );
      });
    }

    isRefreshing = true;

    try {
      const response = await axios.post<{
        access: string;
      }>(
        `${API_URL}/auth/refresh/`,
        {
          refresh: refreshToken,
        },
      );

      const newAccessToken =
        response.data.access;

      localStorage.setItem(
        "accessToken",
        newAccessToken,
      );

      notifyTokenRefresh(newAccessToken);

      originalRequest.headers.Authorization =
        `Bearer ${newAccessToken}`;

      return api(originalRequest);
    } catch (refreshError) {
      refreshSubscribers = [];

      clearAuthentication();

      window.location.href = "/login";

      return Promise.reject(
        refreshError,
      );
    } finally {
      isRefreshing = false;
    }
  },
);

export default api;