import { Card, Row, Col, Statistic, Table, Typography, DatePicker } from 'antd'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { useQuery } from '@tanstack/react-query'
import { mockSalesData, mockInvoices } from '@shared/mocks/data'
import { formatCurrency, formatDate } from '@shared/utils'
import { colorTokens } from '@styles/tokens'
import { StatusTag } from '@shared/components/ui/StatusTag'

const { Title } = Typography

export default function SalesReportPage() {
  const { data: invoices = [] } = useQuery({ queryKey: ['invoices'], queryFn: async () => mockInvoices })
  const totalSales = mockSalesData.reduce((s, d) => s + d.sales, 0)
  const totalCollected = mockSalesData.reduce((s, d) => s + d.collected, 0)
  const totalInvoices = mockSalesData.reduce((s, d) => s + d.invoices, 0)

  const columns = [
    { title: 'Invoice #', dataIndex: 'invoiceNumber', key: 'invoiceNumber', render: (v: string) => <code style={{ fontSize: 12 }}>{v}</code> },
    { title: 'Customer', dataIndex: 'customerName', key: 'customerName' },
    { title: 'Date', dataIndex: 'issueDate', key: 'issueDate', render: (v: string) => formatDate(v) },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (v: string) => <StatusTag status={v} /> },
    { title: 'Total', dataIndex: 'total', key: 'total', align: 'right' as const, render: (v: number) => <strong>{formatCurrency(v)}</strong> },
    { title: 'Paid', dataIndex: 'paid', key: 'paid', align: 'right' as const, render: (v: number) => <span style={{ color: colorTokens.success }}>{formatCurrency(v)}</span> },
    { title: 'Balance', key: 'balance', align: 'right' as const, render: (_: unknown, r: typeof mockInvoices[0]) => { const b = r.total - r.paid; return <span style={{ color: b > 0 ? colorTokens.error : colorTokens.success, fontWeight: 600 }}>{formatCurrency(b)}</span> } },
  ]

  return (
    <div className="page-container">
      <div className="flex-between" style={{ marginBottom: 20 }}>
        <Title level={4} style={{ margin: 0 }}>Sales Report</Title>
        <DatePicker.RangePicker style={{ borderRadius: 8 }} />
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {[
          { title: 'Total Revenue (YTD)', value: formatCurrency(totalSales) },
          { title: 'Total Collected', value: formatCurrency(totalCollected), color: colorTokens.success },
          { title: 'Outstanding', value: formatCurrency(totalSales - totalCollected), color: colorTokens.warning },
          { title: 'Total Invoices', value: totalInvoices },
        ].map(s => (
          <Col key={s.title} xs={24} sm={6}>
            <Card size="small" style={{ borderRadius: 10 }}>
              <Statistic title={s.title} value={s.value} valueStyle={{ fontSize: 20, fontWeight: 700, color: s.color }} />
            </Card>
          </Col>
        ))}
      </Row>

      <Card title="Monthly Sales vs Collections" style={{ borderRadius: 12, marginBottom: 16 }}>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={mockSalesData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="gradSales" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colorTokens.primary} stopOpacity={0.2} />
                <stop offset="95%" stopColor={colorTokens.primary} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradCollected" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colorTokens.success} stopOpacity={0.2} />
                <stop offset="95%" stopColor={colorTokens.success} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={colorTokens.border} />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: colorTokens.textSecondary }} />
            <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 12, fill: colorTokens.textSecondary }} />
            <Tooltip formatter={(v: number) => formatCurrency(v)} />
            <Legend />
            <Area type="monotone" dataKey="sales" name="Sales" stroke={colorTokens.primary} fill="url(#gradSales)" strokeWidth={2} />
            <Area type="monotone" dataKey="collected" name="Collected" stroke={colorTokens.success} fill="url(#gradCollected)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      <Card title="Invoice Details" style={{ borderRadius: 12 }}>
        <Table dataSource={invoices} columns={columns} rowKey="id" size="middle" />
      </Card>
    </div>
  )
}
