import {
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Switch,
  Row,
  Col,
} from "antd";
import { useEffect } from "react";
import { PRODUCT_CATEGORIES } from "../utils/constants";


export default function ProductModal({
  visible,
  editingProduct,
  onSave,
  onCancel,
}) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (editingProduct) {
      form.setFieldsValue(editingProduct);
    } else {
      form.resetFields();
      form.setFieldsValue({ isActive: true, stock: 0, price: 0 });
    }
  }, [editingProduct, form]);

  const handleFinish = (values) => {
    onSave(values);
  };

  return (
    <Modal
      title={editingProduct ? "แก้ไขสินค้า" : "เพิ่มสินค้าใหม่"}
      open={visible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      okText="บันทึก"
      cancelText="ยกเลิก"
      width={560}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Row gutter={[16, 0]}>
          <Col xs={24} sm={24}>
            <Form.Item
              label="ชื่อสินค้า"
              name="name"
              rules={[{ required: true, message: "กรุณากรอกชื่อสินค้า" }]}
            >
              <Input placeholder="กรอกชื่อสินค้า" size="large" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 0]}>
          <Col xs={24} sm={24}>
            <Form.Item label="รหัสสินค้า" name="code" rules={[{ required: true, message: "กรุณากรอกรหัสสินค้า" }]}>
              <Input placeholder="กรอกรหัสสินค้า" 
              disabled={editingProduct}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 0]}>
          <Col xs={24} sm={24}>
            <Form.Item label="รายละเอียดสินค้า" name="description" rules={[{ required: true, message: "กรุณากรอกรายละเอียดสินค้า" }]}>
              <Input.TextArea placeholder="กรอกรายละเอียดสินค้า" rows={4} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 0]}>
          <Col xs={24} sm={24}>
            <Form.Item
              name="category"
              label="หมวดหมู่"
              rules={[{ required: true }]}
            >
              <Select
                placeholder="เลือกหมวดหมู่"
                options={PRODUCT_CATEGORIES}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 0]}>
          <Col xs={24} sm={24}>
            <Form.Item
              label="ราคา"
              name="price"
              rules={[{ required: true, message: "กรุณากรอกราคาสินค้า" }]}
            >
              <InputNumber
                placeholder="กรอกราคาสินค้า"
                style={{ width: "100%" }}
                min={0}
                formatter={(value) =>
                  `฿ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value.replace(/฿\s?|(,*)/g, "")}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 0]}>
          <Col xs={24} sm={24}>
            <Form.Item
              name="stock"
              label="จำนวนสต็อก"
              rules={[{ required: true }]}
            >
              <InputNumber
                placeholder="กรอกจำนวนสต็อก"
                min={0}
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 0]}>
          <Col xs={24} sm={24}>
            <Form.Item name="imageUrl" label="URL รูปภาพ">
              <Input placeholder="กรอก URL รูปภาพ" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 0]}>
          <Col xs={24} sm={24}>
            <Form.Item name="isActive" label="เปิดขาย" valuePropName="checked">
              <Switch checkedChildren="เปิด" unCheckedChildren="ปิด" />
            </Form.Item>
          </Col>
        </Row>

      
      </Form>
    </Modal>
  );
}
