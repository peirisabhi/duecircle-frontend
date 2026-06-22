import { useState } from 'react'
import { Card, Table, Tag, Select, DatePicker, Space, Typography, Button } from 'antd'
import { ArrowDownOutlined, ArrowUpOutlined, SwapOutlined, PlusOutlined } from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { mockStockMovements, mockProducts } from '@shared/mocks/data'
import { formatCurrency } from '@shared/utils'
import { colorTokens } from '@styles/tokens'

const { Title } = Typography

const TYPE_CONFIG: Record<string, { color: string; icon: React.ReactNode; label: string }> = {
  IN:       { color: colorTokens.success, icon: <ArrowDownOutlined />, label: 'Stock In' },
  OUT:      { color: colorTokens.error,   icon: <ArrowUpOutlined />,   label: 'Stock Out' },
  TRANSFER: { color: colorTokens.primary, icon: <SwapOutlined />,      label: 'Transfer' },
}

export default function StockMovementsPage() {
  const navigate = useNavigate()
  const [typeFilter, setTypeFilter] = useState<string | null>(null)
  const [productFilter, setProductFilter] = useState<string | null>(null)

  const { data: movements = [] } = useQuery({
    queryKey: ['stock-movements'],
    queryFn: async () => { await new Promise(r => setTimeout(r, 300)); return mockStockMovements },
  })

  const filtered = movements.filter(m =>
    (!typeFilter || m.type === typeFilter) &&
    (!productFilter || m.productId === productFilter)
  )

  const columns = [
    {
      title: 'Type', dataIndex: 'type', key: 'type', width: 110,
      render: (v: string) => {
        const c = TYPE_CONFIG[v]
        return <Tag icon={c?.icon} style={{ color: c?.color, border: `1px solid ${c?.color}33`, background: `${c?.color}11`, fontWeight: 600, fontSize: 11 }}>{c?.label}</Tag>
      },
    },
    { title: 'Date', dataIndex: 'date', key: 'date', width: 110 },
    { title: 'Product', dataIndex: 'productName', key: 'productName', render: (v: string) => <strong>{v}</strong> },
    { title: 'Warehouse', dataIndex: 'warehouseName', key: 'warehouseName' },
    { title: 'Qty', dataIndex: 'quantity', key: 'quantity', align: 'right' as const, width: 70, render: (v: number, r: typeof mockStockMovements[0]) => <span style={{ color: r.type === 'IN' ? colorTokens.success : r.type === 'OUT' ? colorTokens.error : colorTokens.primary, fontWeight: 600 }}>{r.type === 'OUT' ? '-' : '+'}{v}</span> },
    { title: 'Unit Cost', dataIndex: 'unitCost', key: 'unitCost', align: 'right' as const, width: 100, render: (v: number) => formatCurrency(v) },
    { title: 'Total Cost', dataIndex: 'totalCost', key: 'totalCost', align: 'right' as const, width: 110, render: (v: number) => <strong>{formatCurrency(v)}</strong> },
    { title: 'Reference', dataIndex: 'reference', key: 'reference', render: (v: string) => <code style={{ fontSize: 12 }}>{v}</code> },
    { title: 'Created By', dataIndex: 'createdBy', key: 'createdBy', width: 120 },
  ]

  return (
    <div className="page-container">
      <div className="flex-between" style={{ marginBottom: 20 }}>
        <Title level={4} style={{ margin: 0 }}>Stock Movements</Title>
        <Space>
          <Button onClick={() => navigate('/app/stock/out')}>Stock Out</Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/app/stock/in')}>Stock In</Button>
        </Space>
      </div>

      <Card style={{ borderRadius: 12 }}>
        <Space style={{ marginBottom: 16 }} wrap>
          <Select allowClear placeholder="Filter by type" style={{ width: 160 }} onChange={setTypeFilter}
            options={[{ value: 'IN', label: 'Stock In' }, { value: 'OUT', label: 'Stock Out' }, { value: 'TRANSFER', label: 'Transfer' }]} />
          <Select allowClear placeholder="Filter by product" style={{ width: 220 }} onChange={setProductFilter}
            options={mockProducts.filter(p => p.stockTracking).map(p => ({ value: p.id, label: p.name }))} />
          <DatePicker.RangePicker style={{ borderRadius: 8 }} />
        </Space>
        <Table dataSource={filtered} columns={columns} rowKey="id" size="middle" />
      </Card>
    </div>
  )
}
