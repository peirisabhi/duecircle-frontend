import { Card, Table, Tag, Row, Col, Statistic, Typography, Progress } from 'antd'
import { useQuery } from '@tanstack/react-query'
import { mockInvoices } from '@shared/mocks/data'
import { formatCurrency, formatDate } from '@shared/utils'
import { colorTokens } from '@styles/tokens'
import { StatusTag } from '@shared/components/ui/StatusTag'
import dayjs from 'dayjs'

const { Title } = Typography

function agingBucket(dueDate: string): string {
  const days = dayjs().diff(dayjs(dueDate), 'day')
  if (days <= 0) return 'Current'
  if (days <= 30) return '1-30 days'
  if (days <= 60) return '31-60 days'
  if (days <= 90) return '61-90 days'
  return '90+ days'
}

export default function OutstandingDuesPage() {
  const { data: invoices = [] } = useQuery({ queryKey: ['invoices'], queryFn: async () => mockInvoices })
  const outstanding = invoices.filter(i => i.status !== 'PAID' && i.status !== 'VOIDED' && i.status !== 'DRAFT')
  const totalOutstanding = outstanding.reduce((s, i) => s + (i.total - i.paid), 0)
  const totalOverdue = outstanding.filter(i => i.status === 'OVERDUE').reduce((s, i) => s + (i.total - i.paid), 0)

  const buckets: Record<string, number> = {}
  outstanding.forEach(i => {
    const b = agingBucket(i.dueDate)
    buckets[b] = (buckets[b] ?? 0) + (i.total - i.paid)
  })

  const columns = [
    { title: 'Invoice #', dataIndex: 'invoiceNumber', key: 'inv', render: (v: string) => <code style={{ fontSize: 12 }}>{v}</code> },
    { title: 'Customer', dataIndex: 'customerName', key: 'customer' },
    { title: 'Due Date', dataIndex: 'dueDate', key: 'due', render: (v: string) => formatDate(v) },
    {
      title: 'Aging', key: 'aging',
      render: (_: unknown, r: typeof mockInvoices[0]) => {
        const bucket = agingBucket(r.dueDate)
        const color = bucket === 'Current' ? 'success' : bucket === '1-30 days' ? 'warning' : 'error'
        return <Tag color={color}>{bucket}</Tag>
      },
    },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (v: string) => <StatusTag status={v} /> },
    { title: 'Invoice Total', dataIndex: 'total', key: 'total', align: 'right' as const, render: (v: number) => formatCurrency(v) },
    { title: 'Paid', dataIndex: 'paid', key: 'paid', align: 'right' as const, render: (v: number) => <span style={{ color: colorTokens.success }}>{formatCurrency(v)}</span> },
    { title: 'Balance', key: 'balance', align: 'right' as const, render: (_: unknown, r: typeof mockInvoices[0]) => <strong style={{ color: colorTokens.error }}>{formatCurrency(r.total - r.paid)}</strong> },
  ]

  return (
    <div className="page-container">
      <Title level={4} style={{ marginBottom: 20 }}>Outstanding Dues</Title>
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card size="small" style={{ borderRadius: 10 }}>
            <Statistic title="Total Outstanding" value={formatCurrency(totalOutstanding)} valueStyle={{ fontSize: 20, fontWeight: 700, color: colorTokens.warning }} />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card size="small" style={{ borderRadius: 10 }}>
            <Statistic title="Overdue Amount" value={formatCurrency(totalOverdue)} valueStyle={{ fontSize: 20, fontWeight: 700, color: colorTokens.error }} />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card size="small" style={{ borderRadius: 10 }}>
            <Statistic title="Outstanding Invoices" value={outstanding.length} valueStyle={{ fontSize: 20, fontWeight: 700 }} />
          </Card>
        </Col>
      </Row>

      <Card title="Aging Summary" style={{ borderRadius: 12, marginBottom: 16 }}>
        {Object.entries(buckets).map(([label, amount]) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div style={{ width: 100, fontWeight: 600, fontSize: 13 }}>{label}</div>
            <Progress percent={Math.round((amount / totalOutstanding) * 100)} strokeColor={label === 'Current' ? colorTokens.success : label === '1-30 days' ? colorTokens.warning : colorTokens.error} style={{ flex: 1 }} />
            <div style={{ width: 110, textAlign: 'right', fontWeight: 700 }}>{formatCurrency(amount)}</div>
          </div>
        ))}
      </Card>

      <Card title="Outstanding Invoices" style={{ borderRadius: 12 }}>
        <Table dataSource={outstanding} columns={columns} rowKey="id" size="middle" />
      </Card>
    </div>
  )
}
