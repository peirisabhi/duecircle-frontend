import { useParams, useNavigate } from 'react-router-dom'
import { Form, Input, Select, Button, Card, Row, Col, Typography, Space, Divider } from 'antd'
import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { App } from 'antd'
import { mockCustomers } from '@shared/mocks/data'

const { Title } = Typography

const schema = z.object({
  name: z.string().min(1, 'Customer name is required'),
  email: z.string().email('Invalid email').or(z.literal('')),
  phone: z.string().optional(),
  creditLimit: z.number().min(0).optional(),
  openingBalance: z.number().optional(),
  billingAddress: z.object({
    line1: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    postalCode: z.string().optional(),
    country: z.string().optional(),
  }),
  notes: z.string().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']),
})

type FormData = z.infer<typeof schema>

export default function CustomerFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { message } = App.useApp()
  const isEdit = !!id
  const existing = isEdit ? mockCustomers.find(c => c.id === id) : null

  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: existing?.name ?? '',
      email: existing?.email ?? '',
      phone: existing?.phone ?? '',
      creditLimit: 0,
      openingBalance: 0,
      billingAddress: { line1: '', city: existing?.city ?? '', state: '', postalCode: '', country: existing?.country ?? '' },
      notes: '',
      status: (existing?.status as 'ACTIVE' | 'INACTIVE') ?? 'ACTIVE',
    },
  })

  const onSubmit = async (_data: FormData) => {
    await new Promise(r => setTimeout(r, 600))
    void message.success(isEdit ? 'Customer updated' : 'Customer created')
    navigate('/app/customers')
  }

  const field = (name: keyof FormData, label: string, el: React.ReactNode) => (
    <Form.Item label={label} validateStatus={errors[name] ? 'error' : ''} help={(errors[name] as {message?: string})?.message}>
      {el}
    </Form.Item>
  )

  return (
    <div className="page-container" style={{ maxWidth: 800 }}>
      <div className="flex-between" style={{ marginBottom: 20 }}>
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/app/customers')}>Back</Button>
          <Title level={4} style={{ margin: 0 }}>{isEdit ? 'Edit Customer' : 'New Customer'}</Title>
        </Space>
      </div>

      <Form layout="vertical" onFinish={handleSubmit(onSubmit)} size="middle">
        <Card title="Customer Information" style={{ borderRadius: 12, marginBottom: 16 }}>
          <Row gutter={16}>
            <Col xs={24} md={16}>
              {field('name', 'Customer Name *', <Controller name="name" control={control} render={({ field: f }) => <Input {...f} placeholder="Acme Corporation" />} />)}
            </Col>
            <Col xs={24} md={8}>
              {field('status', 'Status', <Controller name="status" control={control} render={({ field: f }) => <Select {...f} options={[{ value: 'ACTIVE', label: 'Active' }, { value: 'INACTIVE', label: 'Inactive' }]} />} />)}
            </Col>
            <Col xs={24} md={12}>
              {field('email', 'Email', <Controller name="email" control={control} render={({ field: f }) => <Input {...f} type="email" placeholder="billing@company.com" />} />)}
            </Col>
            <Col xs={24} md={12}>
              {field('phone', 'Phone', <Controller name="phone" control={control} render={({ field: f }) => <Input {...f} placeholder="+1 555-0101" />} />)}
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="Credit Limit">
                <Controller name="creditLimit" control={control} render={({ field: f }) => <Input {...f} type="number" min={0} prefix="$" />} />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="Opening Balance">
                <Controller name="openingBalance" control={control} render={({ field: f }) => <Input {...f} type="number" prefix="$" />} />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        <Card title="Billing Address" style={{ borderRadius: 12, marginBottom: 16 }}>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item label="Street Address">
                <Controller name="billingAddress.line1" control={control} render={({ field: f }) => <Input {...f} placeholder="123 Main St" />} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="City">
                <Controller name="billingAddress.city" control={control} render={({ field: f }) => <Input {...f} />} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="State / Province">
                <Controller name="billingAddress.state" control={control} render={({ field: f }) => <Input {...f} />} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="Postal Code">
                <Controller name="billingAddress.postalCode" control={control} render={({ field: f }) => <Input {...f} />} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="Country">
                <Controller name="billingAddress.country" control={control} render={({ field: f }) => <Input {...f} placeholder="US" />} />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        <Card title="Notes" style={{ borderRadius: 12, marginBottom: 24 }}>
          <Controller name="notes" control={control} render={({ field: f }) => <Input.TextArea {...f} rows={3} placeholder="Internal notes about this customer..." />} />
        </Card>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
          <Button onClick={() => navigate('/app/customers')}>Cancel</Button>
          <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={isSubmitting}>
            {isEdit ? 'Save Changes' : 'Create Customer'}
          </Button>
        </div>
      </Form>
    </div>
  )
}
