import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Table, Button, Input, Select, Space, Tag, Typography, Card, Badge, Dropdown } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { PlusOutlined, SearchOutlined, MoreOutlined, EditOutlined, DeleteOutlined, WarningOutlined } from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import { formatCurrency } from '@shared/utils'
import { StatusTag } from '@shared/components/ui/StatusTag'
import { mockProducts } from '@shared/mocks/data'
import { colorTokens } from '@styles/tokens'

const { Title, Text } = Typography

type Product = typeof mockProducts[0]

export default function ProductsListPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null)

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => { await new Promise(r => setTimeout(r, 400)); return mockProducts },
  })

  const categories = [...new Set(products.map(p => p.category))]

  const filtered = useMemo(() =>
    products.filter(p =>
      (!search || p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase())) &&
      (!categoryFilter || p.category === categoryFilter)
    ), [products, search, categoryFilter])

  const LOW_STOCK = 5

  const columns: ColumnsType<Product> = [
    { title: 'SKU', dataIndex: 'sku', key: 'sku', render: (v: string) => <Text style={{ fontFamily: 'monospace', fontSize: 12 }}>{v}</Text> },
    {
      title: 'Product', dataIndex: 'name', key: 'name',
      render: (v: string, r: Product) => (
        <div>
          <div style={{ fontWeight: 600 }}>{v}</div>
          <Text type="secondary" style={{ fontSize: 12 }}>{r.unit}</Text>
        </div>
      ),
    },
    { title: 'Category', dataIndex: 'category', key: 'category', render: (v: string) => <Tag>{v}</Tag> },
    { title: 'Price', dataIndex: 'unitPrice', key: 'unitPrice', align: 'right' as const, render: (v: number) => <span style={{ fontWeight: 600 }}>{formatCurrency(v)}</span>, sorter: (a: Product, b: Product) => a.unitPrice - b.unitPrice },
    { title: 'Tax', dataIndex: 'taxRate', key: 'taxRate', align: 'right' as const, render: (v: number) => `${v}%` },
    {
      title: 'Stock', dataIndex: 'stock', key: 'stock', align: 'right' as const,
      render: (v: number | null, r: Product) => {
        if (!r.stockTracking) return <Text type="secondary" style={{ fontSize: 12 }}>—</Text>
        const low = v !== null && v <= LOW_STOCK
        return (
          <Space>
            {low && <WarningOutlined style={{ color: colorTokens.warning }} />}
            <span style={{ fontWeight: 600, color: low ? colorTokens.warning : colorTokens.text }}>{v}</span>
          </Space>
        )
      },
    },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (v: string) => <StatusTag status={v} /> },
    {
      title: '', key: 'actions', width: 48,
      render: (_: unknown, r: Product) => (
        <Dropdown menu={{ items: [
          { key: 'edit', icon: <EditOutlined />, label: 'Edit', onClick: () => navigate(`/app/products/${r.id}/edit`) },
          { type: 'divider' as const },
          { key: 'delete', icon: <DeleteOutlined />, label: 'Delete', danger: true },
        ]}} trigger={['click']}>
          <Button type="text" icon={<MoreOutlined />} onClick={e => e.stopPropagation()} />
        </Dropdown>
      ),
    },
  ]

  const lowStockCount = products.filter(p => p.stockTracking && p.stock !== null && p.stock <= LOW_STOCK).length

  return (
    <div className="page-container">
      <div className="flex-between" style={{ marginBottom: 20 }}>
        <div>
          <Title level={4} style={{ margin: 0 }}>Products</Title>
          {lowStockCount > 0 && <Badge count={`${lowStockCount} low stock`} color={colorTokens.warning} style={{ marginLeft: 8 }} />}
        </div>
        <Space>
          <Button onClick={() => navigate('/app/products/units')}>Units</Button>
          <Button onClick={() => navigate('/app/products/warehouses')}>Warehouses</Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/app/products/new')}>New Product</Button>
        </Space>
      </div>

      <Card style={{ borderRadius: 12 }}>
        <Space style={{ marginBottom: 16 }} wrap>
          <Input prefix={<SearchOutlined style={{ color: colorTokens.textTertiary }} />} placeholder="Search by name or SKU..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: 280 }} allowClear />
          <Select placeholder="All categories" value={categoryFilter} onChange={setCategoryFilter} allowClear style={{ width: 160 }}
            options={categories.map(c => ({ value: c, label: c }))} />
        </Space>
        <Table dataSource={filtered} columns={columns} rowKey="id" loading={isLoading} size="middle"
          pagination={{ pageSize: 20, showSizeChanger: true, showTotal: t => `${t} products` }}
          onRow={r => ({ onClick: () => navigate(`/app/products/${r.id}/edit`), style: { cursor: 'pointer' } })} />
      </Card>
    </div>
  )
}
