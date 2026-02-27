import { ReloadOutlined } from "@ant-design/icons";
import { Button, Card,  Typography } from "antd";

import { useEffect, useState } from "react";
import api from "../../utils/api";
import OrdersTable from "../../components/OrdersTable";
import OrdersPerUserTable from "../../components/OrdersPerUserTable";

const { Title } = Typography;

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/orders");
      setOrders(data);
    } catch (error) {
      console.error("Failed to fetch orders", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const expandedRowRender = (record) => (
    
    <OrdersPerUserTable productId={record.items} />
  );

  return (
    <Card
      title={
        <Title level={4} style={{ margin: 0 }}>
          🧾 รายการคำสั่งซื้อ
        </Title>
      }
      extra={
        <Button icon={<ReloadOutlined />} onClick={fetchOrders}>
          รีเฟรช
        </Button>
      }
      bordered={false}
    >
     
      <OrdersTable orders={orders} loading={loading} expandedRowRender={expandedRowRender} />
    </Card>
  );
}
