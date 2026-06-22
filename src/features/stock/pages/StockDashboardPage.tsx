import { useNavigate } from 'react-router-dom'
import { Card, Row, Col, Table, Button, Typography, Progress, Tag, Space, Statistic } from 'antd'
import { PlusOutlined, WarningOutlined, ArrowRightOutlined } from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import { mockProducts } from '@shared/mocks/data'
import { formatCurrency } from '@shared/utils'
import { colorTokens } from '@styles/tokens'

const { Title } = Typography

export default function StockDashboardPage() {
  const navigate = useNavigate()
  const { data: products = [] } = useQuery({ queryKey: ['products'], queryFn: async () => { await new Promise(r => setTimeout(r, 300)); return mockProducts } })
  const trackedProducts = products.filter(p => p.stockTracking)
  const lowStock = trackedProducts.filter(p => p.stock !== null && p.stock <= 5)
  const totalValue = trackedProducts.reduce((s, p) => s + (p.stock ?? 0) * p.unitPrice, 0)

  const columns = [
    { title: 'Product', dataIndex: 'name', key: 'name', render: (v: string) => <strong>{v}</strong> },
    { title: 'SKU', dataIndex: 'sku', key: 'sku', render: (v: string) => <code style={{ fontSize: 12 }}>{v}</code> },
    {
      title: 'Stock Level', key: 'level',
      render: (_: unknown, r: typeof mockProducts[0]) => {
        const pct = Math.min(100, ((r.stock ?? 0) / 50) * 100)
        const color = (r.stock ?? 0) <= 5 ? colorTokens.error : (r.stock ?? 0) <= 15 ? colorTokens.warning : colorTokens.success
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Progress percent={pct} showInfo={false} strokeColor={color} style={{ flex: 1, minWidth: 80 }} />
            <span style={{ fontWeight: 700, color, minWidth: 28, textAlign: 'right' }}>{r.stock}</span>
          </div>
        )
      },
    },
    {
      title: 'Status', key: 'stockStatus',
      render: (_: unknown, r: typeof mockProducts[0]) => {
        const s = r.stock ?? 0
        if (s <= 5) return <Tag color="error" icon={<WarningOutlined />}>Low Stock</Tag>
        if (s <= 15) return <Tag color="warning">Moderate</Tag>
        return <Tag color="success">In Stock</Tag>
      },
    },
    { title: 'Value', key: 'value', align: 'right' as const, render: (_: unknown, r: typeof mockProducts[0]) => <span style={{ fontWeight: 600 }}>{formatCurrency((r.stock ?? 0) * r.unitPrice)}</span> },
  ]

  return (
    <div className="page-container">
      <div className="flex-between" style={{ marginBottom: 20 }}>
        <Title level={4} style={{ margin: 0 }}>Stock Overview</Title>
        <Space>
          <Button onClick={() => navigate('/app/stock/movements')}>View Movements</Button>
          <Button onClick={() => navigate('/app/stock/out')}>Stock Out</Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/app/stock/in')}>Stock In</Button>
        </Space>
      </div>

      <Row gutter={[16,16]} style={{ marginBottom: 24 }}>
        {[
          { title: 'Total SKUs Tracked', value: trackedProducts.length },
          { title: 'Low Stock Alerts', value: lowStock.length, color: lowStock.length > 0 ? colorTokens.error : undefined },
          { title: 'Total Stock Value', value: formatCurrency(totalValue) },
        ].map(s => (
          <Col key={s.title} xs={24} sm={8}>
            <Card size="small" style={{ borderRadius: 10 }}>
              <Statistic title={s.title} value={s.value} valueStyle={{ fontSize: 22, fontWeight: 700, color: s.color }} />
            </Card>
          </Col>
        ))}
      </Row>

      {lowStock.length > 0 && (
        <Card title={<Space><WarningOutlined style={{ color: colorTokens.warning }} /> Low Stock Alerts</Space>}
          style={{ borderRadius: 12, marginBottom: 16, border: `1px solid ${colorTokens.warning}44` }}>
          <Space wrap>
            {lowStock.map(p => (
              <Tag key={p.id} color="warning" icon={<WarningOutlined />} style={{ fontSize: 13, padding: '4px 10px' }}>
                {p.name}: {p.stock} left
              </Tag>
            ))}
          </Space>
        </Card>
      )}

      <Card title={<>Stock Levels <Button type="link" size="small" onClick={() => navigate('/app/stock/movements')} style={{ float: 'right' }}>All movements <ArrowRightOutlined /></Button></>}
        style={{ borderRadius: 12 }}>
        <Table dataSource={trackedProducts} columns={columns} rowKey="id" size="middle" pagination={false} />
      </Card>
    </div>
  )
}
