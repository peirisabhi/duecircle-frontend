import { useParams, useNavigate } from 'react-router-dom'
import { Card, Button, Typography, Space, Descriptions, Table, Modal } from 'antd'
import { ArrowLeftOutlined, EditOutlined, SendOutlined, PrinterOutlined, FileTextOutlined } from '@ant-design/icons'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { mockQuotations } from '@shared/mocks/data'
import { StatusTag } from '@shared/components/ui/StatusTag'
import { AmountSummary } from '@shared/components/ui/AmountSummary'
import { formatDate, formatCurrency } from '@shared/utils'
import { App } from 'antd'

const { Title, Text } = Typography

const MOCK_ITEMS = [
  { key: '1', description: 'Web Design Services', qty: 1, unitPrice: 5000, taxRate: 0, amount: 5000 },
  { key: '2', description: 'SEO Package (3 months)', qty: 3, unitPrice: 500, taxRate: 0, amount: 1500 },
]

export default function QuotationDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { message, modal } = App.useApp()
  const [sendModalOpen, setSendModalOpen] = useState(false)

  const { data: quotation } = useQuery({
    queryKey: ['quotation', id],
    queryFn: async () => { await new Promise(r => setTimeout(r, 300)); return mockQuotations.find(q => q.id === id) },
  })

  if (!quotation) return null

  const lineColumns = [
    { title: 'Description', dataIndex: 'description', key: 'description' },
    { title: 'Qty', dataIndex: 'qty', key: 'qty', align: 'right' as const },
    { title: 'Unit Price', dataIndex: 'unitPrice', key: 'unitPrice', align: 'right' as const, render: (v: number) => formatCurrency(v) },
    { title: 'Tax', dataIndex: 'taxRate', key: 'taxRate', align: 'right' as const, render: (v: number) => `${v}%` },
    { title: 'Amount', dataIndex: 'amount', key: 'amount', align: 'right' as const, render: (v: number) => <strong>{formatCurrency(v)}</strong> },
  ]

  const handleConvert = () => {
    modal.confirm({
      title: 'Convert to Invoice',
      content: 'This will create a new invoice based on this quotation. Continue?',
      okText: 'Convert',
      onOk: () => { void message.success('Invoice created from quotation'); navigate('/app/invoices') },
    })
  }

  return (
    <div className="page-container" style={{ maxWidth: 900 }}>
      <div className="flex-between" style={{ marginBottom: 20 }}>
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/app/quotations')}>Back</Button>
          <Title level={4} style={{ margin: 0 }}>{quotation.quotationNumber}</Title>
          <StatusTag status={quotation.status} size="md" />
        </Space>
        <Space>
          <Button icon={<PrinterOutlined />}>Print</Button>
          <Button icon={<SendOutlined />} onClick={() => setSendModalOpen(true)}>Send</Button>
          {quotation.status === 'ACCEPTED' && (
            <Button type="primary" icon={<FileTextOutlined />} onClick={handleConvert}>Convert to Invoice</Button>
          )}
          {['DRAFT','SENT'].includes(quotation.status) && (
            <Button icon={<EditOutlined />} onClick={() => navigate(`/app/quotations/${id}/edit`)}>Edit</Button>
          )}
        </Space>
      </div>

      <Card style={{ borderRadius: 12, marginBottom: 16 }}>
        <Descriptions column={{ xs: 1, sm: 2, md: 4 }} size="small">
          <Descriptions.Item label="Customer"><strong>{quotation.customerName}</strong></Descriptions.Item>
          <Descriptions.Item label="Issue Date">{formatDate(quotation.issueDate)}</Descriptions.Item>
          <Descriptions.Item label="Expiry Date">{formatDate(quotation.expiryDate)}</Descriptions.Item>
          <Descriptions.Item label="Status"><StatusTag status={quotation.status} /></Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="Line Items" style={{ borderRadius: 12, marginBottom: 16 }}>
        <Table dataSource={MOCK_ITEMS} columns={lineColumns} rowKey="key" pagination={false} size="middle" />
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
          <AmountSummary subtotal={6500} taxTotal={0} total={6500} />
        </div>
      </Card>

      <Modal title="Send Quotation" open={sendModalOpen} onCancel={() => setSendModalOpen(false)}
        onOk={() => { void message.success('Quotation sent'); setSendModalOpen(false) }} okText="Send">
        <Text>Send <strong>{quotation.quotationNumber}</strong> to <strong>{quotation.customerName}</strong>.</Text>
      </Modal>
    </div>
  )
}
