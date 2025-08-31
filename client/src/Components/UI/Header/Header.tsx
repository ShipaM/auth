import { Layout, Spin } from "antd";
import { memo, useCallback, useEffect, useState } from "react";
import AuthPage from "../../../pages/AuthPage";
import AuthHeaderButton from "./components/AuthHeaderButton";
import HeaderDropdown from "./components/HeaderDropdown";
import useAuthStore from "@store/auth-store";
import useUserStore from "@store/user-store";
import { useDropdownOptions } from "./header.constants";
import LogoHeader from "./components/LogoHeader";

const headerStyle = {
  textAlign: "center",
  color: "#fff",
  height: 64,
  paddingInline: 48,
  lineHeight: "64px",
  backgroundColor: "#222425",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  width: "100%",
} as const;

const Header = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { isAuth, authUser } = useAuthStore();
  const { fetchUserById, selectedUser, isLoading } = useUserStore();

  const dropdownItems = useDropdownOptions();

  const authUserId = authUser?.userId;
  const authUserFullName = !isLoading ? (
    `${selectedUser?.lastName} ${selectedUser?.firstName}`
  ) : (
    <Spin />
  );

  const showModal = useCallback(() => {
    setIsModalOpen(true);
  }, [setIsModalOpen]);

  const handleCancel = useCallback(() => {
    setIsModalOpen(false);
  }, [setIsModalOpen]);

  useEffect(() => {
    if (authUserId) {
      fetchUserById(authUserId);
    }
  }, [fetchUserById, authUserId]);

  return (
    <Layout.Header style={headerStyle}>
      <LogoHeader />
      {!isAuth ? (
        <AuthHeaderButton showModal={showModal} />
      ) : (
        <HeaderDropdown
          items={dropdownItems}
          title={authUserFullName as string}
        />
      )}
      <AuthPage isModalOpen={isModalOpen} cancelModal={handleCancel} />
    </Layout.Header>
  );
};

export default memo(Header);
