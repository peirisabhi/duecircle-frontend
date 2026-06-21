import { useParams, useNavigate } from 'react-router-dom'
import { Form, Input, InputNumber, Select, Switch, Button, Card, Row, Col, Typography, Space } from 'antd'
import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { App } from 'antd'
import { mockProducts, mockUnits } from '@shared/mocks/data'
import { TAX_RATES } from '@shared/constants'

const { Title } = Typography

const schema = z.object({
  name: z.string().min(1, 'Product name is required'),
  sku: z.string().min(1, 'SKU is required'),
  category: z.string().optional(),
  unitPrice: z.number().min(0),
  taxRate: z.number().min(0).max(100),
  unit: z.string().optional(),
  description: z.string().optional(),
  stockTracking: z.boolean(),
  openingStock: z.number().min(0).optional(),
  reorderLevel: z.number().min(0).optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']),
})
type FormData = z.infer<typeof schema>

export default function ProductFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { message } = App.useApp()
  const isEdit = !!id && id !== 'new'
  const existing = isEdit ? mockProducts.find(p => p.id === id) : null

  const { control, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: existing?.name ?? '', sku: existing?.sku ?? '', category: existing?.category ?? '',
      unitPrice: existing?.unitPrice ?? 0, taxRate: existing?.taxRate ?? 0,
      unit: existing?.unit ?? 'pcs', description: '',
      stockTracking: existing?.stockTracking ?? false,
      openingStock: 0, reorderLevel: 5, status: (existing?.status as 'ACTIVE' | 'INACTIVE') ?? 'ACTIVE',
    },
  })
  const stockTracking = watch('stockTracking')

  const onSubmit = async () => {
    await new Promise(r => setTimeout(r, 600))
    void message.success(isEdit ? 'Product updated' : 'Product created')
    navigate('/app/products')
  }

  return (
    <div className="page-container" style={{ maxWidth: 760 }}>
      <div className="flex-between" style={{ marginBottom: 20 }}>
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/app/products')}>Back</Button>
          <Title level={4} style={{ margin: 0 }}>{isEdit ? 'Edit Product' : 'New Product'}</Title>
        </Space>
      </div>
      <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
        <Card title="Product Details" style={{ borderRadius: 12, marginBottom: 16 }}>
          <Row gutter={16}>
            <Col xs={24} md={16}>
              <Form.Item label="Product Name *" validateStatus={errors.name ? 'error' : ''} help={errors.name?.message}>
                <Controller name="name" control={control} render={({ field: f }) => <Input {...f} placeholder="Mechanical Keyboard" />} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="SKU *">
                <Controller name="sku" control={control} render={({ field: f }) => <Input {...f} placeholder="PRD-KBD-001" />} />
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item label="Description">
                <Controller name="description" control={control} render={({ field: f }) => <Input.TextArea {...f} rows={2} />} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="Category">
                <Controller name="category" control={control} render={({ field: f }) => <Input {...f} placeholder="Hardware" />} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="Unit">
                <Controller name="unit" control={control} render={({ field: f }) =>
                  <Select {...f} options={mockUnits.map(u => ({ value: u.abbreviation, label: `${u.name} (${u.abbreviation})` }))} />
                } />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="Status">
                <Controller name="status" control={control} render={({ field: f }) =>
                  <Select {...f} options={[{ value: 'ACTIVE', label: 'Active' }, { value: 'INACTIVE', label: 'Inactive' }]} />
                } />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        <Card title="Pricing & Tax" style={{ borderRadius: 12, marginBottom: 16 }}>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item label="Unit Price *">
                <Controller name="unitPrice" control={control} render={({ field: f }) => <InputNumber {...f} min={0} precision={2} prefix="$" style={{ width: '100%' }} />} />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="Tax Rate">
                <Controller name="taxRate" control={control} render={({ field: f }) =>
                  <Select {...f} options={TAX_RATES} style={{ width: '100%' }} />
                } />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        <Card title="Inventory" style={{ borderRadius: 12, marginBottom: 24 }}>
          <Form.Item label="Track Stock">
            <Controller name="stockTracking" control={control} render={({ field: f }) => <Switch checked={f.value} onChange={f.onChange} />} />
          </Form.Item>
          {stockTracking && (
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item label="Opening Stock">
                  <Controller name="openingStock" control={control} render={({ field: f }) => <InputNumber {...f} min={0} style={{ width: '100%' }} />} />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item label="Reorder Level (Low Stock Alert)">
                  <Controller name="reorderLevel" control={control} render={({ field: f }) => <InputNumber {...f} min={0} style={{ width: '100%' }} />} />
                </Form.Item>
              </Col>
            </Row>
          )}
        </Card>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
          <Button onClick={() => navigate('/app/products')}>Cancel</Button>
          <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={isSubmitting}>{isEdit ? 'Save Changes' : 'Create Product'}</Button>
        </div>
      </Form>
    </div>
  )
}
