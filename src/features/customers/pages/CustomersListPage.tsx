import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Table, Button, Input, Select, Space, Avatar, Typography, Card, Statistic, Row, Col, Dropdown } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { PlusOutlined, SearchOutlined, MoreOutlined, EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import { formatCurrency, formatDate, initials } from '@shared/utils'
import { StatusTag } from '@shared/components/ui/StatusTag'
import { mockCustomers } from '@shared/mocks/data'
import { colorTokens } from '@styles/tokens'

const { Title, Text } = Typography

interface Customer { id: string; name: string; email: string; phone: string; balance: number; status: string; city: string; country: string; createdAt: string }

export default function CustomersListPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string | null>(null)

  const { data: customers = [], isLoading } = useQuery({
    queryKey: ['customers'],
    queryFn: async () => { await new Promise(r => setTimeout(r, 400)); return mockCustomers },
  })

  const filtered = useMemo(() =>
    customers.filter(c => {
      const matchSearch = !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase())
      const matchStatus = !statusFilter || c.status === statusFilter
      return matchSearch && matchStatus
    }), [customers, search, statusFilter])

  const totalOutstanding = customers.reduce((s, c) => s + c.balance, 0)
  const activeCount = customers.filter(c => c.status === 'ACTIVE').length

  const columns: ColumnsType<Customer> = [
    {
      title: 'Customer', key: 'name',
      render: (_, r) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Avatar style={{ background: colorTokens.primary, fontSize: 12, fontWeight: 600, flexShrink: 0 }}>{initials(r.name)}</Avatar>
          <div>
            <div style={{ fontWeight: 600, fontSize: 13 }}>{r.name}</div>
            <Text type="secondary" style={{ fontSize: 12 }}>{r.email}</Text>
          </div>
        </div>
      ),
    },
    { title: 'Phone', dataIndex: 'phone', key: 'phone', responsive: ['md'] as ('md')[], render: (v: string) => <Text style={{ fontSize: 13 }}>{v}</Text> },
    { title: 'Location', key: 'location', responsive: ['lg'] as ('lg')[], render: (_: unknown, r: Customer) => <Text style={{ fontSize: 13 }}>{r.city}, {r.country}</Text> },
    {
      title: 'Balance', dataIndex: 'balance', key: 'balance', align: 'right' as const,
      render: (v: number) => <span style={{ fontWeight: 600, color: v > 0 ? colorTokens.error : colorTokens.success }}>{formatCurrency(v)}</span>,
      sorter: (a: Customer, b: Customer) => a.balance - b.balance,
    },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (v: string) => <StatusTag status={v} /> },
    { title: 'Since', dataIndex: 'createdAt', key: 'createdAt', responsive: ['xl'] as ('xl')[], render: (v: string) => <Text style={{ fontSize: 12 }} type="secondary">{formatDate(v)}</Text> },
    {
      title: '', key: 'actions', width: 48,
      render: (_: unknown, r: Customer) => (
        <Dropdown menu={{ items: [
          { key: 'view', icon: <EyeOutlined />, label: 'View', onClick: () => navigate(`/app/customers/${r.id}`) },
          { key: 'edit', icon: <EditOutlined />, label: 'Edit', onClick: () => navigate(`/app/customers/${r.id}/edit`) },
          { type: 'divider' as const },
          { key: 'delete', icon: <DeleteOutlined />, label: 'Delete', danger: true },
        ]}} trigger={['click']}>
          <Button type="text" icon={<MoreOutlined />} onClick={e => e.stopPropagation()} />
        </Dropdown>
      ),
    },
  ]

  return (
    <div className="page-container">
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {[
          { title: 'Total Customers', value: customers.length },
          { title: 'Active', value: activeCount },
          { title: 'Total Outstanding', value: formatCurrency(totalOutstanding) },
        ].map(stat => (
          <Col key={stat.title} xs={24} sm={8}>
            <Card size="small" style={{ borderRadius: 10 }}>
              <Statistic title={stat.title} value={stat.value} valueStyle={{ fontSize: 22, fontWeight: 700 }} />
            </Card>
          </Col>
        ))}
      </Row>

      <Card style={{ borderRadius: 12 }}>
        <div className="flex-between" style={{ marginBottom: 16 }}>
          <Title level={5} style={{ margin: 0 }}>Customers</Title>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/app/customers/new')}>New Customer</Button>
        </div>
        <Space style={{ marginBottom: 16 }} wrap>
          <Input prefix={<SearchOutlined style={{ color: colorTokens.textTertiary }} />} placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: 280 }} allowClear />
          <Select placeholder="All statuses" value={statusFilter} onChange={setStatusFilter} allowClear style={{ width: 140 }} options={[{ value: 'ACTIVE', label: 'Active' }, { value: 'INACTIVE', label: 'Inactive' }]} />
        </Space>
        <Table dataSource={filtered} columns={columns} rowKey="id" loading={isLoading} size="middle"
          pagination={{ pageSize: 20, showSizeChanger: true, showTotal: (t) => `${t} customers` }}
          onRow={r => ({ onClick: () => navigate(`/app/customers/${r.id}`), style: { cursor: 'pointer' } })} />
      </Card>
    </div>
  )
}
