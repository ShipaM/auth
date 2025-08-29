import { Form, Input, type FormProps, type FormInstance } from "antd";
import { memo, type FC } from "react";
import type { LoginType } from "../forms.type";
import SubmitFormButton from "../components/SubmitFormButton";
import { http } from "../../services/http.service";
import { handleHttpError } from "../../utils/handl-http-error/handle-http-error";

type LoginFormProps = {
  form: FormInstance<LoginType>;
};

const LoginForm: FC<LoginFormProps> = ({ form }) => {
  const handleFinishLogin: FormProps<LoginType>["onFinish"] = async (
    values
  ) => {
    console.log("Success:", values);
    try {
      await http.post("auth/login", values);
    } catch (error: unknown) {
      handleHttpError(error, "Registration error");
    }
  };

  return (
    <Form
      form={form}
      name="login"
      initialValues={{ remember: true }}
      onFinish={handleFinishLogin}
      autoComplete="off"
      style={{ margin: "40px 0" }}
    >
      <Form.Item<LoginType>
        label="Username"
        name="username"
        rules={[{ required: true, message: "Please enter your username!" }]}
      >
        <Input autoComplete="username" />
      </Form.Item>

      <Form.Item<LoginType>
        label="Password"
        name="password"
        rules={[{ required: true, message: "Please enter your password!" }]}
      >
        <Input.Password autoComplete="current-password" />
      </Form.Item>

      <SubmitFormButton title="Login" />
    </Form>
  );
};

export default memo(LoginForm);
