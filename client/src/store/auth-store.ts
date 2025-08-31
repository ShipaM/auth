import authService from "@services/auth.service";
import { handleHttpError } from "@utils/handl-http-error/handle-http-error";
import { validateAndDecodeToken } from "@utils/token/validate-and-decode-token.utils";
import type { LoginType, RegisterType } from "src/Forms/forms.type";
import type { AccessDecodedToken } from "src/types/auth.type";
import { create } from "zustand";

interface UseAuthStore {
  isAuth: boolean;
  authUser: AccessDecodedToken | null;
  isLoading: boolean;
  error: null | unknown;
  login: (loginData: LoginType) => Promise<string | void>;
  register: (registerData: RegisterType) => void;
  logout: () => void;
}

const useAuthStore = create<UseAuthStore>((set) => ({
  isAuth: false,
  authUser: null,
  isLoading: false,
  error: null,

  login: (loginData: LoginType) => {
    set({ isLoading: true, error: null });

    return authService
      .login(loginData)
      .then((data) => {
        const accessToken: string = data.accessToken;

        if (!accessToken) {
          throw new Error("Токены не найдены");
        }

        set({ isAuth: true });

        localStorage.setItem("token", accessToken);

        const decodedToken = validateAndDecodeToken(accessToken);

        if (!decodedToken) {
          throw new Error("Tokens not found");
        }

        set({ authUser: decodedToken });

        return accessToken;
      })
      .catch((error: unknown) => {
        handleHttpError(error, "Error on login", true);
        set({ error });
      })
      .finally(() => {
        set({ isLoading: false });
      });
  },

  register: (registerData: RegisterType) => {
    set({ isLoading: true, error: null });

    authService
      .register(registerData)
      .then(() => {
        useAuthStore.getState().login({
          userName: registerData.userName,
          password: registerData.password,
        });
      })
      .catch((error: unknown) => {
        handleHttpError(error, "Error on registration", true);
        set({ error });
      })
      .finally(() => {
        set({ isLoading: false });
      });
  },

  logout: () => {
    set({ isLoading: true, error: null });
    authService
      .logout()
      .then(() => {
        localStorage.removeItem("token");
        set({ isAuth: false });
      })
      .catch((error: unknown) => {
        handleHttpError(error, "Error on logout", true);
        set({ error });
      })
      .finally(() => {
        set({ isLoading: false });
      });
  },
}));

export default useAuthStore;
