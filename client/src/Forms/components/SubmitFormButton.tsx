import { Form, Flex, Button } from "antd";
import { memo, type FC } from "react";

type SubmitFormButtonProps = {
  title: string;
};

const SubmitFormButton: FC<SubmitFormButtonProps> = ({ title }) => {
  const flexStyle = {
    marginTop: "30px",
    displa: "flex",
    jastifyContent: "center",
  };

  return (
    <Form.Item label={null}>
      <Flex align="center" justify="center" style={flexStyle}>
        <Button type="primary" htmlType="submit">
          {title}
        </Button>
      </Flex>
    </Form.Item>
  );
};

export default memo(SubmitFormButton);
