import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Layout, Menu, type MenuProps } from "antd";
import { type ItemType } from "antd/es/menu/interface";
import { useThemeStore } from "@/store/theme";
import { findParentNode } from "@/utils/common";
import styles from "./index.module.scss";

const { Sider } = Layout;
interface ReSiderProps {
  menuTree: ItemType[];
  collapsed: boolean;
  onCollapse: (broken: boolean) => void;
}

export default function ReSider({ menuTree, collapsed, onCollapse }: ReSiderProps) {
  const navigate = useNavigate();

  const isDark = useThemeStore(state => state.isDark);
  const { pathname } = useLocation();
  const [defaultKey, setDefaultKey] = useState("/groupSpace");
  const [defaultMenu, setDefaultMenu] = useState<string[]>([]);

  useEffect(() => {
    setDefaultKey(pathname);
    const res = findParentNode(pathname, menuTree);
    res ? setDefaultMenu([res.key]) : setDefaultMenu([]);
  }, [pathname, menuTree]);

  const changeRoutes: MenuProps["onSelect"] = ({ key }) => {
    setDefaultKey(key);
    navigate(key);
  };

  const openChange = (keys: string[]) => {
    if (keys.length) {
      setDefaultMenu(keys.slice(keys.length - 1));
    } else {
      setDefaultMenu([]);
    }
  };

  const breakpoint = (broken: boolean) => {
    onCollapse(broken);
  };

  return (
    <Sider
      breakpoint="xl"
      width="220"
      trigger={null}
      collapsible={true}
      collapsed={collapsed}
      onBreakpoint={breakpoint}
    >
      <div className={styles.title}>{!collapsed ? <span className="ml6">运维管理后台</span> : null}</div>
      <Menu
        theme={isDark === "dark" ? "dark" : "light"}
        mode="inline"
        selectedKeys={[defaultKey]}
        openKeys={defaultMenu}
        style={{ height: "100%" }}
        items={menuTree}
        onOpenChange={openChange}
        onSelect={changeRoutes}
      />
    </Sider>
  );
}
