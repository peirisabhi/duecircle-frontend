import { useNavigate } from 'react-router-dom'
import { Table, Button, Typography, Card, Tag, Space } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { PlusOutlined } from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import { formatCurrency, formatDate } from '@shared/utils'
import { mockCreditNotes } from '@shared/mocks/data'
import { colorTokens } from '@styles/tokens'

const { Title, Text } = Typography
type Note = typeof mockCreditNotes[0]

export default function CreditDebitNotesListPage() {
  const navigate = useNavigate()
  const { data: notes = [], isLoading } = useQuery({
    queryKey: ['credit-notes'],
    queryFn: async () => { await new Promise(r => setTimeout(r, 300)); return mockCreditNotes },
  })

  const columns: ColumnsType<Note> = [
    { title: 'Note #', dataIndex: 'noteNumber', key: 'num', render: (v: string) => <strong>{v}</strong> },
    { title: 'Customer', dataIndex: 'customerName', key: 'cust' },
    { title: 'Invoice', dataIndex: 'invoiceNumber', key: 'inv', render: (v: string, r: Note) => <a onClick={() => navigate(`/app/invoices/${r.invoiceId}`)}>{v}</a> },
    { title: 'Date', dataIndex: 'date', key: 'date', render: (v: string) => formatDate(v) },
    { title: 'Reason', dataIndex: 'reason', key: 'reason', render: (v: string) => <Text type="secondary">{v}</Text> },
    { title: 'Amount', dataIndex: 'amount', key: 'amount', align: 'right' as const, render: (v: number) => <span style={{ fontWeight: 600, color: colorTokens.error }}>−{formatCurrency(v)}</span> },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (v: string) => <Tag color={v === 'APPLIED' ? 'green' : 'blue'}>{v}</Tag> },
  ]

  return (
    <div className="page-container">
      <div className="flex-between" style={{ marginBottom: 20 }}>
        <Title level={4} style={{ margin: 0 }}>Credit & Debit Notes</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/app/credit-debit-notes/new')}>New Credit Note</Button>
      </div>
      <Card style={{ borderRadius: 12 }}>
        <Table dataSource={notes} columns={columns} rowKey="id" loading={isLoading} size="middle"
          pagination={{ pageSize: 20, showTotal: t => `${t} notes` }} />
      </Card>
    </div>
  )
}
