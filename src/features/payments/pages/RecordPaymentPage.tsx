import { useState, useMemo, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Form, Input, InputNumber, Select, DatePicker, Button, Card, Table, Typography, Space, Alert, Divider, Tag } from 'antd'
import { ArrowLeftOutlined, SaveOutlined, InfoCircleOutlined } from '@ant-design/icons'
import { useForm, Controller, useWatch } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { App } from 'antd'
import dayjs from 'dayjs'
import { allocateFIFO } from '@shared/utils/invoice-calc'
import { formatCurrency, formatDate } from '@shared/utils'
import { mockCustomers, mockInvoices } from '@shared/mocks/data'
import { PAYMENT_METHODS } from '@shared/constants'
import { colorTokens } from '@styles/tokens'

const { Title, Text } = Typography

const schema = z.object({
  customerId: z.string().min(1, 'Customer is required'),
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  method: z.string().min(1, 'Payment method is required'),
  date: z.string().min(1),
  reference: z.string().optional(),
  notes: z.string().optional(),
})
type FormData = z.infer<typeof schema>

export default function RecordPaymentPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { message } = App.useApp()
  const presetCustomerId = searchParams.get('customerId') ?? ''

  const { control, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { customerId: presetCustomerId, amount: 0, method: 'BANK_TRANSFER', date: dayjs().format('YYYY-MM-DD'), reference: '', notes: '' },
  })

  const customerId = useWatch({ control, name: 'customerId' })
  const amount = useWatch({ control, name: 'amount' }) ?? 0

  // Get open invoices for selected customer
  const openInvoices = useMemo(() =>
    mockInvoices
      .filter(i => i.customerId === customerId && !['PAID','VOIDED','CANCELLED'].includes(i.status))
      .map(i => ({ invoiceId: i.id, invoiceNumber: i.invoiceNumber, dueDate: i.dueDate, outstanding: i.total - i.paid }))
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()),
    [customerId])

  // FIFO allocation
  const { allocations, unallocated } = useMemo(() => allocateFIFO(amount, openInvoices), [amount, openInvoices])
  const [manualAllocations, setManualAllocations] = useState<Record<string, number>>({})

  // Reset manual overrides when customer or amount changes
  useEffect(() => { setManualAllocations({}) }, [customerId, amount])

  const effectiveAllocations = Object.keys(manualAllocations).length > 0
    ? allocations.map(a => ({ ...a, allocated: manualAllocations[a.invoiceId] ?? a.allocated }))
    : allocations

  const onSubmit = async () => {
    await new Promise(r => setTimeout(r, 700))
    void message.success('Payment recorded successfully')
    navigate('/app/payments')
  }

  const allocationColumns = [
    { title: 'Invoice', dataIndex: 'invoiceNumber', key: 'inv' },
    { title: 'Due Date', dataIndex: 'dueDate', key: 'due', render: (v: string) => <Text style={{ fontSize: 12 }}>{formatDate(v)}</Text> },
    { title: 'Outstanding', dataIndex: 'outstanding', key: 'outstanding', align: 'right' as const, render: (v: number) => <span style={{ color: colorTokens.error }}>{formatCurrency(v)}</span> },
    {
      title: 'Allocate', key: 'allocate', align: 'right' as const,
      render: (_: unknown, r: typeof openInvoices[0]) => {
        const auto = allocations.find(a => a.invoiceId === r.invoiceId)?.allocated ?? 0
        const val = manualAllocations[r.invoiceId] ?? auto
        return (
          <InputNumber value={val} min={0} max={r.outstanding} precision={2}
            onChange={v => setManualAllocations(prev => ({ ...prev, [r.invoiceId]: v ?? 0 }))}
            style={{ width: 100 }} controls={false}
            prefix="$" size="small"
            styles={{ input: { fontWeight: 600, color: val > 0 ? colorTokens.success : undefined } }} />
        )
      },
    },
  ]

  return (
    <div className="page-container" style={{ maxWidth: 800 }}>
      <div className="flex-between" style={{ marginBottom: 20 }}>
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/app/payments')}>Back</Button>
          <Title level={4} style={{ margin: 0 }}>Record Payment</Title>
        </Space>
      </div>

      <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
        <Card title="Payment Details" style={{ borderRadius: 12, marginBottom: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
            <Form.Item label="Customer *" validateStatus={errors.customerId ? 'error' : ''} help={errors.customerId?.message} style={{ gridColumn: 'span 2', margin: 0 }}>
              <Controller name="customerId" control={control} render={({ field: f }) =>
                <Select {...f} showSearch placeholder="Select customer..." style={{ width: '100%' }}
                  options={mockCustomers.map(c => ({ value: c.id, label: c.name }))}
                  filterOption={(input, opt) => (opt?.label as string ?? '').toLowerCase().includes(input.toLowerCase())} />
              } />
            </Form.Item>
            <Form.Item label="Amount *" validateStatus={errors.amount ? 'error' : ''} help={errors.amount?.message} style={{ margin: 0 }}>
              <Controller name="amount" control={control} render={({ field: f }) =>
                <InputNumber {...f} min={0} precision={2} prefix="$" style={{ width: '100%' }} size="large"
                  onChange={v => f.onChange(v ?? 0)} />
              } />
            </Form.Item>
            <Form.Item label="Payment Method *" style={{ margin: 0 }}>
              <Controller name="method" control={control} render={({ field: f }) =>
                <Select {...f} options={PAYMENT_METHODS} />
              } />
            </Form.Item>
            <Form.Item label="Payment Date" style={{ margin: 0 }}>
              <Controller name="date" control={control} render={({ field: f }) =>
                <DatePicker value={f.value ? dayjs(f.value) : null} onChange={d => f.onChange(d?.format('YYYY-MM-DD'))} style={{ width: '100%' }} />
              } />
            </Form.Item>
            <Form.Item label="Reference / Cheque No." style={{ margin: 0 }}>
              <Controller name="reference" control={control} render={({ field: f }) => <Input {...f} placeholder="Optional" />} />
            </Form.Item>
          </div>
          <Form.Item label="Internal Notes" style={{ marginTop: 16, marginBottom: 0 }}>
            <Controller name="notes" control={control} render={({ field: f }) => <Input.TextArea {...f} rows={2} />} />
          </Form.Item>
        </Card>

        {/* Allocation panel */}
        {customerId && openInvoices.length > 0 && amount > 0 && (
          <Card
            title={
              <Space>
                Invoice Allocation
                <Tag color="blue" style={{ fontWeight: 400 }}>Auto-allocated (FIFO)</Tag>
              </Space>
            }
            style={{ borderRadius: 12, marginBottom: 16 }}
          >
            <Alert
              type="info"
              icon={<InfoCircleOutlined />}
              showIcon
              message="Payment is auto-allocated oldest-first. You can override amounts manually."
              style={{ marginBottom: 16, borderRadius: 8 }}
            />
            <Table dataSource={openInvoices} columns={allocationColumns} rowKey="invoiceId" size="small" pagination={false} />
            {unallocated > 0 && (
              <div style={{ marginTop: 12, padding: '8px 12px', background: colorTokens.warningBg, borderRadius: 8, display: 'flex', justifyContent: 'space-between' }}>
                <Text style={{ color: colorTokens.warning }}>Unallocated excess</Text>
                <Text strong style={{ color: colorTokens.warning }}>{formatCurrency(unallocated)}</Text>
              </div>
            )}
            <Divider style={{ margin: '12px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text>Total being applied</Text>
              <Text strong style={{ color: colorTokens.success }}>{formatCurrency(amount - unallocated)}</Text>
            </div>
          </Card>
        )}

        {customerId && openInvoices.length === 0 && (
          <Alert type="success" message="This customer has no outstanding invoices." showIcon style={{ marginBottom: 16, borderRadius: 8 }} />
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
          <Button onClick={() => navigate('/app/payments')}>Cancel</Button>
          <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={isSubmitting}>Save Payment</Button>
        </div>
      </Form>
    </div>
  )
}
