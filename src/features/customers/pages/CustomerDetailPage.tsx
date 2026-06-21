import { useParams, useNavigate } from 'react-router-dom'
import { Card, Row, Col, Descriptions, Button, Table, Typography, Tag, Space, Statistic, Avatar, Tabs, Empty } from 'antd'
import { EditOutlined, ArrowLeftOutlined, PlusOutlined } from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import { mockCustomers, mockInvoices, mockPayments } from '@shared/mocks/data'
import { StatusTag } from '@shared/components/ui/StatusTag'
import { formatCurrency, formatDate, initials } from '@shared/utils'
import { colorTokens } from '@styles/tokens'

const { Title, Text } = Typography

export default function CustomerDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const { data: customer } = useQuery({
    queryKey: ['customer', id],
    queryFn: async () => { await new Promise(r => setTimeout(r, 300)); return mockCustomers.find(c => c.id === id) },
  })

  const invoices = mockInvoices.filter(i => i.customerId === id)
  const payments = mockPayments.filter(p => p.customerId === id)

  if (!customer) return null

  const invoiceColumns = [
    { title: 'Invoice #', dataIndex: 'invoiceNumber', key: 'invoiceNumber', render: (v: string, r: typeof mockInvoices[0]) => <a onClick={() => navigate(`/app/invoices/${r.id}`)}>{v}</a> },
    { title: 'Date', dataIndex: 'issueDate', key: 'issueDate', render: (v: string) => formatDate(v) },
    { title: 'Due', dataIndex: 'dueDate', key: 'dueDate', render: (v: string) => formatDate(v) },
    { title: 'Amount', dataIndex: 'total', key: 'total', align: 'right' as const, render: (v: number) => formatCurrency(v) },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (v: string) => <StatusTag status={v} /> },
  ]

  const paymentColumns = [
    { title: 'Reference', dataIndex: 'reference', key: 'reference' },
    { title: 'Date', dataIndex: 'date', key: 'date', render: (v: string) => formatDate(v) },
    { title: 'Method', dataIndex: 'method', key: 'method', render: (v: string) => <Tag>{v}</Tag> },
    { title: 'Amount', dataIndex: 'amount', key: 'amount', align: 'right' as const, render: (v: number) => <span style={{ fontWeight: 600, color: colorTokens.success }}>{formatCurrency(v)}</span> },
  ]

  return (
    <div className="page-container">
      <div className="flex-between" style={{ marginBottom: 20 }}>
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/app/customers')}>Customers</Button>
          <Title level={4} style={{ margin: 0 }}>{customer.name}</Title>
          <StatusTag status={customer.status} />
        </Space>
        <Space>
          <Button icon={<PlusOutlined />} onClick={() => navigate('/app/invoices/new')}>New Invoice</Button>
          <Button type="primary" icon={<EditOutlined />} onClick={() => navigate(`/app/customers/${id}/edit`)}>Edit</Button>
        </Space>
      </div>

      <Row gutter={[16, 16]}>
        {/* Left: profile */}
        <Col xs={24} lg={8}>
          <Card style={{ borderRadius: 12 }}>
            <div style={{ textAlign: 'center', padding: '16px 0 24px' }}>
              <Avatar size={72} style={{ background: colorTokens.primary, fontSize: 24, fontWeight: 700, marginBottom: 12 }}>{initials(customer.name)}</Avatar>
              <Title level={4} style={{ margin: 0 }}>{customer.name}</Title>
              <Text type="secondary">{customer.email}</Text>
              <br /><Text type="secondary">{customer.phone}</Text>
              <br /><Text type="secondary">{customer.city}, {customer.country}</Text>
            </div>
            <Row gutter={16}>
              <Col span={12}><Statistic title="Outstanding" value={formatCurrency(customer.balance)} valueStyle={{ fontSize: 16, fontWeight: 700, color: customer.balance > 0 ? colorTokens.error : colorTokens.success }} /></Col>
              <Col span={12}><Statistic title="Invoices" value={invoices.length} valueStyle={{ fontSize: 16, fontWeight: 700 }} /></Col>
            </Row>
          </Card>
        </Col>

        {/* Right: transactions */}
        <Col xs={24} lg={16}>
          <Card style={{ borderRadius: 12 }} styles={{ body: { padding: 0 } }}>
            <Tabs
              style={{ padding: '0 20px' }}
              items={[
                {
                  key: 'invoices', label: `Invoices (${invoices.length})`,
                  children: (
                    <Table dataSource={invoices} columns={invoiceColumns} rowKey="id" size="small"
                      pagination={false} style={{ marginTop: 8 }}
                      locale={{ emptyText: <Empty description="No invoices yet" style={{ padding: 32 }} /> }} />
                  ),
                },
                {
                  key: 'payments', label: `Payments (${payments.length})`,
                  children: (
                    <Table dataSource={payments} columns={paymentColumns} rowKey="id" size="small"
                      pagination={false} style={{ marginTop: 8 }}
                      locale={{ emptyText: <Empty description="No payments yet" style={{ padding: 32 }} /> }} />
                  ),
                },
              ]}
            />
          </Card>
        </Col>
      </Row>
    </div>
  )
}
