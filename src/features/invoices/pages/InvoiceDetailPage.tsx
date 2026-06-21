import { useParams, useNavigate } from 'react-router-dom'
import { Card, Button, Typography, Space, Descriptions, Table, Timeline, Modal, Tag, Row, Col, Divider } from 'antd'
import { ArrowLeftOutlined, EditOutlined, SendOutlined, PrinterOutlined, DollarOutlined, StopOutlined, CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { mockInvoices, mockPayments } from '@shared/mocks/data'
import { StatusTag } from '@shared/components/ui/StatusTag'
import { AmountSummary } from '@shared/components/ui/AmountSummary'
import { formatDate, formatCurrency, formatDateTime } from '@shared/utils'
import { colorTokens } from '@styles/tokens'
import { App } from 'antd'

const { Title, Text } = Typography

const MOCK_ITEMS = [
  { key: '1', description: 'Web Design Services', qty: 1, unitPrice: 1200, tax: 0, amount: 1200 },
  { key: '2', description: 'SEO Package', qty: 1, unitPrice: 800, tax: 0, amount: 800 },
  { key: '3', description: 'Annual Hosting', qty: 1, unitPrice: 240, tax: 43, amount: 283 },
]

export default function InvoiceDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { message, modal } = App.useApp()
  const [sendModalOpen, setSendModalOpen] = useState(false)

  const { data: invoice } = useQuery({
    queryKey: ['invoice', id],
    queryFn: async () => { await new Promise(r => setTimeout(r, 300)); return mockInvoices.find(i => i.id === id) },
  })

  if (!invoice) return null

  const payments = mockPayments.filter(p => p.customerId === invoice.customerId)
  const balance = invoice.total - invoice.paid

  const lineColumns = [
    { title: 'Description', dataIndex: 'description', key: 'description' },
    { title: 'Qty', dataIndex: 'qty', key: 'qty', align: 'right' as const },
    { title: 'Unit Price', dataIndex: 'unitPrice', key: 'unitPrice', align: 'right' as const, render: (v: number) => formatCurrency(v) },
    { title: 'Tax', dataIndex: 'tax', key: 'tax', align: 'right' as const, render: (v: number) => v > 0 ? formatCurrency(v) : '—' },
    { title: 'Amount', dataIndex: 'amount', key: 'amount', align: 'right' as const, render: (v: number) => <strong>{formatCurrency(v)}</strong> },
  ]

  const handleVoid = () => {
    modal.confirm({
      title: 'Void Invoice', content: 'This action cannot be undone. The invoice will be marked as voided.',
      okText: 'Void Invoice', okButtonProps: { danger: true },
      onOk: () => void message.success('Invoice voided'),
    })
  }

  return (
    <div className="page-container" style={{ maxWidth: 900 }}>
      <div className="flex-between" style={{ marginBottom: 20 }}>
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/app/invoices')}>Back</Button>
          <Title level={4} style={{ margin: 0 }}>{invoice.invoiceNumber}</Title>
          <StatusTag status={invoice.status} size="md" />
        </Space>
        <Space>
          <Button icon={<PrinterOutlined />}>Print</Button>
          <Button icon={<SendOutlined />} onClick={() => setSendModalOpen(true)}>Send</Button>
          {invoice.status !== 'PAID' && invoice.status !== 'VOIDED' && (
            <Button icon={<DollarOutlined />} onClick={() => navigate(`/app/payments/new?invoiceId=${id}`)}>Record Payment</Button>
          )}
          {!['PAID','VOIDED','CANCELLED'].includes(invoice.status) && (
            <Button icon={<EditOutlined />} onClick={() => navigate(`/app/invoices/${id}/edit`)}>Edit</Button>
          )}
          {!['PAID','VOIDED'].includes(invoice.status) && (
            <Button danger icon={<StopOutlined />} onClick={handleVoid}>Void</Button>
          )}
        </Space>
      </div>

      <Row gutter={[16,16]}>
        <Col xs={24} lg={16}>
          <Card style={{ borderRadius: 12, marginBottom: 16 }}>
            <Descriptions column={{ xs: 1, sm: 2, md: 3 }} size="small">
              <Descriptions.Item label="Customer"><strong>{invoice.customerName}</strong></Descriptions.Item>
              <Descriptions.Item label="Issue Date">{formatDate(invoice.issueDate)}</Descriptions.Item>
              <Descriptions.Item label="Due Date">{formatDate(invoice.dueDate)}</Descriptions.Item>
            </Descriptions>
          </Card>

          <Card title="Line Items" style={{ borderRadius: 12, marginBottom: 16 }}>
            <Table dataSource={MOCK_ITEMS} columns={lineColumns} rowKey="key" pagination={false} size="middle" />
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
              <AmountSummary subtotal={2200} taxTotal={43} total={invoice.total} paid={invoice.paid} />
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title="Payment History" style={{ borderRadius: 12 }}>
            {payments.length === 0 ? (
              <Text type="secondary">No payments recorded yet.</Text>
            ) : (
              <Timeline
                items={payments.map(p => ({
                  color: colorTokens.success,
                  dot: <CheckCircleOutlined />,
                  children: (
                    <div>
                      <div style={{ fontWeight: 600 }}>{formatCurrency(p.amount)}</div>
                      <Text type="secondary" style={{ fontSize: 12 }}>{formatDate(p.date)} · {p.method.replace('_', ' ')}</Text>
                      <br /><Text type="secondary" style={{ fontSize: 12 }}>{p.reference}</Text>
                    </div>
                  ),
                }))}
              />
            )}
            {balance > 0 && (
              <>
                <Divider style={{ margin: '12px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text>Balance due</Text>
                  <Text strong style={{ color: colorTokens.error }}>{formatCurrency(balance)}</Text>
                </div>
              </>
            )}
          </Card>
        </Col>
      </Row>

      <Modal title="Send Invoice" open={sendModalOpen} onCancel={() => setSendModalOpen(false)}
        onOk={() => { void message.success('Invoice sent'); setSendModalOpen(false) }} okText="Send">
        <Text>Send <strong>{invoice.invoiceNumber}</strong> to <strong>{invoice.customerName}</strong> via email.</Text>
      </Modal>
    </div>
  )
}
