import { Flex, Typography, Button } from "antd";
import { memo, type FC } from "react";

type AuthHeaderButtonProps = { showModal: () => void };

const AuthHeaderButton: FC<AuthHeaderButtonProps> = ({ showModal }) => {
  const flexStyle = { height: "100%" };

  return (
    <Flex style={flexStyle} align="center" justify="space-between">
      <Typography.Text>Auth</Typography.Text>
      <Button type="primary" onClick={showModal}>
        Login
      </Button>
    </Flex>
  );
};

export default memo(AuthHeaderButton);
