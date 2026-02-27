import {
  CheckCircleOutlined,

  ShoppingOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Divider,
  Empty,
  InputNumber,
  message,
  Popconfirm,
  Row,
  Space,

  Typography,
} from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import api from "../../utils/api";
import CartTable from "../../components/CartTabel";

const { Title, Text } = Typography;

export default function Cart() {
  const { items, removeItem, updateQuantity, clearCart, total, count } =
    useCart();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCheckout = async () => {
    if (items.length === 0) return;
    setLoading(true);
    try {
      const payload = {
        items: items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
        })),
      };
      //call api to create order
      const { data } = await api.post("/orders", payload);
      clearCart();
      message.success(
        `ชำระเงินสำเร็จ! เลขที่ #${data.id} ยอดรวม ฿${Number(data.totalAmount).toLocaleString("th-TH", { minimumFractionDigits: 2 })}`,
      );
      navigate("/shop/orders");
    } catch (e) {
      message.error(e.response?.data?.message || "ชำระเงินไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  };

  // const columns = [
  //   { title: "สินค้า", dataIndex: "name", key: "name" },
  //   {
  //     title: "ราคา/หน่วย",
  //     dataIndex: "price",
  //     key: "price",
  //     render: (v) =>
  //       `฿${Number(v).toLocaleString("th-TH", { minimumFractionDigits: 2 })}`,
  //   },
  //   {
  //     title: "จำนวน",
  //     key: "quantity",
  //     render: (_, record) => (
  //       <InputNumber
  //         min={1}
  //         max={record.stock}
  //         value={record.quantity}
  //         onChange={(val) => updateQuantity(record.productId, val)}
  //         style={{ width: 80 }}
  //       />
  //     ),
  //   },
  //   {
  //     title: "รวม",
  //     key: "subtotal",
  //     render: (_, r) => (
  //       <Text strong style={{ color: "#6366f1" }}>
  //         ฿
  //         {(r.price * r.quantity).toLocaleString("th-TH", {
  //           minimumFractionDigits: 2,
  //         })}
  //       </Text>
  //     ),
  //   },
  //   {
  //     title: "",
  //     key: "remove",
  //     render: (_, r) => (
  //       <Popconfirm
  //         title="ลบสินค้านี้?"
  //         onConfirm={() => removeItem(r.productId)}
  //         okText="ลบ"
  //         cancelText="ยกเลิก"
  //       >
  //         <Button danger icon={<DeleteOutlined />} size="small" />
  //       </Popconfirm>
  //     ),
  //   },
  // ];

  if (items.length === 0) {
    return (
      <Card>
        <Empty
          image={
            <ShoppingOutlined style={{ fontSize: 80, color: "#d1d5db" }} />
          }
          description="ตะกร้าสินค้าว่างเปล่า"
        >
          <Button type="primary" onClick={() => navigate("/shop")}>
            เลือกสินค้า
          </Button>
        </Empty>
      </Card>
    );
  }

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} lg={16}>
        <Card
          title={
            <Title level={4} style={{ margin: 0 }}>
              🛒 ตะกร้าสินค้า ({count} ชิ้น)
            </Title>
          }
          extra={
            <Popconfirm
              title="ล้างตะกร้าทั้งหมด?"
              onConfirm={clearCart}
              okText="ล้าง"
              cancelText="ยกเลิก"
            >
              <Button danger size="small">
                ล้างทั้งหมด
              </Button>
            </Popconfirm>
          }
          bordered={false}
        >
       
          <CartTable
            items={items}
            updateQuantity={updateQuantity}
            removeItem={removeItem}
          />
        </Card>
      </Col>

      <Col xs={24} lg={8}>
        <Card
          title="สรุปคำสั่งซื้อ"
          bordered={false}
          style={{ position: "sticky", top: 80 }}
        >
          <Space direction="vertical" style={{ width: "100%" }}>
            {items.map((i) => (
              <div
                key={i.productId}
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                <Text type="secondary">
                  {i.name} × {i.quantity}
                </Text>
                <Text>
                  ฿
                  {(i.price * i.quantity).toLocaleString("th-TH", {
                    minimumFractionDigits: 2,
                  })}
                </Text>
              </div>
            ))}
            <Divider style={{ margin: "8px 0" }} />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Title level={5} style={{ margin: 0 }}>
                ยอดรวม
              </Title>
              <Title level={4} style={{ margin: 0, color: "#6366f1" }}>
                ฿{total.toLocaleString("th-TH", { minimumFractionDigits: 2 })}
              </Title>
            </div>
            <Button
              type="primary"
              size="large"
              block
              icon={<CheckCircleOutlined />}
              loading={loading}
              onClick={handleCheckout}
              style={{ background: "#6366f1", borderColor: "#6366f1" }}
            >
              ชำระเงิน
            </Button>
          </Space>
        </Card>
      </Col>
    </Row>
  );
}
