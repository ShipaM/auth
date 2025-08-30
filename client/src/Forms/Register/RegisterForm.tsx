import { Form, Input, type FormProps, type FormInstance } from "antd";
import { memo, type FC } from "react";
import type { RegisterType } from "../forms.type";
import { httpService } from "../../services/http.service";
import { regexPatterns } from "../../utils/regex/regex";
import { handleHttpError } from "../../utils/handl-http-error/handle-http-error";
import SubmitFormButton from "../components/SubmitFormButton";

type RegisterFormFormProps = {
  form: FormInstance<RegisterType>;
};

const RegisterForm: FC<RegisterFormFormProps> = ({ form }) => {
  const handleFinishRegister: FormProps<RegisterType>["onFinish"] = async (
    values
  ) => {
    console.log("Success:", values);
    try {
      await httpService.post("auth/register", values);
    } catch (error: unknown) {
      handleHttpError(error, "Registration error");
    }
  };

  return (
    <Form
      form={form}
      name="register"
      initialValues={{ remember: true }}
      onFinish={handleFinishRegister}
      autoComplete="off"
      style={{ margin: "40px 0" }}
    >
      <Form.Item<RegisterType>
        label="First Name"
        name="firstName"
        rules={[
          { required: true, message: "Please enter your first name!" },
          { min: 3, max: 30, message: "Please enter from 3 to 20 characters" },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item<RegisterType>
        label="Last name"
        name="lastName"
        rules={[
          { required: true, message: "Please enter your last name!" },
          { min: 3, max: 30, message: "Please enter from 3 to 20 characters" },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item<RegisterType>
        label="Username"
        name="username"
        rules={[
          { required: true, message: "Please enter your username!" },
          { min: 3, max: 30, message: "Please enter from 3 to 20 characters" },
        ]}
      >
        <Input autoComplete="username" />
      </Form.Item>

      <Form.Item<RegisterType>
        label="Email"
        name="email"
        rules={[
          { required: true, message: "Please enter your email!" },
          {
            pattern: regexPatterns.EMAIL,
            message: "Please enter a valid email address",
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item<RegisterType>
        label="Phone"
        name="phone"
        rules={[
          { required: true, message: "Please enter your phone!" },
          { min: 6, max: 20, message: "Please enter from 6 to 20 characters" },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item<RegisterType>
        label="Password"
        name="password"
        rules={[
          { required: true, message: "Please enter your password!" },
          { min: 8, message: "Password should be min 8 characters long" },
          {
            pattern: regexPatterns.PASSWORD,
            message:
              "Password should contain at least one uppercase letter, one lowercase letter, one number and one special character",
          },
        ]}
      >
        <Input.Password autoComplete="current-password" />
      </Form.Item>

      <Form.Item<RegisterType>
        label="Repeat Password"
        name="repeatPassword"
        rules={[
          { required: true, message: "Please repeat your password!" },
          {
            min: 8,
            message: "Repeted password should be min 8 characters long",
          },
          {
            pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{8,}$/,
            message:
              "Password should contain at least one uppercase letter, one lowercase letter, one number and one special character",
          },
          {
            validator(_, value) {
              const password = form.getFieldValue("password");
              if (!value || password !== value) {
                return Promise.reject(
                  new Error("Введенные пароли не совпадают!")
                );
              }

              return Promise.resolve();
            },
          },
        ]}
      >
        <Input.Password autoComplete="new-password" />
      </Form.Item>
      <SubmitFormButton title="Register" />
    </Form>
  );
};

export default memo(RegisterForm);
