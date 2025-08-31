import useTokenStore from "@store/token-store";
import type { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import axios from "axios";
import config from "@config/config.json";
import { validateAndDecodeToken } from "@utils/token/validate-and-decode-token.utils";
import useAuthStore from "@store/auth-store";

export const httpService = axios.create({
  baseURL: config.baseURL,
  params: {},
  withCredentials: true,
});

httpService.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const accessToken = localStorage.getItem("token");
    config.headers.Authorization = `Bearer ${accessToken}`;

    return config;
  }
);

httpService.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    const { refreshTokens } = useTokenStore.getState();
    const accessToken = localStorage.getItem("token");

    if (error.response?.status === 401) {
      if (!accessToken) {
        return Promise.reject(error);
      }

      const decodedToken = validateAndDecodeToken(accessToken);

      if (!decodedToken) {
        return Promise.reject();
      }

      useAuthStore.setState({ isAuth: true, authUser: decodedToken });

      return refreshTokens(error);
    }

    return Promise.reject(error);
  }
);
