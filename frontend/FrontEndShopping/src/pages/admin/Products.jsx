import {
  
  PlusOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  message,
  Space,
  
  Typography,
  Form,
} from "antd";
import ProductModal from "../../components/ProductModal";
import { useEffect, useState } from "react";
import api from "../../utils/api";
import ProductsTable from "../../components/ProductsTable";

const { Title } = Typography;

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form] = Form.useForm();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/products");
      setProducts(data);
    } catch {
      message.error("ไม่สามารถโหลดสินค้าได้");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openAdd = () => {
    setEditingProduct(null);
    form.resetFields();
    form.setFieldsValue({ isActive: true, stock: 0, price: 0 });
    setModalOpen(true);
  };

  const openEdit = (record) => {
    setEditingProduct(record);
    form.setFieldsValue(record);
    setModalOpen(true);
  };

  const handleSave = async (values) => {
    try {
      if (editingProduct) {
        
        await api.put(`/products/${editingProduct.id}`, values);
        message.success("อัปเดตสินค้าสำเร็จ");
      } else {
        await api.post("/products", values);
        message.success("เพิ่มสินค้าสำเร็จ");
      }
      setModalOpen(false);
      fetchProducts();
    } catch (e) {
      message.error(e.response?.data?.message || "บันทึกไม่สำเร็จ");
    }
  };

  const handleDelete = async (id) => {
    try {
      
      await api.delete(`/products/${id}`);
      message.success("ปิดการใช้สินค้าสำเร็จ");
      fetchProducts();
    } catch (e) {
      message.error(e.response?.data?.message || "ปิดการใช้สินค้าไม่สำเร็จ");
    }
  };

 

  return (
    <Card
      title={
        <Title level={4} style={{ margin: 0 }}>
          📦 จัดการสินค้า
        </Title>
      }
      extra={
        <Space>
          <Button icon={<ReloadOutlined />} onClick={fetchProducts}>
            รีเฟรช
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={openAdd}>
            เพิ่มสินค้า
          </Button>
        </Space>
      }
      bordered={false}
    >
    
      <ProductsTable
        products={products}
        handleDelete={handleDelete}
        openEdit={openEdit}
         loading={loading}
      />

      <ProductModal
        visible={modalOpen}
        editingProduct={editingProduct}
        onSave={handleSave}
        onCancel={() => setModalOpen(false)}
      />
    </Card>
  );
}
