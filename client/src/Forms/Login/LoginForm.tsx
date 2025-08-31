import { Form, Input, type FormInstance, type FormProps } from "antd";
import { memo, type FC } from "react";
import type { LoginType } from "../forms.type";
import SubmitFormButton from "../components/SubmitFormButton";
import useAuthStore from "@store/auth-store";

type LoginFormProps = {
  form: FormInstance<LoginType>;
  onCancel: () => void;
};

const LoginForm: FC<LoginFormProps> = ({ form, onCancel }) => {
  const { login } = useAuthStore();

  const handleFinishLogin: FormProps<LoginType>["onFinish"] = (loginData) => {
    login(loginData).then((accessToken) => {
      if (accessToken) {
        onCancel();
        form.resetFields();
      }
    });
  };

  // const handleFinishLogin: FormProps<LoginType>["onFinish"] = async (
  //   values
  // ) => {
  //   try {
  //     const { data } = await httpService.post("auth/login", values);
  //     const accessToken: string = data.accessToken;

  //     if (!accessToken) {
  //       const message = "Token not found";
  //       throw new Error(message);
  //     }

  //     localStorage.setItem("token", accessToken);

  //     const decodedToken = jwtDecode(accessToken);
  //     console.log(decodedToken);
  //   } catch (error: unknown) {
  //     handleHttpError(error, "Registration error");
  //   }
  // };

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
        label="UserName"
        name="userName"
        rules={[{ required: true, message: "Please enter your user name!" }]}
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
