import { Modal, Segmented } from "antd";
import { memo, useCallback, useState, type FC } from "react";
import { options } from "../Forms/forms.constants";
import type { Segment } from "../Forms/forms.type";
import LoginForm from "../Forms/Login/LoginForm";
import RegisterForm from "../Forms/Register/RegisterForm";
import { useForm } from "antd/es/form/Form";

type AuthPageProps = {
  isModalOpen: boolean;
  cancelModal: () => void;
};

const AuthPage: FC<AuthPageProps> = ({ isModalOpen, cancelModal }) => {
  const [form] = useForm();

  const [segment, setSegment] = useState<Segment>("login");

  const handleSegmentChange = useCallback(
    (value: Segment) => {
      if (!value) return;
      setSegment(value);
    },
    [setSegment]
  );

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
        onChange={(value) => handleSegmentChange(value as Segment)}
      />
      {segment === "login" ? (
        <LoginForm form={form} onCancel={cancelModal} />
      ) : (
        <RegisterForm form={form} onCancel={cancelModal} />
      )}
    </Modal>
  );
};

export default memo(AuthPage);
