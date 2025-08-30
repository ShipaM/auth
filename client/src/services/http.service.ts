import axios, {
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";

export const httpService = axios.create({
  baseURL: "http://localhost:5000/api/",
  params: {},
  withCredentials: true,
});

httpService.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const accesToken = localStorage.getItem("token");
    config.headers.Authorization = `Bearer ${accesToken}`;

    return config;
  }
);

httpService.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log(error);
      const cookies = document.cookie;
      console.log(cookies);
      // localStorage.removeItem("token");
      // window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
