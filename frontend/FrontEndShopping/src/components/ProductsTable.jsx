import React from 'react'
import { Table, Tag, Button, Popconfirm, Space } from 'antd'
import { CloseOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons'

export default function ProductsTable({ handleDelete,openEdit, products , loading}) {
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      sorter: (a, b) => a.id - b.id
    },
    {
      title: 'ชื่อสินค้า',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name)
    },
    
    {
      title: 'Code',
      dataIndex: 'code',  
      key: 'code',
      width: 120,
      sorter: (a, b) => a.code.localeCompare(b.code)
    },
    {title: 'รายละเอียด', dataIndex: 'description', key: 'description'},
    {
      title: 'ราคา',
      dataIndex: 'price',
      key: 'price',
      render: (v) =>
        `฿${Number(v).toLocaleString("th-TH", { minimumFractionDigits: 2 })}`,
    
      sorter: (a, b) => a.price - b.price
    },
    {
      title: 'คงเหลือ',
      dataIndex: 'stock',
      key: 'stock',
       render: (v) => (
        <Tag color={v === 0 ? "red" : v <= 10 ? "orange" : "green"}>
          {v === 0 ? "หมด" : `${v} ชิ้น`}
        </Tag>
      ),
    },
    {
      title: 'สถานะ',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 80,
        render: (v) => (
        <Tag color={v ? "green" : "default"}>{v ? "เปิดขาย" : "ปิด"}</Tag>
      ),
      
    },
       {
      title: "จัดการ",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => openEdit(record)}
          >
            แก้ไข
          </Button>
          <Popconfirm 
            title="ยืนยันการลบ?"
            onConfirm={() => handleDelete(record.id)}
            okText="ลบ"
            cancelText="ยกเลิก"
          >
            <Button size="small" danger icon={<CloseOutlined />}>
              ปิดการใช้
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]



  return (
    <Table
      columns={columns}
      dataSource={products}
      rowKey="id"
      pagination={{ pageSize: 10 }}
      scroll={{ x: 1000 }}
      loading={loading}
    />
  )
}
