import { Form, Input, Flex, Button, type FormProps } from "antd";
import { memo, type FC } from "react";
import type { LoginType } from "../forms.type";

const LoginForm: FC = () => {
  const handleFinishLogin: FormProps<LoginType>["onFinish"] = (values) => {
    console.log("Success:", values);
  };

  return (
    <Form
      name="login"
      initialValues={{ remember: true }}
      onFinish={handleFinishLogin}
      autoComplete="off"
      style={{ margin: "40px 0" }}
    >
      <Form.Item<LoginType>
        label="Username"
        name="username"
        rules={[{ required: true, message: "Please input your username!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item<LoginType>
        label="Password"
        name="password"
        rules={[{ required: true, message: "Please input your password!" }]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item label={null}>
        <Flex align="center" justify="center" style={{ marginTop: "20px" }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Flex>
      </Form.Item>
    </Form>
  );
};

export default memo(LoginForm);
