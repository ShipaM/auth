import { Flex, Button } from "antd";
import { memo, type FC } from "react";

type AuthHeaderButtonProps = { showModal: () => void };

const AuthHeaderButton: FC<AuthHeaderButtonProps> = ({ showModal }) => {
  const flexStyle = {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  };

  return (
    <Flex style={flexStyle}>
      <Button type="primary" onClick={showModal}>
        Login
      </Button>
    </Flex>
  );
};

export default memo(AuthHeaderButton);
