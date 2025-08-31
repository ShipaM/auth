import type { User } from "src/types/user.types";
import { httpService } from "./http.service";

const userEndPoint = "user/";

const userService = {
  create: async (user: Partial<User>): Promise<User> => {
    const { data } = await httpService.post(userEndPoint, user);
    return data;
  },

  findAll: async (): Promise<User[]> => {
    const { data } = await httpService.get(`${userEndPoint}find-all`);
    return data;
  },

  findById: async (id: string): Promise<User> => {
    const { data } = await httpService.get(`${userEndPoint}find-by-id/${id}`);
    return data;
  },

  findByUsername: async (userName: string): Promise<User> => {
    const { data } = await httpService.get(
      `${userEndPoint}find-by-username/${userName}`
    );
    return data;
  },

  findByEmail: async (email: string): Promise<User> => {
    const { data } = await httpService.get(
      `${userEndPoint}find-by-email/${email}`
    );
    return data;
  },

  findByPhone: async (phone: string): Promise<User> => {
    const { data } = await httpService.get(
      `${userEndPoint}find-by-phone/${phone}`
    );
    return data;
  },

  update: async (id: string, user: Partial<User>): Promise<User> => {
    const { data } = await httpService.patch(`${userEndPoint}${id}`, user);
    return data;
  },

  remove: async (id: string): Promise<void> => {
    await httpService.delete(`${userEndPoint}${id}`);
  },
};

export default userService;
