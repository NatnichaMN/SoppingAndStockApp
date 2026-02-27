import { ReloadOutlined } from "@ant-design/icons";
import { Button, Card, Typography } from "antd";

import { useEffect, useState } from "react";
import api from "../../utils/api";
import OrdersPerUserTable from "../../components/OrdersPerUserTable";
import OrderHistoryTable from "../../components/OrderHistoryTable";

const { Title} = Typography;

export default function UserOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/orders");
      setOrders(data);
    } catch {
      console.error("Failed to fetch orders");
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
          📋 ประวัติคำสั่งซื้อของฉัน
        </Title>
      }
      extra={
        <Button icon={<ReloadOutlined />} onClick={fetchOrders}>
          รีเฟรช
        </Button>
      }
      bordered={false}
    >
   
      <OrderHistoryTable orders={orders} loading={loading} expandedRowRender={expandedRowRender} />
    </Card>
  );
}
