import { Layout } from "antd";
import { memo } from "react";

const contentStyle = {
  textAlign: "center",
  minHeight: 120,
  lineHeight: "120px",
  color: "#fff",
  backgroundColor: "#000",
} as const;

const Content = () => {
  return <Layout.Content style={contentStyle}>Content</Layout.Content>;
};

export default memo(Content);
