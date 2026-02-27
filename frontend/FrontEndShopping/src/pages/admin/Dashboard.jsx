import {
  DollarOutlined,
  ShoppingCartOutlined,
  ShoppingOutlined,
  TrophyOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import {
  Alert,
  Card,
  Col,
  Row,
  Spin,
  Statistic,
  Table,
  Tag,
  Typography,
} from "antd";
import { useEffect, useState } from "react";
import api from "../../utils/api";

const { Title } = Typography;

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [lowStock, setLowStock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, lowStockRes] = await Promise.all([
          api.get("/dashboard/stats"),
          api.get("/dashboard/low-stock"),
        ]);
        setStats(statsRes.data);
        setLowStock(lowStockRes.data);
      } catch {
        setError("ไม่สามารถโหลดข้อมูลได้");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading)
    return (
      <div style={{ textAlign: "center", padding: 80 }}>
        <Spin size="large" />
      </div>
    );
  if (error) return <Alert type="error" message={error} />;

  const topProductColumns = [
    { title: "#", render: (_, __, i) => i + 1, width: 50 },
    { title: "สินค้า", dataIndex: "productName", key: "productName" },
    {
      title: "จำนวนที่ขาย",
      dataIndex: "totalSold",
      key: "totalSold",
      render: (v) => `${v} ชิ้น`,
    },
    {
      title: "รายได้",
      dataIndex: "totalRevenue",
      key: "totalRevenue",
      render: (v) =>
        `฿${v.toLocaleString("th-TH", { minimumFractionDigits: 2 })}`,
    },
  ];

  const lowStockColumns = [
    { title: "ชื่อสินค้า", dataIndex: "name", key: "name" },
    { title: "หมวดหมู่", dataIndex: "category", key: "category" },
    {
      title: "คงเหลือ",
      dataIndex: "stock",
      key: "stock",
      render: (v) => (
        <Tag color={v === 0 ? "red" : "orange"}>
          {v === 0 ? "หมด" : `${v} ชิ้น`}
        </Tag>
      ),
    },
    {
      title: "ราคา",
      dataIndex: "price",
      key: "price",
      render: (v) =>
        `฿${v.toLocaleString("th-TH", { minimumFractionDigits: 2 })}`,
    },
  ];

  return (
    <div>
      <Title level={4} style={{ marginBottom: 24 }}>
        📊 แดชบอร์ด
      </Title>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="สินค้าทั้งหมด"
              value={stats.totalProducts}
              prefix={<ShoppingOutlined style={{ color: "#6366f1" }} />}
              suffix="รายการ"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="สต็อกใกล้หมด (≤50)"
              value={stats.lowStockCount}
              prefix={<WarningOutlined style={{ color: "#f59e0b" }} />}
              suffix="รายการ"
              valueStyle={{
                color: stats.lowStockCount > 0 ? "#f59e0b" : "#52c41a",
              }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="คำสั่งซื้อทั้งหมด"
              value={stats.totalOrders}
              prefix={<ShoppingCartOutlined style={{ color: "#06b6d4" }} />}
              suffix="รายการ"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="รายได้รวม"
              value={stats.totalRevenue}
              prefix={<DollarOutlined style={{ color: "#10b981" }} />}
              suffix="บาท"
              precision={2}
              valueStyle={{ color: "#10b981" }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={12}>
          <Card
            title={
              <>
                <TrophyOutlined /> สินค้าขายดี Top 5
              </>
            }
            bordered={false}
          >
            <Table
              dataSource={stats.topProducts}
              columns={topProductColumns}
              rowKey="productName"
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card
            title={
              <>
                <WarningOutlined style={{ color: "#f59e0b" }} /> สินค้าสต็อกต่ำ
              </>
            }
            bordered={false}
          >
            <Table
              dataSource={lowStock}
              columns={lowStockColumns}
              rowKey="id"
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
