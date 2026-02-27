import React from 'react'
import { Table } from 'antd'

export default function OrdersPerUserTable({  productId }) {
  const  columns=[
        { title: "สินค้า", dataIndex: "productName" },
        {
          title: "ราคา/หน่วย",
          dataIndex: "unitPrice",
          render: (v) =>
            `฿${Number(v).toLocaleString("th-TH", { minimumFractionDigits: 2 })}`,
        },
        { title: "จำนวน", dataIndex: "quantity" },
        {
          title: "รวม",
          dataIndex: "subtotal",
          render: (v) =>
            `฿${Number(v).toLocaleString("th-TH", { minimumFractionDigits: 2 })}`,
        },
      ]


  return (
    <Table
      columns={columns}
      dataSource={productId}

      rowKey="productId"
      pagination={{ pageSize: 10 }}
      scroll={{ x: 1000 }}
    />
  )
}
