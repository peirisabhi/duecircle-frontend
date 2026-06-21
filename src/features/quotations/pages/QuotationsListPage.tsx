import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Table, Button, Input, Select, Space, Typography, Card, Dropdown } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { PlusOutlined, SearchOutlined, MoreOutlined, EyeOutlined, EditOutlined, CopyOutlined, FileTextOutlined } from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import { formatCurrency, formatDate } from '@shared/utils'
import { StatusTag } from '@shared/components/ui/StatusTag'
import { mockQuotations } from '@shared/mocks/data'
import { colorTokens } from '@styles/tokens'

const { Title, Text } = Typography
type Quotation = typeof mockQuotations[0]

export default function QuotationsListPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string | null>(null)

  const { data: quotations = [], isLoading } = useQuery({
    queryKey: ['quotations'],
    queryFn: async () => { await new Promise(r => setTimeout(r, 400)); return mockQuotations },
  })

  const filtered = useMemo(() =>
    quotations.filter(q =>
      (!search || q.quotationNumber.includes(search) || q.customerName.toLowerCase().includes(search.toLowerCase())) &&
      (!statusFilter || q.status === statusFilter)
    ), [quotations, search, statusFilter])

  const columns: ColumnsType<Quotation> = [
    { title: 'Quotation #', dataIndex: 'quotationNumber', key: 'quotationNumber', render: (v: string, r: Quotation) => <a onClick={() => navigate(`/app/quotations/${r.id}`)}>{v}</a> },
    { title: 'Customer', dataIndex: 'customerName', key: 'customerName', render: (v: string) => <span style={{ fontWeight: 500 }}>{v}</span> },
    { title: 'Issued', dataIndex: 'issueDate', key: 'issueDate', render: (v: string) => <Text style={{ fontSize: 13 }}>{formatDate(v)}</Text> },
    { title: 'Expires', dataIndex: 'expiryDate', key: 'expiryDate', render: (v: string) => <Text style={{ fontSize: 13 }}>{formatDate(v)}</Text> },
    { title: 'Amount', dataIndex: 'total', key: 'total', align: 'right' as const, render: (v: number) => <span style={{ fontWeight: 600 }}>{formatCurrency(v)}</span>, sorter: (a: Quotation, b: Quotation) => a.total - b.total },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (v: string) => <StatusTag status={v} /> },
    {
      title: '', key: 'actions', width: 48,
      render: (_: unknown, r: Quotation) => (
        <Dropdown menu={{ items: [
          { key: 'view', icon: <EyeOutlined />, label: 'View', onClick: () => navigate(`/app/quotations/${r.id}`) },
          { key: 'edit', icon: <EditOutlined />, label: 'Edit', onClick: () => navigate(`/app/quotations/${r.id}/edit`), disabled: r.status === 'CONVERTED' },
          { key: 'convert', icon: <FileTextOutlined />, label: 'Convert to Invoice', disabled: r.status !== 'ACCEPTED' },
          { key: 'duplicate', icon: <CopyOutlined />, label: 'Duplicate' },
        ]}} trigger={['click']}>
          <Button type="text" icon={<MoreOutlined />} onClick={e => e.stopPropagation()} />
        </Dropdown>
      ),
    },
  ]

  return (
    <div className="page-container">
      <div className="flex-between" style={{ marginBottom: 20 }}>
        <Title level={4} style={{ margin: 0 }}>Quotations</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/app/quotations/new')}>New Quotation</Button>
      </div>
      <Card style={{ borderRadius: 12 }}>
        <Space style={{ marginBottom: 16 }} wrap>
          <Input prefix={<SearchOutlined style={{ color: colorTokens.textTertiary }} />} placeholder="Search quotations..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: 260 }} allowClear />
          <Select placeholder="All statuses" value={statusFilter} onChange={setStatusFilter} allowClear style={{ width: 150 }}
            options={['DRAFT','SENT','ACCEPTED','REJECTED','EXPIRED','CONVERTED'].map(s => ({ value: s, label: s[0]+s.slice(1).toLowerCase() }))} />
        </Space>
        <Table dataSource={filtered} columns={columns} rowKey="id" loading={isLoading} size="middle"
          pagination={{ pageSize: 20, showTotal: t => `${t} quotations` }}
          onRow={r => ({ onClick: () => navigate(`/app/quotations/${r.id}`), style: { cursor: 'pointer' } })} />
      </Card>
    </div>
  )
}
