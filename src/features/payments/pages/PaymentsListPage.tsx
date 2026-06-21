import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Table, Button, Input, Space, Typography, Card, Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { PlusOutlined, SearchOutlined } from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import { formatCurrency, formatDate } from '@shared/utils'
import { mockPayments } from '@shared/mocks/data'
import { colorTokens } from '@styles/tokens'
import { StatusTag } from '@shared/components/ui/StatusTag'

const { Title, Text } = Typography
type Payment = typeof mockPayments[0]

const METHOD_LABELS: Record<string, string> = {
  CASH: 'Cash', BANK_TRANSFER: 'Bank Transfer', CHEQUE: 'Cheque', CARD: 'Card', MOBILE_MONEY: 'Mobile Money',
}

export default function PaymentsListPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')

  const { data: payments = [], isLoading } = useQuery({
    queryKey: ['payments'],
    queryFn: async () => { await new Promise(r => setTimeout(r, 400)); return mockPayments },
  })

  const filtered = useMemo(() =>
    payments.filter(p => !search || p.customerName.toLowerCase().includes(search.toLowerCase()) || p.reference.includes(search)),
    [payments, search])

  const totalReceived = payments.reduce((s, p) => s + p.amount, 0)

  const columns: ColumnsType<Payment> = [
    { title: 'Reference', dataIndex: 'reference', key: 'reference', render: (v: string) => <strong>{v}</strong> },
    { title: 'Customer', dataIndex: 'customerName', key: 'customerName' },
    { title: 'Date', dataIndex: 'date', key: 'date', render: (v: string) => <Text style={{ fontSize: 13 }}>{formatDate(v)}</Text> },
    { title: 'Method', dataIndex: 'method', key: 'method', render: (v: string) => <Tag>{METHOD_LABELS[v] ?? v}</Tag> },
    {
      title: 'Allocated to', dataIndex: 'allocatedTo', key: 'allocatedTo',
      render: (v: string[]) => v.length > 0
        ? v.map(inv => <Tag key={inv} color="blue" style={{ fontSize: 11 }}>{inv}</Tag>)
        : <Tag color="warning">Unallocated</Tag>,
    },
    { title: 'Amount', dataIndex: 'amount', key: 'amount', align: 'right' as const, render: (v: number) => <span style={{ fontWeight: 700, color: colorTokens.success }}>{formatCurrency(v)}</span>, sorter: (a: Payment, b: Payment) => a.amount - b.amount },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (v: string) => <StatusTag status={v} /> },
  ]

  return (
    <div className="page-container">
      <div className="flex-between" style={{ marginBottom: 20 }}>
        <div>
          <Title level={4} style={{ margin: 0 }}>Payments</Title>
          <Text type="secondary" style={{ fontSize: 13 }}>Total received: <strong style={{ color: colorTokens.success }}>{formatCurrency(totalReceived)}</strong></Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/app/payments/new')}>Record Payment</Button>
      </div>
      <Card style={{ borderRadius: 12 }}>
        <Space style={{ marginBottom: 16 }}>
          <Input prefix={<SearchOutlined style={{ color: colorTokens.textTertiary }} />} placeholder="Search payments..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: 260 }} allowClear />
        </Space>
        <Table dataSource={filtered} columns={columns} rowKey="id" loading={isLoading} size="middle"
          pagination={{ pageSize: 20, showTotal: t => `${t} payments` }} />
      </Card>
    </div>
  )
}
