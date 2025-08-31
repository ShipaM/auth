export type LoginType = {
  userName: string;
  password: string;
};

export type RegisterType = {
  userName: string;
  password: string;
  repeatPassword: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

export type RegisterFormFormProps = {
  onFinish: (values: RegisterType) => void;
  onFinishFailed: (errorInfo: {
    values: RegisterType;
    errorFields: { name: (string | number)[]; errors: string[] }[];
    outOfDate: boolean;
  }) => void;
};

export type LoginFormProps = {
  onFinish: (values: LoginType) => void;
  onFinishFailed: (errorInfo: {
    values: LoginType;
    errorFields: { name: (string | number)[]; errors: string[] }[];
    outOfDate: boolean;
  }) => void;
};

export type Segment = "login" | "register";
