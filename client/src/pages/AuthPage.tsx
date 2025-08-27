import { Modal, Segmented } from "antd";
import { memo, type FC } from "react";
import { options } from "../Forms/forms.constants";
import type { Segment } from "../Forms/forms.type";
import LoginForm from "../Forms/Login/LoginForm";
import RegisterForm from "../Forms/Register/RegisterForm";

type AuthPageProps = {
  segment: Segment;
  onChangeSegment: (value: Segment) => void;
  isModalOpen: boolean;
  cancelModal: () => void;
};

const AuthPage: FC<AuthPageProps> = ({
  segment,
  onChangeSegment,
  isModalOpen,
  cancelModal,
}) => {
  return (
    <Modal
      title="Login"
      closable={{ "aria-label": "Custom Close Button" }}
      open={isModalOpen}
      onCancel={cancelModal}
      footer={false}
      width={500}
    >
      <Segmented
        options={options}
        block
        onChange={(value) => onChangeSegment(value as Segment)}
      />
      {segment === "login" ? <LoginForm /> : <RegisterForm />}
    </Modal>
  );
};

export default memo(AuthPage);
