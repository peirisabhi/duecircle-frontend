import { useNavigate, useSearchParams } from 'react-router-dom'
import { Form, Input, InputNumber, Select, Button, Card, Row, Col, Typography, Space, Alert } from 'antd'
import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { App } from 'antd'
import { mockCustomers, mockInvoices } from '@shared/mocks/data'

const { Title } = Typography
const schema = z.object({
  customerId: z.string().min(1, 'Customer is required'),
  invoiceId: z.string().min(1, 'Invoice is required'),
  amount: z.number().min(0.01, 'Amount is required'),
  reason: z.string().min(1, 'Reason is required'),
  type: z.enum(['CREDIT', 'DEBIT']),
  notes: z.string().optional(),
})
type FormData = z.infer<typeof schema>

export default function CreateCreditNotePage() {
  const navigate = useNavigate()
  const { message } = App.useApp()
  const { control, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { customerId: '', invoiceId: '', amount: 0, reason: '', type: 'CREDIT', notes: '' },
  })

  const customerId = watch('customerId')
  const customerInvoices = mockInvoices.filter(i => i.customerId === customerId)

  const onSubmit = async () => {
    await new Promise(r => setTimeout(r, 600))
    void message.success('Credit note created')
    navigate('/app/credit-debit-notes')
  }

  return (
    <div className="page-container" style={{ maxWidth: 640 }}>
      <div className="flex-between" style={{ marginBottom: 20 }}>
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/app/credit-debit-notes')}>Back</Button>
          <Title level={4} style={{ margin: 0 }}>New Credit Note</Title>
        </Space>
      </div>
      <Alert type="info" showIcon message="A credit note reduces the amount a customer owes. A debit note increases it." style={{ marginBottom: 16, borderRadius: 8 }} />
      <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
        <Card style={{ borderRadius: 12, marginBottom: 16 }}>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item label="Type">
                <Controller name="type" control={control} render={({ field: f }) =>
                  <Select {...f} options={[{ value: 'CREDIT', label: 'Credit Note (reduces balance)' }, { value: 'DEBIT', label: 'Debit Note (increases balance)' }]} />
                } />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="Customer *" validateStatus={errors.customerId ? 'error' : ''} help={errors.customerId?.message}>
                <Controller name="customerId" control={control} render={({ field: f }) =>
                  <Select {...f} showSearch placeholder="Select customer..."
                    options={mockCustomers.map(c => ({ value: c.id, label: c.name }))}
                    filterOption={(input, opt) => (opt?.label as string ?? '').toLowerCase().includes(input.toLowerCase())} />
                } />
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item label="Related Invoice *" validateStatus={errors.invoiceId ? 'error' : ''} help={errors.invoiceId?.message}>
                <Controller name="invoiceId" control={control} render={({ field: f }) =>
                  <Select {...f} placeholder="Select invoice..." disabled={!customerId}
                    options={customerInvoices.map(i => ({ value: i.id, label: `${i.invoiceNumber} — ${i.customerName} — $${i.total}` }))} />
                } />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="Amount *" validateStatus={errors.amount ? 'error' : ''} help={errors.amount?.message}>
                <Controller name="amount" control={control} render={({ field: f }) =>
                  <InputNumber {...f} min={0} precision={2} prefix="$" style={{ width: '100%' }} onChange={v => f.onChange(v ?? 0)} />
                } />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="Reason *" validateStatus={errors.reason ? 'error' : ''} help={errors.reason?.message}>
                <Controller name="reason" control={control} render={({ field: f }) =>
                  <Select {...f} options={['Returned items', 'Billing error', 'Price adjustment', 'Damaged goods', 'Service not rendered', 'Other'].map(r => ({ value: r, label: r }))} />
                } />
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item label="Internal Notes">
                <Controller name="notes" control={control} render={({ field: f }) => <Input.TextArea {...f} rows={2} />} />
              </Form.Item>
            </Col>
          </Row>
        </Card>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
          <Button onClick={() => navigate('/app/credit-debit-notes')}>Cancel</Button>
          <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={isSubmitting}>Create Credit Note</Button>
        </div>
      </Form>
    </div>
  )
}
