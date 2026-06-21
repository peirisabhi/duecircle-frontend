import { Card, Form, Select, InputNumber, Input, Button, Row, Col, Typography, message } from 'antd'
import { useNavigate } from 'react-router-dom'
import { mockProducts, mockWarehouses } from '@shared/mocks/data'

const { Title } = Typography

const REASONS = [
  { value: 'SALE', label: 'Sale / Invoice' },
  { value: 'DAMAGED', label: 'Damaged / Defective' },
  { value: 'EXPIRED', label: 'Expired' },
  { value: 'SAMPLE', label: 'Sample / Demo' },
  { value: 'INTERNAL', label: 'Internal Use' },
  { value: 'OTHER', label: 'Other' },
]

export default function StockOutPage() {
  const navigate = useNavigate()
  const [form] = Form.useForm()

  const handleSubmit = async (values: unknown) => {
    console.log('Stock Out:', values)
    message.success('Stock deducted successfully')
    navigate('/app/stock')
  }

  const trackedProducts = mockProducts.filter(p => p.stockTracking)

  return (
    <div className="page-container" style={{ maxWidth: 700 }}>
      <div className="flex-between" style={{ marginBottom: 20 }}>
        <Title level={4} style={{ margin: 0 }}>Issue Stock Out</Title>
      </div>

      <Card style={{ borderRadius: 12 }}>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item name="productId" label="Product" rules={[{ required: true }]}>
                <Select placeholder="Select product" showSearch optionFilterProp="label"
                  options={trackedProducts.map(p => ({ value: p.id, label: `${p.name} (${p.sku}) — ${p.stock} available` }))} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="warehouseId" label="From Warehouse" rules={[{ required: true }]} initialValue="w1">
                <Select options={mockWarehouses.map(w => ({ value: w.id, label: w.name }))} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="quantity" label="Quantity" rules={[{ required: true }]}>
                <InputNumber min={1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="reason" label="Reason" rules={[{ required: true }]}>
                <Select options={REASONS} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="reference" label="Reference">
                <Input placeholder="e.g. INV-00042" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="notes" label="Notes">
                <Input.TextArea rows={3} placeholder="Optional notes..." />
              </Form.Item>
            </Col>
          </Row>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
            <Button onClick={() => navigate('/app/stock')}>Cancel</Button>
            <Button danger htmlType="submit">Issue Stock Out</Button>
          </div>
        </Form>
      </Card>
    </div>
  )
}
