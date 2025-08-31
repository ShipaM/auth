import type { LoginType, RegisterType } from "src/Forms/forms.type";
import { httpService } from "./http.service";
import type { User } from "src/types/user.types";

interface LoginResponse {
  accessToken: string;
}

const authEndPoint = "auth/";

const authService = {
  login: async (loginData: LoginType): Promise<LoginResponse> => {
    const { data } = await httpService.post(`${authEndPoint}login`, loginData);

    return data;
  },

  register: async (registerData: RegisterType): Promise<User> => {
    const { data } = await httpService.post(
      `${authEndPoint}register`,
      registerData
    );
    return data;
  },

  logout: async () => {
    await httpService.get(`${authEndPoint}logout`);
  },
};

export default authService;
