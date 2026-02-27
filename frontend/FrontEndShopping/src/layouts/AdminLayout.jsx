import {
  DashboardOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  OrderedListOutlined,
  ShoppingOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Dropdown,
  Layout,
  Menu,
  Space,
  Typography,
} from "antd";
import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const menuItems = [
  // { key: "/admin", icon: <DashboardOutlined />, label: "แดชบอร์ด" },
  { key: "/admin/products", icon: <ShoppingOutlined />, label: "จัดการสินค้า" },
  {
    key: "/admin/orders",
    icon: <OrderedListOutlined />,
    label: "รายการคำสั่งซื้อ",
  },
  {
    key: "/admin/users",
    icon: <TeamOutlined />,
    label: "จัดการผู้ใช้",
  },
];

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    
    navigate("/login");
  };

  const dropdownItems = [
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "ออกจากระบบ",
      onClick: handleLogout,
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{ background: "#001529" }}
        width={220}
      >
        <div
          style={{
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontSize: collapsed ? 16 : 20,
            fontWeight: "bold",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          {collapsed ? "🏪" : "🏪Admin"}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            background: "#fff",
            padding: "0 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: 18 }}
          />
          <Dropdown menu={{ items: dropdownItems }} placement="bottomRight">
            <Space style={{ cursor: "pointer" }}>
              <Avatar
                style={{ backgroundColor: "#6366f1" }}
                icon={<UserOutlined />}
              />
              <Text strong>{user?.username}</Text>
              <Text type="secondary" style={{ fontSize: 12 }}>
                (Admin)
              </Text>
            </Space>
          </Dropdown>
        </Header>
        <Content style={{ margin: 24, background: "#f5f5f5", minHeight: 280 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
