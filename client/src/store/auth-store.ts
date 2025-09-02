import { create, type StateCreator } from "zustand";
import { createJSONStorage, devtools } from "zustand/middleware";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

import authService from "@services/auth.service";
import { handleHttpError } from "@utils/handl-http-error/handle-http-error";
import { validateAndDecodeToken } from "@utils/token/validate-and-decode-token.utils";
import type { LoginType, RegisterType } from "src/Forms/forms.type";
import type { AccessDecodedToken } from "src/types/auth.type";

interface InitialAuthState {
  isAuth: boolean;
  authUser: AccessDecodedToken | null;
  isLoading: boolean;
  error: null | unknown;
}

type AuthActions = {
  login: (loginData: LoginType) => Promise<string | void>;
  register: (registerData: RegisterType) => Promise<void>;
  logout: () => Promise<void>;
};

type UseAuthStore = InitialAuthState & AuthActions;

const initialState: InitialAuthState = {
  isAuth: false,
  authUser: null,
  isLoading: false,
  error: null,
};

const authStore: StateCreator<
  UseAuthStore,
  [
    ["zustand/immer", never],
    ["zustand/devtools", never],
    ["zustand/persist", unknown]
  ]
> = (set, get) => ({
  ...initialState,

  login: async (loginData: LoginType) => {
    set((state) => {
      state.isLoading = true;
      state.error = null;
    });

    try {
      const data = await authService.login(loginData);
      const accessToken: string = data.accessToken;

      if (!accessToken) {
        throw new Error("Tokens not found");
      }

      localStorage.setItem("token", accessToken);

      const decodedToken = validateAndDecodeToken(accessToken);

      if (!decodedToken) {
        throw new Error("Tokens not found");
      }

      set((state) => {
        state.isAuth = true;
        state.authUser = decodedToken;
      });

      return accessToken;
    } catch (error) {
      handleHttpError(error, "Error on login", true);
      set((state) => {
        state.error = error;
      });
    } finally {
      set((state) => {
        state.isLoading = false;
      });
    }
  },

  register: async (registerData: RegisterType) => {
    set((state) => {
      state.isLoading = true;
      state.error = null;
    });

    try {
      await authService.register(registerData);

      // Автоматический логин после успешной регистрации
      await get().login({
        userName: registerData.userName,
        password: registerData.password,
      });
    } catch (error) {
      handleHttpError(error, "Error on registration", true);
      set((state) => {
        state.error = error;
      });
    } finally {
      set((state) => {
        state.isLoading = false;
      });
    }
  },

  logout: async () => {
    set((state) => {
      state.isLoading = true;
      state.error = null;
    });

    try {
      await authService.logout();

      localStorage.removeItem("token");

      set((state) => {
        state.isAuth = false;
        state.authUser = null;
      });
    } catch (error) {
      handleHttpError(error, "Error on logout", true);
      set((state) => {
        state.error = error;
      });
    } finally {
      set((state) => {
        state.isLoading = false;
      });
    }
  },
});

const useAuthStore = create<UseAuthStore>()(
  immer(
    devtools(
      persist(authStore, {
        name: "auth-storage",
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          isAuth: state.isAuth,
          authUser: state.authUser,
        }),
      })
    )
  )
);

export default useAuthStore;
