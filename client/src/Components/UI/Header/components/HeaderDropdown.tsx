import { Dropdown, type MenuProps, Space } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { type FC, memo, useState } from "react";

interface HeaderDropdownProps {
  items: MenuProps["items"];
  title: string;
}

const HeaderDropdown: FC<HeaderDropdownProps> = ({ items, title }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <Dropdown menu={{ items }} onOpenChange={() => setHovered(!hovered)}>
      <a onClick={(e) => e.preventDefault()}>
        <Space>
          {title}
          <DownOutlined
            style={{
              transform: `rotate(${hovered ? "180deg" : "0deg"})`,
              transition: "transform 0.2s ease-in",
            }}
          />
        </Space>
      </a>
    </Dropdown>
  );
};

export default memo(HeaderDropdown);
