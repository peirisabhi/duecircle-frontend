import { Card, Table, Tag, Row, Col, Statistic, Typography } from 'antd'
import { useQuery } from '@tanstack/react-query'
import { mockProducts } from '@shared/mocks/data'
import { formatCurrency } from '@shared/utils'
import { colorTokens } from '@styles/tokens'

const { Title } = Typography

export default function StockValuationPage() {
  const { data: products = [] } = useQuery({ queryKey: ['products'], queryFn: async () => mockProducts })
  const tracked = products.filter(p => p.stockTracking)
  const totalValue = tracked.reduce((s, p) => s + (p.stock ?? 0) * p.unitPrice, 0)
  const lowStockCount = tracked.filter(p => (p.stock ?? 0) <= 5).length

  const columns = [
    { title: 'SKU', dataIndex: 'sku', key: 'sku', render: (v: string) => <code style={{ fontSize: 12 }}>{v}</code> },
    { title: 'Product', dataIndex: 'name', key: 'name', render: (v: string) => <strong>{v}</strong> },
    { title: 'Category', dataIndex: 'category', key: 'category', render: (v: string) => <Tag>{v}</Tag> },
    { title: 'Unit', dataIndex: 'unit', key: 'unit' },
    { title: 'Qty on Hand', dataIndex: 'stock', key: 'stock', align: 'right' as const,
      render: (v: number) => {
        const color = v <= 5 ? colorTokens.error : v <= 15 ? colorTokens.warning : colorTokens.success
        return <span style={{ fontWeight: 700, color }}>{v}</span>
      }
    },
    { title: 'Unit Cost', dataIndex: 'unitPrice', key: 'unitPrice', align: 'right' as const, render: (v: number) => formatCurrency(v) },
    { title: 'Total Value', key: 'value', align: 'right' as const,
      render: (_: unknown, r: typeof mockProducts[0]) => <strong style={{ color: colorTokens.primary }}>{formatCurrency((r.stock ?? 0) * r.unitPrice)}</strong>
    },
    { title: 'Stock Status', key: 'status', render: (_: unknown, r: typeof mockProducts[0]) => {
      const s = r.stock ?? 0
      if (s <= 5) return <Tag color="error">Low Stock</Tag>
      if (s <= 15) return <Tag color="warning">Moderate</Tag>
      return <Tag color="success">Healthy</Tag>
    }},
  ]

  return (
    <div className="page-container">
      <Title level={4} style={{ marginBottom: 20 }}>Stock Valuation</Title>
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {[
          { title: 'Total Inventory Value', value: formatCurrency(totalValue), color: colorTokens.primary },
          { title: 'Products Tracked', value: tracked.length },
          { title: 'Low Stock Items', value: lowStockCount, color: lowStockCount > 0 ? colorTokens.error : undefined },
        ].map(s => (
          <Col key={s.title} xs={24} sm={8}>
            <Card size="small" style={{ borderRadius: 10 }}>
              <Statistic title={s.title} value={s.value} valueStyle={{ fontSize: 20, fontWeight: 700, color: s.color }} />
            </Card>
          </Col>
        ))}
      </Row>

      <Card title="Inventory Valuation Report" style={{ borderRadius: 12 }}>
        <Table
          dataSource={tracked}
          columns={columns}
          rowKey="id"
          size="middle"
          summary={() => (
            <Table.Summary.Row>
              <Table.Summary.Cell index={0} colSpan={6}><strong>Total</strong></Table.Summary.Cell>
              <Table.Summary.Cell index={1} align="right"><strong style={{ color: colorTokens.primary }}>{formatCurrency(totalValue)}</strong></Table.Summary.Cell>
              <Table.Summary.Cell index={2} />
            </Table.Summary.Row>
          )}
        />
      </Card>
    </div>
  )
}
