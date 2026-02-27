import React from 'react'
import { Button, InputNumber, Popconfirm, Table,  Typography } from 'antd'
import { DeleteOutlined } from '@ant-design/icons';




const { Text } = Typography;

export default function CartTable({  items, updateQuantity ,removeItem}) {
   const columns = [
    { title: "สินค้า", dataIndex: "name", key: "name" },
    {
      title: "ราคา/หน่วย",
      dataIndex: "price",
      key: "price",
      render: (v) =>
        `฿${Number(v).toLocaleString("th-TH", { minimumFractionDigits: 2 })}`,
    },
    {
      title: "จำนวน",
      key: "quantity",
      render: (_, record) => (
        <InputNumber
          min={1}
          max={record.stock}
          value={record.quantity}
          onChange={(val) => updateQuantity(record.productId, val)}
          style={{ width: 80 }}
        />
      ),
    },
    {
      title: "รวม",
      key: "subtotal",
      render: (_, r) => (
        <Text strong style={{ color: "#6366f1" }}>
          ฿
          {(r.price * r.quantity).toLocaleString("th-TH", {
            minimumFractionDigits: 2,
          })}
        </Text>
      ),
    },
    {
      title: "",
      key: "remove",
      render: (_, r) => (
        <Popconfirm
          title="ลบสินค้านี้?"
          onConfirm={() => removeItem(r.productId)}
          okText="ลบ"
          cancelText="ยกเลิก"
        >
          <Button danger icon={<DeleteOutlined />} size="small" />
        </Popconfirm>
      ),
    },
  ];



  return (
    <Table
  columns={columns}
  dataSource={items || []}
  rowKey="productId"
  pagination={{ pageSize: 10 }}
  scroll={{ x: 1000 }}
/>
  )
}
