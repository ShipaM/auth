import { Form, Input, Flex, Button, type FormProps } from "antd";
import { memo, type FC } from "react";
import type { RegisterType } from "../forms.type";

const RegisterForm: FC = () => {
  const handleFinishRegister: FormProps<RegisterType>["onFinish"] = (
    values
  ) => {
    console.log("Success:", values);
  };

  return (
    <Form
      name="register"
      initialValues={{ remember: true }}
      onFinish={handleFinishRegister}
      autoComplete="off"
      style={{ margin: "40px 0" }}
    >
      <Form.Item<RegisterType>
        label="First Name"
        name="firsName"
        rules={[{ required: true, message: "Please enter your first name!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item<RegisterType>
        label="Last name"
        name="lastName"
        rules={[{ required: true, message: "Please enter your last name!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item<RegisterType>
        label="Username"
        name="username"
        rules={[{ required: true, message: "Please input your username!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item<RegisterType>
        label="Email"
        name="email"
        rules={[{ required: true, message: "Please enter your email!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item<RegisterType>
        label="Password"
        name="password"
        rules={[{ required: true, message: "Please input your password!" }]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item<RegisterType>
        label="Repeat Password"
        name="passwordRepeat"
        rules={[{ required: true, message: "Please repeat your password!" }]}
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

export default memo(RegisterForm);
