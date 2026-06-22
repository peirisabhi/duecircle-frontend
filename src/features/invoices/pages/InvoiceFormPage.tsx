import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { Form, Input, Select, DatePicker, Button, Card, Row, Col, Typography, Space, Divider } from 'antd'
import { ArrowLeftOutlined, SaveOutlined, SendOutlined } from '@ant-design/icons'
import { useForm, Controller, useWatch } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { App } from 'antd'
import dayjs from 'dayjs'
import { LineItemEditor } from '@shared/components/forms/LineItemEditor'
import type { LineItemRow } from '@shared/components/forms/LineItemEditor'
import { AmountSummary } from '@shared/components/ui/AmountSummary'
import { calcDocumentTotals, lineItemsToInputs } from '@shared/utils/invoice-calc'
import { mockCustomers } from '@shared/mocks/data'

const { Title, Text } = Typography

const PAYMENT_TERMS = [
  { value: 'DUE_ON_RECEIPT', label: 'Due on Receipt' },
  { value: 'NET_7', label: 'Net 7 days' },
  { value: 'NET_15', label: 'Net 15 days' },
  { value: 'NET_30', label: 'Net 30 days' },
  { value: 'NET_60', label: 'Net 60 days' },
  { value: 'CUSTOM', label: 'Custom date' },
]

const schema = z.object({
  customerId: z.string().min(1, 'Customer is required'),
  issueDate: z.string().min(1),
  dueDate: z.string().min(1),
  paymentTerms: z.string().optional(),
  notes: z.string().optional(),
  terms: z.string().optional(),
  items: z.array(z.object({
    productName: z.string(), description: z.string().optional(),
    quantity: z.number().min(0), unitPrice: z.number().min(0),
    discount: z.number().min(0), discountType: z.enum(['PERCENT','AMOUNT']),
    taxRate: z.number().min(0),
  })).min(1),
})
type FormData = z.infer<typeof schema>

export default function InvoiceFormPage() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { message } = App.useApp()
  const isEdit = !!id && id !== 'new'

  const { control, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      customerId: searchParams.get('customerId') ?? '',
      issueDate: dayjs().format('YYYY-MM-DD'),
      dueDate: dayjs().add(30,'day').format('YYYY-MM-DD'),
      paymentTerms: 'NET_30', notes: '', terms: 'Payment due within 30 days.',
      items: [{ productName: '', description: '', quantity: 1, unitPrice: 0, discount: 0, discountType: 'PERCENT', taxRate: 0 }],
    },
  })

  const items = (useWatch({ control, name: 'items' }) ?? []) as LineItemRow[]
  const totals = calcDocumentTotals(lineItemsToInputs(items))

  const onSubmit = async () => {
    await new Promise(r => setTimeout(r, 700))
    void message.success(isEdit ? 'Invoice updated' : 'Invoice created')
    navigate('/app/invoices')
  }

  return (
    <div className="page-container" style={{ maxWidth: 960 }}>
      <div className="flex-between" style={{ marginBottom: 20 }}>
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/app/invoices')}>Back</Button>
          <Title level={4} style={{ margin: 0 }}>{isEdit ? 'Edit Invoice' : 'New Invoice'}</Title>
        </Space>
        <Space>
          <Button icon={<SendOutlined />}>Save & Send</Button>
          <Button type="primary" icon={<SaveOutlined />} onClick={handleSubmit(onSubmit)} loading={isSubmitting}>Save Draft</Button>
        </Space>
      </div>

      <Form layout="vertical">
        <Row gutter={[16,0]}>
          <Col xs={24} lg={16}>
            <Card style={{ borderRadius: 12, marginBottom: 16 }}>
              <Row gutter={16}>
                <Col xs={24}>
                  <Form.Item label="Customer *" validateStatus={errors.customerId ? 'error' : ''} help={errors.customerId?.message}>
                    <Controller name="customerId" control={control} render={({ field: f }) =>
                      <Select {...f} showSearch placeholder="Select customer..." style={{ width: '100%' }}
                        options={mockCustomers.map(c => ({ value: c.id, label: c.name }))}
                        filterOption={(input, opt) => (opt?.label as string ?? '').toLowerCase().includes(input.toLowerCase())} />
                    } />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={8}>
                  <Form.Item label="Issue Date">
                    <Controller name="issueDate" control={control} render={({ field: f }) =>
                      <DatePicker value={f.value ? dayjs(f.value) : null} onChange={d => f.onChange(d?.format('YYYY-MM-DD'))} style={{ width: '100%' }} />
                    } />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={8}>
                  <Form.Item label="Payment Terms">
                    <Controller name="paymentTerms" control={control} render={({ field: f }) =>
                      <Select {...f} options={PAYMENT_TERMS} style={{ width: '100%' }} />
                    } />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={8}>
                  <Form.Item label="Due Date">
                    <Controller name="dueDate" control={control} render={({ field: f }) =>
                      <DatePicker value={f.value ? dayjs(f.value) : null} onChange={d => f.onChange(d?.format('YYYY-MM-DD'))} style={{ width: '100%' }} />
                    } />
                  </Form.Item>
                </Col>
              </Row>
            </Card>

            <Card title="Line Items" style={{ borderRadius: 12, marginBottom: 16 }}>
              <div style={{ overflowX: 'auto' }}>
                <LineItemEditor control={control} setValue={setValue} />
              </div>
            </Card>

            <Card title="Notes & Terms" style={{ borderRadius: 12, marginBottom: 16 }}>
              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item label="Notes">
                    <Controller name="notes" control={control} render={({ field: f }) => <Input.TextArea {...f} rows={3} placeholder="Thank you for your business." />} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item label="Payment Terms">
                    <Controller name="terms" control={control} render={({ field: f }) => <Input.TextArea {...f} rows={3} />} />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <Card style={{ borderRadius: 12, position: 'sticky', top: 80 }}>
              <Text style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94A3B8' }}>Summary</Text>
              <Divider style={{ margin: '12px 0' }} />
              <AmountSummary subtotal={totals.subtotal} taxTotal={totals.taxTotal} total={totals.total} discountTotal={totals.discountTotal} />
            </Card>
          </Col>
        </Row>
      </Form>
    </div>
  )
}
