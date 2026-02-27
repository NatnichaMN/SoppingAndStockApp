import React from 'react'
import { Table, Tag, Typography } from 'antd'
import dayjs from "dayjs";

const { Text } = Typography;
export default function OrderHistoryTable({  orders , loading , expandedRowRender}) {
   const columns = [
     { title: "เลขที่", dataIndex: "id", width: 80, render: (v) => `#${v}` },
     {
       title: "ยอดรวม",
       dataIndex: "totalAmount",
       render: (v) => (
         <Text strong style={{ color: "#10b981" }}>
           ฿{Number(v).toLocaleString("th-TH", { minimumFractionDigits: 2 })}
         </Text>
       ),
     },
     {
       title: "สถานะ",
       dataIndex: "status",
       render: (v) => {
         const map = {
           completed: ["green", "✅ สำเร็จ"],
           pending: ["orange", "⏳ รอดำเนินการ"],
           cancelled: ["red", "❌ ยกเลิก"],
         };
         const [color, label] = map[v] ?? ["default", v];
         return <Tag color={color}>{label}</Tag>;
       },
     },
     {
       title: "รายการสินค้า",
       dataIndex: "items",
       render: (items) =>
         items.map((i) => `${i.productName} ×${i.quantity}`).join(", "),
       ellipsis: true,
     },
     {
       title: "วันที่สั่งซื้อ",
       dataIndex: "createdAt",
       render: (v) => dayjs(v).format("DD/MM/YYYY"),
     },
   ];



  return (
    <Table
      columns={columns}
      dataSource={orders}
      rowKey="id"
      pagination={{ pageSize: 10 }}
      scroll={{ x: 1000 }}
      loading={loading}
      expandable={{ expandedRowRender }}
      locale={{ emptyText: "ยังไม่มีคำสั่งซื้อ" }}
      
    />
  )
}
