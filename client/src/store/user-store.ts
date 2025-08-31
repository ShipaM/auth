import { create } from "zustand";
import userService from "@services/user.service";
import type { User } from "src/types/user.types";
import { handleHttpError } from "@utils/handl-http-error/handle-http-error";

interface UseUserStore {
  users: User[];
  selectedUser: User | null;
  isLoading: boolean;
  error: null | unknown;
  fetchUsers: () => void;
  fetchUserById: (id: string) => void;
  fetchUserByUsername: (username: string) => void;
  fetchUserByEmail: (email: string) => void;
  fetchUserByPhone: (phone: string) => void;
  createUser: (user: Partial<User>) => void;
  updateUser: (id: string, user: Partial<User>) => void;
  deleteUser: (id: string) => void;
}

const useUserStore = create<UseUserStore>((set) => ({
  users: [],
  selectedUser: null,
  isLoading: false,
  error: null,

  fetchUsers: () => {
    set({ isLoading: true, error: null });
    userService
      .findAll()
      .then((users) => set({ users }))
      .catch((error) => {
        handleHttpError(error, "Error on find all users");
        set({ error });
      })
      .finally(() => set({ isLoading: false }));
  },

  fetchUserById: (id: string) => {
    set({ isLoading: true, error: null });
    userService
      .findById(id)
      .then((user) => set({ selectedUser: user }))
      .catch((error) => {
        handleHttpError(error, "Error on find user by id");
        set({ error });
      })
      .finally(() => set({ isLoading: false }));
  },

  fetchUserByUsername: (username: string) => {
    set({ isLoading: true, error: null });
    userService
      .findByUsername(username)
      .then((user) => set({ selectedUser: user }))
      .catch((error) => {
        handleHttpError(error, "Error on find user by username");
        set({ error });
      })
      .finally(() => set({ isLoading: false }));
  },

  fetchUserByEmail: (email: string) => {
    set({ isLoading: true, error: null });
    userService
      .findByEmail(email)
      .then((user) => set({ selectedUser: user }))
      .catch((error) => {
        handleHttpError(error, "Error on find user by email");
        set({ error });
      })
      .finally(() => set({ isLoading: false }));
  },

  fetchUserByPhone: (phone: string) => {
    set({ isLoading: true, error: null });
    userService
      .findByPhone(phone)
      .then((user) => set({ selectedUser: user }))
      .catch((error) => {
        handleHttpError(error, "Error on find user by phone number");
        set({ error });
      })
      .finally(() => set({ isLoading: false }));
  },

  createUser: (user: Partial<User>) => {
    set({ isLoading: true, error: null });
    userService
      .create(user)
      .then((newUser) => {
        set((state) => ({ users: [...state.users, newUser] }));
      })
      .catch((error) => {
        handleHttpError(error, "Error on create user");
        set({ error });
      })
      .finally(() => set({ isLoading: false }));
  },

  updateUser: (id: string, user: Partial<User>) => {
    set({ isLoading: true, error: null });
    userService
      .update(id, user)
      .then((updatedUser) => {
        set((state) => ({
          users: state.users.map((u) => (u.id === id ? updatedUser : u)),
          selectedUser: updatedUser,
        }));
      })
      .catch((error) => {
        handleHttpError(error, "Error on update user");
        set({ error });
      })
      .finally(() => set({ isLoading: false }));
  },

  deleteUser: (id: string) => {
    set({ isLoading: true, error: null });
    userService
      .remove(id)
      .then(() => {
        set((state) => ({
          users: state.users.filter((u) => u.id !== id),
          selectedUser: null,
        }));
      })
      .catch((error) => {
        handleHttpError(error, "Error on delete user");
        set({ error });
      })
      .finally(() => set({ isLoading: false }));
  },
}));

export default useUserStore;
