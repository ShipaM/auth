import { create, type StateCreator } from "zustand";
import { immer } from "zustand/middleware/immer";
import { devtools } from "zustand/middleware";
import { persist, createJSONStorage } from "zustand/middleware";
import userService from "@services/user.service";
import { handleHttpError } from "@utils/handl-http-error/handle-http-error";
import type { User } from "src/types/user.types";

// 💾 Initial state
interface InitialUserState {
  users: User[];
  selectedUser: User | null;
  isLoading: boolean;
  error: unknown | null;
}

// 🛠 Actions
interface UserActions {
  fetchUsers: () => void;
  fetchUserById: (id: string) => void;
  fetchUserByUsername: (username: string) => void;
  fetchUserByEmail: (email: string) => void;
  fetchUserByPhone: (phone: string) => void;
  createUser: (user: Partial<User>) => void;
  updateUser: (id: string, user: Partial<User>) => void;
  deleteUser: (id: string) => void;
}

// 🧠 Store type
export type UseUserStore = InitialUserState & UserActions;

// ✅ Initial state
const initialState: InitialUserState = {
  users: [],
  selectedUser: null,
  isLoading: false,
  error: null,
};

// 🧩 Store creator (like tokenStore)
const userStore: StateCreator<
  UseUserStore,
  [
    ["zustand/immer", never],
    ["zustand/devtools", never],
    ["zustand/persist", unknown]
  ]
> = (set) => ({
  ...initialState,

  fetchUsers: () => {
    set((state) => {
      state.isLoading = true;
      state.error = null;
    });

    userService
      .findAll()
      .then((users) => {
        set((state) => {
          state.users = users;
        });
      })
      .catch((error) => {
        handleHttpError(error, "Error on fetch users");
        set((state) => {
          state.error = error;
        });
      })
      .finally(() => {
        set((state) => {
          state.isLoading = false;
        });
      });
  },

  fetchUserById: (id: string) => {
    set((state) => {
      state.isLoading = true;
      state.error = null;
    });

    userService
      .findById(id)
      .then((user) => {
        set((state) => {
          state.selectedUser = user;
        });
      })
      .catch((error) => {
        handleHttpError(error, "Error on fetch user by id");
        set((state) => {
          state.error = error;
        });
      })
      .finally(() => {
        set((state) => {
          state.isLoading = false;
        });
      });
  },

  fetchUserByUsername: (username: string) => {
    set((state) => {
      state.isLoading = true;
      state.error = null;
    });

    userService
      .findByUsername(username)
      .then((user) => {
        set((state) => {
          state.selectedUser = user;
        });
      })
      .catch((error) => {
        handleHttpError(error, "Error on fetch user by username");
        set((state) => {
          state.error = error;
        });
      })
      .finally(() => {
        set((state) => {
          state.isLoading = false;
        });
      });
  },

  fetchUserByEmail: (email: string) => {
    set((state) => {
      state.isLoading = true;
      state.error = null;
    });

    userService
      .findByEmail(email)
      .then((user) => {
        set((state) => {
          state.selectedUser = user;
        });
      })
      .catch((error) => {
        handleHttpError(error, "Error on fetch user by email");
        set((state) => {
          state.error = error;
        });
      })
      .finally(() => {
        set((state) => {
          state.isLoading = false;
        });
      });
  },

  fetchUserByPhone: (phone: string) => {
    set((state) => {
      state.isLoading = true;
      state.error = null;
    });

    userService
      .findByPhone(phone)
      .then((user) => {
        set((state) => {
          state.selectedUser = user;
        });
      })
      .catch((error) => {
        handleHttpError(error, "Error on fetch user by phone number");
        set((state) => {
          state.error = error;
        });
      })
      .finally(() => {
        set((state) => {
          state.isLoading = false;
        });
      });
  },

  createUser: (user: Partial<User>) => {
    set((state) => {
      state.isLoading = true;
      state.error = null;
    });

    userService
      .create(user)
      .then((newUser) => {
        set((state) => {
          state.users.push(newUser);
        });
      })
      .catch((error) => {
        handleHttpError(error, "Error on create user");
        set((state) => {
          state.error = error;
        });
      })
      .finally(() => {
        set((state) => {
          state.isLoading = false;
        });
      });
  },

  updateUser: (id: string, user: Partial<User>) => {
    set((state) => {
      state.isLoading = true;
      state.error = null;
    });

    userService
      .update(id, user)
      .then((updatedUser) => {
        set((state) => {
          const index = state.users.findIndex((u) => u.id === id);
          if (index !== -1) state.users[index] = updatedUser;
          state.selectedUser = updatedUser;
        });
      })
      .catch((error) => {
        handleHttpError(error, "Error on update user");
        set((state) => {
          state.error = error;
        });
      })
      .finally(() => {
        set((state) => {
          state.isLoading = false;
        });
      });
  },

  deleteUser: (id: string) => {
    set((state) => {
      state.isLoading = true;
      state.error = null;
    });

    userService
      .remove(id)
      .then(() => {
        set((state) => {
          state.users = state.users.filter((u) => u.id !== id);
          if (state.selectedUser?.id === id) {
            state.selectedUser = null;
          }
        });
      })
      .catch((error) => {
        handleHttpError(error, "Error on delete user");
        set((state) => {
          state.error = error;
        });
      })
      .finally(() => {
        set((state) => {
          state.isLoading = false;
        });
      });
  },
});

// ✅ Create store with middlewares
const useUserStore = create<UseUserStore>()(
  immer(
    devtools(
      persist(userStore, {
        name: "user-storage",
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          users: state.users,
          selectedUser: state.selectedUser,
        }), // Сохраняем только нужные данные
      })
    )
  )
);

export default useUserStore;
