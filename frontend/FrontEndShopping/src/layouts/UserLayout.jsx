import {
  LogoutOutlined,
  OrderedListOutlined,
  ShopOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Badge, Dropdown, Layout, Menu, Space, Typography } from "antd";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const { Header, Content } = Layout;
const { Text } = Typography;


export default function UserLayout() {
  const { user, logout } = useAuth();
  const { count ,clearCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    clearCart();
    logout();
    navigate("/login");
  };

  const menuItems = [
    { key: "/shop", icon: <ShopOutlined />, label: "สินค้า" },
    {
      key: "/shop/cart",
      icon: (
        <Badge count={count} size="small">
          <ShoppingCartOutlined style={{ fontSize: 16 }} />
        </Badge>
      ),
      label: "ตะกร้า",
    },
    { key: "/shop/orders", icon: <OrderedListOutlined />, label: "คำสั่งซื้อ" },
  ];

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
      <Header
        style={{
          background: "#fff",
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div
            style={{
              fontSize: 20,
              fontWeight: "bold",
              color: "#6366f1",
              cursor: "pointer",
            }}
            onClick={() => navigate("/shop")}
          >
            🏪 Stock Shop
          </div>
          <Menu
            mode="horizontal"
            selectedKeys={[location.pathname]}
            items={menuItems}
            onClick={({ key }) => navigate(key)}
            style={{ border: "none", minWidth: 300 }}
          />
        </div>
        <Dropdown menu={{ items: dropdownItems }} placement="bottomRight">
          <Space style={{ cursor: "pointer" }}>
            <Avatar
              style={{ backgroundColor: "#6366f1" }}
              icon={<UserOutlined />}
            />
            <Text strong>{user?.username}</Text>
          </Space>
        </Dropdown>
      </Header>
      <Content style={{ padding: 24, background: "#f5f5f5" }}>
        <Outlet />
      </Content>
    </Layout>
  );
}
