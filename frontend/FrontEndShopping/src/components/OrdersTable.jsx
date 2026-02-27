import React from 'react'
import { Table, Tag, Typography } from 'antd'

import dayjs from "dayjs";

const { Text } = Typography;
export default function OrdersTable({  orders , loading , expandedRowRender}) {
   const columns = [
     { title: "เลขที่", dataIndex: "id", width: 80 },
     { title: "ผู้สั่งซื้อ", dataIndex: "username" },
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
           completed: ["green", "สำเร็จ"],
           pending: ["orange", "รอดำเนินการ"],
           cancelled: ["red", "ยกเลิก"],
         };
         const [color, label] = map[v] ?? ["default", v];
         return <Tag color={color}>{label}</Tag>;
       },
     },
     {
       title: "วันที่",
       dataIndex: "createdAt",
       render: (v) => dayjs(v).format("DD/MM/YYYY"),
     },
     {
       title: "สินค้า",
       dataIndex: "items",
       render: (items) => `${items.reduce((s, i) => s + i.quantity, 0)} ชิ้น`,
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
      
    />
  )
}
