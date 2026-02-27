import { LockOutlined, ShopOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input, message, Tabs, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const { Title, Text } = Typography;

export default function Login() {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [loginForm] = Form.useForm();
  const [registerForm] = Form.useForm();

  const handleLogin = async (values) => {
    try {
      const data = await login(values.username, values.password);
      message.success(`ยินดีต้อนรับ ${data.username}!`);
      navigate(data.role === "admin" ? "/admin" : "/shop");
    } catch (err) {
      message.error(err.response?.data?.message || "เข้าสู่ระบบไม่สำเร็จ");
    }
  };

  const handleRegister = async (values) => {
    try {
      await register(values.username, values.password);
      message.success("สมัครสมาชิกสำเร็จ!");
      navigate("/shop");
    } catch (err) {
      message.error(err.response?.data?.message || "สมัครสมาชิกไม่สำเร็จ");
    }
  };

  const items = [
    {
      key: "login",
      label: "เข้าสู่ระบบ",
      children: (
        <Form
          form={loginForm}
          onFinish={handleLogin}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: "กรุณากรอกชื่อผู้ใช้" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="ชื่อผู้ใช้" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "กรุณากรอกรหัสผ่าน" }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="รหัสผ่าน" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              เข้าสู่ระบบ
            </Button>
          </Form.Item>
          <Text type="secondary" style={{ fontSize: 12 }}>
            Admin: admin / admin1234
          </Text>
        </Form>
      ),
    },
    {
      key: "register",
      label: "สมัครสมาชิก",
      children: (
        <Form
          form={registerForm}
          onFinish={handleRegister}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: "กรุณากรอกชื่อผู้ใช้" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="ชื่อผู้ใช้" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              { required: true, message: "กรุณากรอกรหัสผ่าน" },
              { min: 6, message: "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร" },
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="รหัสผ่าน" />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
              { required: true, message: "กรุณายืนยันรหัสผ่าน" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value)
                    return Promise.resolve();
                  return Promise.reject(new Error("รหัสผ่านไม่ตรงกัน"));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="ยืนยันรหัสผ่าน"
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              สมัครสมาชิก
            </Button>
          </Form.Item>
        </Form>
      ),
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}
    >
      <Card
        style={{
          width: 400,
          borderRadius: 16,
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <ShopOutlined style={{ fontSize: 48, color: "#6366f1" }} />
          <Title level={3} style={{ margin: "8px 0 0" }}>
            Stock Shop
          </Title>
          <Text type="secondary">ระบบจัดการสินค้าและการขาย</Text>
        </div>
        <Tabs items={items} centered />
      </Card>
    </div>
  );
}
