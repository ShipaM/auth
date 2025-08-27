import { Layout } from "antd";
import { memo, useCallback, useState } from "react";
import type { Segment } from "../../../Forms/forms.type";
import AuthPage from "../../../pages/AuthPage";
import AuthHeaderButton from "./components/AuthHeaderButton";

const headerStyle = {
  textAlign: "center",
  color: "#fff",
  height: 64,
  paddingInline: 48,
  lineHeight: "64px",
  backgroundColor: "#222425",
} as const;

const Header = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [segment, setSegment] = useState<Segment>("login");

  const handleSegmentChange = useCallback(
    (value: Segment) => {
      if (!value) return;
      setSegment(value);
    },
    [setSegment]
  );

  const showModal = useCallback(() => {
    setIsModalOpen(true);
  }, [setIsModalOpen]);

  const handleCancel = useCallback(() => {
    setIsModalOpen(false);
  }, [setIsModalOpen]);

  return (
    <Layout.Header style={headerStyle}>
      <AuthHeaderButton showModal={showModal} />
      <AuthPage
        segment={segment}
        onChangeSegment={handleSegmentChange}
        isModalOpen={isModalOpen}
        cancelModal={handleCancel}
      />
    </Layout.Header>
  );
};

export default memo(Header);
