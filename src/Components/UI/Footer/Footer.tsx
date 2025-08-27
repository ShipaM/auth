import { Layout } from "antd";
import { memo } from "react";

const footerStyle = {
  textAlign: "center",
  color: "#fff",
  backgroundColor: "#222425",
} as const;

const Footer = () => {
  return <Layout.Footer style={footerStyle}>Footer</Layout.Footer>;
};

export default memo(Footer);
