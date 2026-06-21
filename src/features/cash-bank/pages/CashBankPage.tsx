import { useState } from 'react'
import { Card, Row, Col, Table, Tag, Button, Typography, Space, Modal, Form, Input, InputNumber, Select, Statistic, Tabs } from 'antd'
import { PlusOutlined, BankOutlined, DollarOutlined, ArrowRightOutlined, ArrowLeftOutlined, SwapOutlined } from '@ant-design/icons'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { mockCashAccounts, mockCashTransactions } from '@shared/mocks/data'
import { formatCurrency } from '@shared/utils'
import { colorTokens } from '@styles/tokens'

const { Title, Text } = Typography

const TX_CONFIG: Record<string, { color: string; icon: React.ReactNode; label: string }> = {
  DEPOSIT:    { color: colorTokens.success, icon: <ArrowLeftOutlined />, label: 'Deposit' },
  WITHDRAWAL: { color: colorTokens.error,   icon: <ArrowRightOutlined />, label: 'Withdrawal' },
  TRANSFER:   { color: colorTokens.primary, icon: <SwapOutlined />, label: 'Transfer' },
}

type TxType = 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER'

export default function CashBankPage() {
  const qc = useQueryClient()
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null)
  const [txModalOpen, setTxModalOpen] = useState(false)
  const [txType, setTxType] = useState<TxType>('DEPOSIT')
  const [form] = Form.useForm()

  const { data: accounts = [] } = useQuery({ queryKey: ['cash-accounts'], queryFn: async () => { await new Promise(r => setTimeout(r, 300)); return mockCashAccounts } })
  const { data: transactions = [] } = useQuery({ queryKey: ['cash-transactions'], queryFn: async () => { await new Promise(r => setTimeout(r, 300)); return mockCashTransactions } })

  const totalCash = accounts.filter(a => a.type === 'CASH').reduce((s, a) => s + a.balance, 0)
  const totalBank = accounts.filter(a => a.type === 'BANK').reduce((s, a) => s + a.balance, 0)

  const filteredTx = selectedAccountId ? transactions.filter(t => t.accountId === selectedAccountId) : transactions

  const txColumns = [
    { title: 'Date', dataIndex: 'date', key: 'date', width: 110 },
    {
      title: 'Type', dataIndex: 'type', key: 'type', width: 110,
      render: (v: string) => {
        const c = TX_CONFIG[v]
        return <Tag icon={c?.icon} style={{ color: c?.color, border: `1px solid ${c?.color}33`, background: `${c?.color}11`, fontWeight: 600, fontSize: 11 }}>{c?.label}</Tag>
      },
    },
    { title: 'Description', dataIndex: 'description', key: 'description' },
    { title: 'Reference', dataIndex: 'reference', key: 'reference', render: (v: string) => <code style={{ fontSize: 12 }}>{v}</code> },
    {
      title: 'Amount', dataIndex: 'amount', key: 'amount', align: 'right' as const,
      render: (v: number, r: typeof mockCashTransactions[0]) => (
        <span style={{ fontWeight: 700, color: r.type === 'DEPOSIT' ? colorTokens.success : r.type === 'WITHDRAWAL' ? colorTokens.error : colorTokens.primary }}>
          {r.type === 'WITHDRAWAL' ? '-' : '+'}{formatCurrency(v)}
        </span>
      ),
    },
    {
      title: 'Account', dataIndex: 'accountId', key: 'accountId',
      render: (v: string) => <Text type="secondary">{accounts.find(a => a.id === v)?.name ?? v}</Text>,
    },
  ]

  return (
    <div className="page-container">
      <div className="flex-between" style={{ marginBottom: 20 }}>
        <Title level={4} style={{ margin: 0 }}>Cash & Bank</Title>
        <Space>
          <Button icon={<PlusOutlined />} onClick={() => { setTxType('DEPOSIT'); setTxModalOpen(true) }}>Deposit</Button>
          <Button icon={<PlusOutlined />} onClick={() => { setTxType('WITHDRAWAL'); setTxModalOpen(true) }}>Withdrawal</Button>
          <Button type="primary" icon={<SwapOutlined />} onClick={() => { setTxType('TRANSFER'); setTxModalOpen(true) }}>Transfer</Button>
        </Space>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        <Col xs={24} sm={8}>
          <Card size="small" style={{ borderRadius: 10 }}>
            <Statistic title="Total Cash" value={formatCurrency(totalCash)} valueStyle={{ fontSize: 20, fontWeight: 700 }} prefix={<DollarOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card size="small" style={{ borderRadius: 10 }}>
            <Statistic title="Total in Bank" value={formatCurrency(totalBank)} valueStyle={{ fontSize: 20, fontWeight: 700 }} prefix={<BankOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card size="small" style={{ borderRadius: 10 }}>
            <Statistic title="Total Balance" value={formatCurrency(totalCash + totalBank)} valueStyle={{ fontSize: 20, fontWeight: 700, color: colorTokens.primary }} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card title="Accounts" style={{ borderRadius: 12 }}>
            <Space direction="vertical" style={{ width: '100%' }} size={8}>
              <div
                onClick={() => setSelectedAccountId(null)}
                style={{ padding: '10px 12px', borderRadius: 8, cursor: 'pointer', background: !selectedAccountId ? `${colorTokens.primary}11` : colorTokens.bgPage, border: `1px solid ${!selectedAccountId ? colorTokens.primary : 'transparent'}`, transition: 'all 0.15s' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text strong>All Accounts</Text>
                  <Text strong>{formatCurrency(totalCash + totalBank)}</Text>
                </div>
              </div>
              {accounts.map(a => (
                <div
                  key={a.id}
                  onClick={() => setSelectedAccountId(a.id)}
                  style={{ padding: '10px 12px', borderRadius: 8, cursor: 'pointer', background: selectedAccountId === a.id ? `${colorTokens.primary}11` : colorTokens.bgPage, border: `1px solid ${selectedAccountId === a.id ? colorTokens.primary : 'transparent'}`, transition: 'all 0.15s' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                    <Text strong style={{ fontSize: 13 }}>{a.name}</Text>
                    <Tag color={a.type === 'CASH' ? 'orange' : 'blue'} style={{ fontSize: 10, margin: 0 }}>{a.type}</Tag>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 16, color: colorTokens.success }}>{formatCurrency(a.balance)}</div>
                </div>
              ))}
            </Space>
          </Card>
        </Col>
        <Col xs={24} md={16}>
          <Card
            title={selectedAccountId ? accounts.find(a => a.id === selectedAccountId)?.name : 'All Transactions'}
            style={{ borderRadius: 12 }}>
            <Table dataSource={filteredTx} columns={txColumns} rowKey="id" size="middle" />
          </Card>
        </Col>
      </Row>

      <Modal
        title={txType === 'DEPOSIT' ? 'Record Deposit' : txType === 'WITHDRAWAL' ? 'Record Withdrawal' : 'Transfer Between Accounts'}
        open={txModalOpen}
        onCancel={() => { setTxModalOpen(false); form.resetFields() }}
        onOk={() => form.submit()}
        okText="Save"
        destroyOnClose>
        <Form form={form} layout="vertical" onFinish={(v) => { console.log(v); setTxModalOpen(false); form.resetFields() }}>
          <Form.Item name="accountId" label={txType === 'TRANSFER' ? 'From Account' : 'Account'} rules={[{ required: true }]}>
            <Select options={accounts.map(a => ({ value: a.id, label: `${a.name} (${formatCurrency(a.balance)})` }))} />
          </Form.Item>
          {txType === 'TRANSFER' && (
            <Form.Item name="toAccountId" label="To Account" rules={[{ required: true }]}>
              <Select options={accounts.map(a => ({ value: a.id, label: `${a.name} (${formatCurrency(a.balance)})` }))} />
            </Form.Item>
          )}
          <Form.Item name="amount" label="Amount" rules={[{ required: true }]}>
            <InputNumber min={0.01} precision={2} prefix="$" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="description" label="Description" rules={[{ required: true }]}>
            <Input placeholder="e.g. Payment received from client" />
          </Form.Item>
          <Form.Item name="reference" label="Reference">
            <Input placeholder="e.g. PAY-00021" />
          </Form.Item>
          <Form.Item name="date" label="Date" initialValue={new Date().toISOString().split('T')[0]}>
            <Input type="date" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
