import { EditOutlined, ReloadOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Form,
  Input,
  message,
  Modal,
  Select,
  Table,
  Tag,
  Typography,
} from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import api from "../../utils/api";

const { Title } = Typography;

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/users");
      setUsers(data);
    } catch {
      message.error("ไม่สามารถโหลดข้อมูลผู้ใช้ได้");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openEdit = (record) => {
    setEditingUser(record);
    form.setFieldsValue({ username: record.username, role: record.role });
    setModalOpen(true);
  };

  const handleSave = async (values) => {
    try {
      await api.put(`/users/${editingUser.id}`, values);
      message.success("อัปเดตผู้ใช้สำเร็จ");
      setModalOpen(false);
      fetchUsers();
    } catch (e) {
      message.error(e.response?.data?.message || "บันทึกไม่สำเร็จ");
    }
  };

  const columns = [
    { title: "ID", dataIndex: "id", width: 60 },
    { title: "ชื่อผู้ใช้", dataIndex: "username" },
    {
      title: "Role",
      dataIndex: "role",
      render: (v) => (
        <Tag color={v === "admin" ? "purple" : "blue"}>
          {v === "admin" ? "Admin" : "User"}
        </Tag>
      ),
    },
    {
      title: "วันที่สมัคร",
      dataIndex: "createdAt",
      render: (v) => dayjs(v).format("DD/MM/YYYY"),
    },
    {
      title: "จัดการ",
      key: "action",
      render: (_, record) => (
        <Button
          size="small"
          icon={<EditOutlined />}
          onClick={() => openEdit(record)}
        >
          แก้ไข
        </Button>
      ),
    },
  ];

  return (
    <Card
      title={
        <Title level={4} style={{ margin: 0 }}>
          👤 จัดการผู้ใช้
        </Title>
      }
      extra={
        <Button icon={<ReloadOutlined />} onClick={fetchUsers}>
          รีเฟรช
        </Button>
      }
      bordered={false}
    >
      <Table
        dataSource={users}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={`แก้ไขผู้ใช้: ${editingUser?.username}`}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
        okText="บันทึก"
        cancelText="ยกเลิก"
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item
            name="username"
            label="ชื่อผู้ใช้"
            rules={[{ required: true, message: "กรุณากรอกชื่อผู้ใช้" }]}
          >
            <Input prefix="@" />
          </Form.Item>
          <Form.Item name="role" label="Role" rules={[{ required: true }]}>
            <Select
              options={[
                { value: "user", label: "User" },
                { value: "admin", label: "Admin" },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}
