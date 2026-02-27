import { SearchOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Empty,
  Input,
  message,
  Row,
  Select,
  Spin,
  Tag,
  Typography,
} from "antd";
import { useEffect, useMemo, useState } from "react";
import { useCart } from "../../context/CartContext";
import api from "../../utils/api";

const { Title, Text } = Typography;
const { Search } = Input;

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("ทั้งหมด");
  const { addItem } = useCart();

  useEffect(() => {
    api
      .get("/products")
      .then(({ data }) => setProducts(data))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let result = products;
    if (search)
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.description.toLowerCase().includes(search.toLowerCase()),
      );
    if (category !== "ทั้งหมด")
      result = result.filter((p) => p.category === category);
    return result;
  }, [search, category, products]);

  const categories = useMemo(
    () => ["ทั้งหมด", ...new Set(products.map((p) => p.category))],
    [products],
  );

  const handleAddToCart = (product) => {
    if (product.stock === 0) return;
    addItem(product);
    message.success(`เพิ่ม "${product.name}" ลงตะกร้าแล้ว`);
  };
  const colorsStock = (stock) => {
    if (stock === 0) return "red";
    if (stock <= 10) return "orange";
    return "green";
  };

  const getNameButton = (product) => {
    return product.stock === 0 ? "สินค้าหมด" : "เพิ่มลงตะกร้า";
  };

  if (loading)
    return (
      <div style={{ textAlign: "center", padding: 80 }}>
        <Spin size="large" />
      </div>
    );

  return (
    <div>
      <Title level={4}>🛍️ สินค้าทั้งหมด</Title>
      {/* // Search and filter */}
      <Row gutter={12} style={{ marginBottom: 20 }}>
        <Col xs={24} sm={14}>
          <Search
            placeholder="ค้นหาสินค้า(ชื่อหรือคำอธิบาย)"
            prefix={<SearchOutlined />}
            allowClear
            onChange={(e) => setSearch(e.target.value)}
          />
        </Col>
        <Col xs={24} sm={10}>
          <Select
            value={category}
            onChange={setCategory}
            style={{ width: "100%" }}
            options={categories.map((c) => ({ value: c, label: c }))}
          />
        </Col>
      </Row>

{/* // Product grid and data cart */}
      {filtered.length === 0 ? (
        <Empty description="ไม่พบสินค้า" />
      ) : (
        <Row gutter={[16, 16]}>
          {filtered.map((product) => (
            <Col key={product.id} xs={24} sm={12} md={8} lg={6}>
              <Card
                hoverable
                cover={
                  product.imageUrl ? (
                    <img
                      alt={product.name}
                      src={product.imageUrl}
                      style={{
                        height: "80%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        height: 180,
                        background: "linear-gradient(135deg,#667eea,#764ba2)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 40,
                      }}
                    >
                      🛍️
                    </div>
                  )
                }
                actions={[
                  <Button
                    key="add"
                    type="primary"
                    icon={<ShoppingCartOutlined />}
                    disabled={product.stock === 0}
                    onClick={() => handleAddToCart(product)}
                    block
                    style={{ margin: "0 8px", width: "calc(100% - 16px)" }}
                  >
                   
                    {getNameButton(product)}
                  </Button>,
                ]}
              >
                <Card.Meta
                  title={product.name}
                  description={
                    <div>
                      <Tag color="blue" style={{ marginBottom: 8 }}>
                        {product.category}
                      </Tag>
                      <br />
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {product.description}
                      </Text>
                      <br />
                      <div
                        style={{
                          marginTop: 8,
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Text strong style={{ color: "#6366f1", fontSize: 18 }}>
                          ฿
                          {Number(product.price).toLocaleString("th-TH", {
                            minimumFractionDigits: 2,
                          })}
                        </Text>
                        <Tag color={colorsStock(product.stock)}>
                          เหลือ {product.stock}
                        </Tag>
                      </div>
                    </div>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}
