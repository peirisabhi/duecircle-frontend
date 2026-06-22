import { useState } from 'react'
import { Card, Tabs, Form, Input, Button, Switch, Select, InputNumber, Table, Tag, Modal, Avatar, Typography, Row, Col, Space, message } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { colorTokens } from '@styles/tokens'
import { initials } from '@shared/utils'

const { Title, Text } = Typography

const MOCK_USERS = [
  { id: 'u1', name: 'Dev Admin', email: 'admin@duecircle.dev', role: 'OWNER', status: 'ACTIVE', joinedAt: '2026-01-01' },
  { id: 'u2', name: 'Alice Johnson', email: 'alice@duecircle.dev', role: 'ADMIN', status: 'ACTIVE', joinedAt: '2026-02-15' },
  { id: 'u3', name: 'Bob Smith', email: 'bob@duecircle.dev', role: 'ACCOUNTANT', status: 'ACTIVE', joinedAt: '2026-03-01' },
  { id: 'u4', name: 'Carol White', email: 'carol@duecircle.dev', role: 'VIEWER', status: 'PENDING', joinedAt: '2026-06-01' },
]

const MOCK_TAX_RULES = [
  { id: 't1', name: 'VAT 18%', rate: 18, type: 'VAT', isDefault: false },
  { id: 't2', name: 'GST 10%', rate: 10, type: 'GST', isDefault: true },
  { id: 't3', name: 'GST 5%', rate: 5, type: 'GST', isDefault: false },
  { id: 't4', name: 'Tax Exempt', rate: 0, type: 'EXEMPT', isDefault: false },
]

const ROLE_COLORS: Record<string, string> = { OWNER: 'purple', ADMIN: 'blue', ACCOUNTANT: 'cyan', VIEWER: 'default' }

function OrgProfileTab() {
  const [form] = Form.useForm()
  return (
    <Form form={form} layout="vertical" initialValues={{ orgName: 'DueCircle Demo Org', email: 'info@duecircle.dev', currency: 'USD', timezone: 'America/New_York', address: '123 Business Ave, New York, NY 10001', taxNumber: 'US-TAX-12345' }}>
      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Form.Item name="orgName" label="Organization Name" rules={[{ required: true }]}><Input /></Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item name="email" label="Business Email" rules={[{ required: true, type: 'email' }]}><Input /></Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item name="currency" label="Default Currency">
            <Select options={[{ value: 'USD', label: 'USD — US Dollar' }, { value: 'EUR', label: 'EUR — Euro' }, { value: 'GBP', label: 'GBP — British Pound' }]} />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item name="timezone" label="Timezone">
            <Select showSearch options={[{ value: 'America/New_York', label: 'America/New_York' }, { value: 'America/Los_Angeles', label: 'America/Los_Angeles' }, { value: 'Europe/London', label: 'Europe/London' }, { value: 'Asia/Colombo', label: 'Asia/Colombo' }]} />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item name="taxNumber" label="Tax / VAT Number"><Input /></Form.Item>
        </Col>
        <Col xs={24}>
          <Form.Item name="address" label="Business Address"><Input.TextArea rows={2} /></Form.Item>
        </Col>
      </Row>
      <Button type="primary" onClick={() => message.success('Organization profile saved')}>Save Changes</Button>
    </Form>
  )
}

function InvoiceNumberingTab() {
  const [form] = Form.useForm()
  return (
    <Form form={form} layout="vertical" initialValues={{ invoicePrefix: 'INV', invoiceNextNumber: 43, quotationPrefix: 'QT', quotationNextNumber: 16, paymentPrefix: 'PAY', paymentNextNumber: 22, paddingDigits: 5, resetYearly: false }}>
      <Title level={5} style={{ marginBottom: 16 }}>Invoice Numbering</Title>
      <Row gutter={16}>
        <Col xs={12} md={8}><Form.Item name="invoicePrefix" label="Invoice Prefix"><Input placeholder="INV" /></Form.Item></Col>
        <Col xs={12} md={8}><Form.Item name="invoiceNextNumber" label="Next Number"><InputNumber min={1} style={{ width: '100%' }} /></Form.Item></Col>
        <Col xs={0} md={8} />
        <Col xs={12} md={8}><Form.Item name="quotationPrefix" label="Quotation Prefix"><Input placeholder="QT" /></Form.Item></Col>
        <Col xs={12} md={8}><Form.Item name="quotationNextNumber" label="Next Number"><InputNumber min={1} style={{ width: '100%' }} /></Form.Item></Col>
        <Col xs={0} md={8} />
        <Col xs={12} md={8}><Form.Item name="paymentPrefix" label="Payment Prefix"><Input placeholder="PAY" /></Form.Item></Col>
        <Col xs={12} md={8}><Form.Item name="paymentNextNumber" label="Next Number"><InputNumber min={1} style={{ width: '100%' }} /></Form.Item></Col>
        <Col xs={0} md={8} />
        <Col xs={12} md={8}><Form.Item name="paddingDigits" label="Padding Digits"><InputNumber min={1} max={10} style={{ width: '100%' }} /></Form.Item></Col>
        <Col xs={24}><Form.Item name="resetYearly" label="Reset Numbering Yearly" valuePropName="checked"><Switch /></Form.Item></Col>
      </Row>
      <Button type="primary" onClick={() => message.success('Numbering settings saved')}>Save Changes</Button>
    </Form>
  )
}

function TaxRulesTab() {
  const [taxRules, setTaxRules] = useState(MOCK_TAX_RULES)
  const [modalOpen, setModalOpen] = useState(false)
  const [form] = Form.useForm()

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name', render: (v: string) => <strong>{v}</strong> },
    { title: 'Rate', dataIndex: 'rate', key: 'rate', render: (v: number) => `${v}%` },
    { title: 'Type', dataIndex: 'type', key: 'type', render: (v: string) => <Tag>{v}</Tag> },
    { title: 'Default', dataIndex: 'isDefault', key: 'isDefault', render: (v: boolean) => v ? <Tag color="green">Default</Tag> : null },
    { title: 'Actions', key: 'actions', render: (_: unknown, r: typeof MOCK_TAX_RULES[0]) => (
      <Button danger size="small" icon={<DeleteOutlined />} disabled={r.isDefault} onClick={() => setTaxRules(prev => prev.filter(t => t.id !== r.id))} />
    )},
  ]

  return (
    <>
      <div className="flex-between" style={{ marginBottom: 16 }}>
        <Text>Configure tax rates for your invoices and products.</Text>
        <Button type="primary" icon={<PlusOutlined />} size="small" onClick={() => setModalOpen(true)}>Add Tax Rule</Button>
      </div>
      <Table dataSource={taxRules} columns={columns} rowKey="id" pagination={false} size="middle" />
      <Modal title="Add Tax Rule" open={modalOpen} onCancel={() => { setModalOpen(false); form.resetFields() }} onOk={() => form.submit()} destroyOnClose>
        <Form form={form} layout="vertical" onFinish={(v) => { setTaxRules(prev => [...prev, { id: `t${Date.now()}`, ...v, isDefault: false }]); setModalOpen(false); form.resetFields() }}>
          <Form.Item name="name" label="Name" rules={[{ required: true }]}><Input placeholder="e.g. GST 10%" /></Form.Item>
          <Form.Item name="rate" label="Rate (%)" rules={[{ required: true }]}><InputNumber min={0} max={100} style={{ width: '100%' }} /></Form.Item>
          <Form.Item name="type" label="Type" rules={[{ required: true }]}><Select options={[{ value: 'VAT' }, { value: 'GST' }, { value: 'EXEMPT' }, { value: 'OTHER' }]} /></Form.Item>
        </Form>
      </Modal>
    </>
  )
}

function UsersRolesTab() {
  const [users, setUsers] = useState(MOCK_USERS)
  const [inviteOpen, setInviteOpen] = useState(false)
  const [form] = Form.useForm()

  const columns = [
    { title: 'User', key: 'user', render: (_: unknown, r: typeof MOCK_USERS[0]) => (
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <Avatar size={32} style={{ background: colorTokens.primary, fontSize: 12 }}>{initials(r.name)}</Avatar>
        <div>
          <div style={{ fontWeight: 600, fontSize: 13 }}>{r.name}</div>
          <div style={{ fontSize: 12, color: colorTokens.textSecondary }}>{r.email}</div>
        </div>
      </div>
    )},
    { title: 'Role', dataIndex: 'role', key: 'role', render: (v: string) => <Tag color={ROLE_COLORS[v]}>{v}</Tag> },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (v: string) => <Tag color={v === 'ACTIVE' ? 'green' : 'orange'}>{v}</Tag> },
    { title: 'Joined', dataIndex: 'joinedAt', key: 'joinedAt' },
    { title: 'Actions', key: 'actions', render: (_: unknown, r: typeof MOCK_USERS[0]) => (
      <Space>
        <Button size="small" icon={<EditOutlined />} disabled={r.role === 'OWNER'} />
        <Button size="small" danger icon={<DeleteOutlined />} disabled={r.role === 'OWNER'} onClick={() => setUsers(prev => prev.filter(u => u.id !== r.id))} />
      </Space>
    )},
  ]

  return (
    <>
      <div className="flex-between" style={{ marginBottom: 16 }}>
        <Text>Manage team members and their access levels.</Text>
        <Button type="primary" icon={<PlusOutlined />} size="small" onClick={() => setInviteOpen(true)}>Invite User</Button>
      </div>
      <Table dataSource={users} columns={columns} rowKey="id" size="middle" pagination={false} />
      <Modal title="Invite Team Member" open={inviteOpen} onCancel={() => { setInviteOpen(false); form.resetFields() }} onOk={() => form.submit()} destroyOnClose okText="Send Invite">
        <Form form={form} layout="vertical" onFinish={(v) => { console.log('Invite:', v); message.success(`Invitation sent to ${v.email}`); setInviteOpen(false); form.resetFields() }}>
          <Form.Item name="email" label="Email Address" rules={[{ required: true, type: 'email' }]}><Input placeholder="colleague@example.com" /></Form.Item>
          <Form.Item name="role" label="Role" rules={[{ required: true }]} initialValue="VIEWER">
            <Select options={[{ value: 'ADMIN', label: 'Admin — Full access except billing' }, { value: 'ACCOUNTANT', label: 'Accountant — Invoices, payments, reports' }, { value: 'VIEWER', label: 'Viewer — Read-only access' }]} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default function SettingsPage() {
  return (
    <div className="page-container">
      <Title level={4} style={{ marginBottom: 20 }}>Settings</Title>
      <Card style={{ borderRadius: 12 }}>
        <Tabs
          defaultActiveKey="org"
          items={[
            { key: 'org', label: 'Organization', children: <OrgProfileTab /> },
            { key: 'numbering', label: 'Invoice Numbering', children: <InvoiceNumberingTab /> },
            { key: 'tax', label: 'Tax Rules', children: <TaxRulesTab /> },
            { key: 'users', label: 'Users & Roles', children: <UsersRolesTab /> },
          ]}
        />
      </Card>
    </div>
  )
}
