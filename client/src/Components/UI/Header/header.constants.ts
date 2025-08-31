import useAuthStore from "@store/auth-store";
import { type MenuProps } from "antd";

import { useMemo } from "react";

export const useDropdownOptions = (): MenuProps["items"] => {
  const { logout } = useAuthStore();
  const dropdownItems = useMemo<MenuProps["items"]>(
    () => [
      { key: "1", label: "My profile" },
      { key: "2", label: "Orders" },
      { type: "divider" },
      {
        key: "3",
        label: "Logout",
        onClick: () => {
          logout();
        },
      },
    ],
    [logout] // зависит от logout — он, вероятно, стабилен, но указываем для чистоты
  );

  return dropdownItems;
};
