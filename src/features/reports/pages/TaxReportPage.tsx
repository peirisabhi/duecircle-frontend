import { Card, Table, Row, Col, Statistic, Typography, DatePicker, Tag } from 'antd'
import { useQuery } from '@tanstack/react-query'
import { mockInvoices } from '@shared/mocks/data'
import { formatCurrency, formatDate } from '@shared/utils'
import { colorTokens } from '@styles/tokens'

const { Title } = Typography

const TAX_RATE_LABELS: Record<number, string> = { 0: 'Exempt', 5: 'GST 5%', 10: 'GST 10%', 18: 'VAT 18%' }

export default function TaxReportPage() {
  const { data: invoices = [] } = useQuery({ queryKey: ['invoices'], queryFn: async () => mockInvoices })
  const paidInvoices = invoices.filter(i => i.status === 'PAID' || i.status === 'PARTIAL')

  // Mock tax breakdown — in real app this comes from line items
  const taxByRate = [
    { rate: 18, taxable: 18200, taxAmount: 3276, invoiceCount: 4 },
    { rate: 10, taxable: 9800, taxAmount: 980, invoiceCount: 5 },
    { rate: 5, taxable: 2400, taxAmount: 120, invoiceCount: 2 },
    { rate: 0, taxable: 34600, taxAmount: 0, invoiceCount: 8 },
  ]
  const totalTax = taxByRate.reduce((s, r) => s + r.taxAmount, 0)

  const columns = [
    { title: 'Tax Rate', dataIndex: 'rate', key: 'rate', render: (v: number) => <Tag color={v > 0 ? 'blue' : 'default'}>{TAX_RATE_LABELS[v] ?? `${v}%`}</Tag> },
    { title: 'Taxable Amount', dataIndex: 'taxable', key: 'taxable', align: 'right' as const, render: (v: number) => formatCurrency(v) },
    { title: 'Tax Collected', dataIndex: 'taxAmount', key: 'taxAmount', align: 'right' as const, render: (v: number) => <strong style={{ color: colorTokens.primary }}>{formatCurrency(v)}</strong> },
    { title: 'Invoices', dataIndex: 'invoiceCount', key: 'invoiceCount', align: 'right' as const },
  ]

  return (
    <div className="page-container">
      <div className="flex-between" style={{ marginBottom: 20 }}>
        <Title level={4} style={{ margin: 0 }}>Tax Report</Title>
        <DatePicker.RangePicker style={{ borderRadius: 8 }} />
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card size="small" style={{ borderRadius: 10 }}>
            <Statistic title="Total Tax Collected" value={formatCurrency(totalTax)} valueStyle={{ fontSize: 20, fontWeight: 700, color: colorTokens.primary }} />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card size="small" style={{ borderRadius: 10 }}>
            <Statistic title="Taxable Sales" value={formatCurrency(taxByRate.filter(r => r.rate > 0).reduce((s, r) => s + r.taxable, 0))} valueStyle={{ fontSize: 20, fontWeight: 700 }} />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card size="small" style={{ borderRadius: 10 }}>
            <Statistic title="Tax-Exempt Sales" value={formatCurrency(taxByRate.find(r => r.rate === 0)?.taxable ?? 0)} valueStyle={{ fontSize: 20, fontWeight: 700 }} />
          </Card>
        </Col>
      </Row>

      <Card title="Tax Breakdown by Rate" style={{ borderRadius: 12 }}>
        <Table
          dataSource={taxByRate}
          columns={columns}
          rowKey="rate"
          size="middle"
          pagination={false}
          summary={() => (
            <Table.Summary.Row>
              <Table.Summary.Cell index={0}><strong>Total</strong></Table.Summary.Cell>
              <Table.Summary.Cell index={1} align="right"><strong>{formatCurrency(taxByRate.reduce((s, r) => s + r.taxable, 0))}</strong></Table.Summary.Cell>
              <Table.Summary.Cell index={2} align="right"><strong style={{ color: colorTokens.primary }}>{formatCurrency(totalTax)}</strong></Table.Summary.Cell>
              <Table.Summary.Cell index={3} align="right"><strong>{taxByRate.reduce((s, r) => s + r.invoiceCount, 0)}</strong></Table.Summary.Cell>
            </Table.Summary.Row>
          )}
        />
      </Card>
    </div>
  )
}
