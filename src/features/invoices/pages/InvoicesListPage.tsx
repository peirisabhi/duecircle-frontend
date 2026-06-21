import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Table, Button, Input, Select, Space, Typography, Card, DatePicker, Dropdown, Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { PlusOutlined, SearchOutlined, MoreOutlined, EyeOutlined, EditOutlined, SendOutlined, PrinterOutlined, DollarOutlined, StopOutlined } from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import { formatCurrency, formatDate } from '@shared/utils'
import { StatusTag } from '@shared/components/ui/StatusTag'
import { mockInvoices } from '@shared/mocks/data'
import { colorTokens } from '@styles/tokens'
import { App } from 'antd'

const { Title, Text } = Typography
type Invoice = typeof mockInvoices[0]

export default function InvoicesListPage() {
  const navigate = useNavigate()
  const { message } = App.useApp()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([])

  const { data: invoices = [], isLoading } = useQuery({
    queryKey: ['invoices'],
    queryFn: async () => { await new Promise(r => setTimeout(r, 400)); return mockInvoices },
  })

  const filtered = useMemo(() =>
    invoices.filter(i =>
      (!search || i.invoiceNumber.includes(search) || i.customerName.toLowerCase().includes(search.toLowerCase())) &&
      (!statusFilter || i.status === statusFilter)
    ), [invoices, search, statusFilter])

  const totalSelected = selectedRowKeys.length
  const totalOutstanding = filtered.filter(i => i.status !== 'PAID' && i.status !== 'VOIDED').reduce((s, i) => s + (i.total - i.paid), 0)

  const columns: ColumnsType<Invoice> = [
    { title: 'Invoice #', dataIndex: 'invoiceNumber', key: 'num', render: (v: string, r: Invoice) => <a onClick={e => { e.stopPropagation(); navigate(`/app/invoices/${r.id}`) }}>{v}</a> },
    { title: 'Customer', dataIndex: 'customerName', key: 'cust', render: (v: string) => <span style={{ fontWeight: 500 }}>{v}</span> },
    { title: 'Issued', dataIndex: 'issueDate', key: 'issued', render: (v: string) => <Text style={{ fontSize: 13 }}>{formatDate(v)}</Text>, responsive: ['md'] as ('md')[] },
    { title: 'Due', dataIndex: 'dueDate', key: 'due', render: (v: string) => <Text style={{ fontSize: 13 }}>{formatDate(v)}</Text> },
    { title: 'Amount', dataIndex: 'total', key: 'total', align: 'right' as const, render: (v: number) => <span style={{ fontWeight: 600 }}>{formatCurrency(v)}</span>, sorter: (a: Invoice, b: Invoice) => a.total - b.total },
    {
      title: 'Balance', key: 'balance', align: 'right' as const,
      render: (_: unknown, r: Invoice) => {
        const bal = r.total - r.paid
        return bal > 0 ? <span style={{ color: colorTokens.error, fontWeight: 600 }}>{formatCurrency(bal)}</span> : <Tag color="success">Settled</Tag>
      },
    },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (v: string) => <StatusTag status={v} /> },
    {
      title: '', key: 'actions', width: 48,
      render: (_: unknown, r: Invoice) => (
        <Dropdown menu={{ items: [
          { key: 'view', icon: <EyeOutlined />, label: 'View', onClick: () => navigate(`/app/invoices/${r.id}`) },
          { key: 'edit', icon: <EditOutlined />, label: 'Edit', onClick: () => navigate(`/app/invoices/${r.id}/edit`), disabled: r.status === 'PAID' },
          { key: 'pay', icon: <DollarOutlined />, label: 'Record Payment', onClick: () => navigate(`/app/payments/new?invoiceId=${r.id}`), disabled: r.status === 'PAID' || r.status === 'VOIDED' },
          { key: 'send', icon: <SendOutlined />, label: 'Send', disabled: r.status === 'DRAFT' ? false : true },
          { key: 'print', icon: <PrinterOutlined />, label: 'Print' },
          { type: 'divider' as const },
          { key: 'void', icon: <StopOutlined />, label: 'Void Invoice', danger: true, disabled: r.status === 'PAID' || r.status === 'VOIDED' },
        ]}} trigger={['click']}>
          <Button type="text" icon={<MoreOutlined />} onClick={e => e.stopPropagation()} />
        </Dropdown>
      ),
    },
  ]

  return (
    <div className="page-container">
      <div className="flex-between" style={{ marginBottom: 20 }}>
        <div>
          <Title level={4} style={{ margin: 0 }}>Invoices</Title>
          <Text type="secondary" style={{ fontSize: 13 }}>Outstanding: <strong style={{ color: colorTokens.error }}>{formatCurrency(totalOutstanding)}</strong></Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/app/invoices/new')}>New Invoice</Button>
      </div>

      <Card style={{ borderRadius: 12 }}>
        {totalSelected > 0 && (
          <div style={{ background: colorTokens.primaryBg, border: `1px solid ${colorTokens.primary}33`, borderRadius: 8, padding: '8px 16px', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
            <Text strong>{totalSelected} selected</Text>
            <Button size="small" icon={<SendOutlined />} onClick={() => void message.success(`Sending ${totalSelected} invoices...`)}>Send All</Button>
            <Button size="small">Export</Button>
            <Button size="small" onClick={() => setSelectedRowKeys([])}>Clear</Button>
          </div>
        )}
        <Space style={{ marginBottom: 16 }} wrap>
          <Input prefix={<SearchOutlined style={{ color: colorTokens.textTertiary }} />} placeholder="Search invoices..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: 260 }} allowClear />
          <Select placeholder="All statuses" value={statusFilter} onChange={setStatusFilter} allowClear style={{ width: 150 }}
            options={['DRAFT','SENT','PAID','PARTIAL','OVERDUE','VOIDED'].map(s => ({ value: s, label: s[0]+s.slice(1).toLowerCase() }))} />
        </Space>
        <Table
          dataSource={filtered} columns={columns} rowKey="id" loading={isLoading} size="middle"
          rowSelection={{ type: 'checkbox', selectedRowKeys, onChange: keys => setSelectedRowKeys(keys as string[]) }}
          pagination={{ pageSize: 20, showSizeChanger: true, showTotal: t => `${t} invoices` }}
          onRow={r => ({ onClick: () => navigate(`/app/invoices/${r.id}`), style: { cursor: 'pointer' } })}
        />
      </Card>
    </div>
  )
}
