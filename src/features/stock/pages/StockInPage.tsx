import { Card, Form, Select, InputNumber, Input, Button, Row, Col, Typography, message } from 'antd'
import { useNavigate } from 'react-router-dom'
import { mockProducts, mockWarehouses } from '@shared/mocks/data'

const { Title } = Typography

export default function StockInPage() {
  const navigate = useNavigate()
  const [form] = Form.useForm()

  const handleSubmit = async (values: unknown) => {
    console.log('Stock In:', values)
    message.success('Stock received successfully')
    navigate('/app/stock')
  }

  const trackedProducts = mockProducts.filter(p => p.stockTracking)

  return (
    <div className="page-container" style={{ maxWidth: 700 }}>
      <div className="flex-between" style={{ marginBottom: 20 }}>
        <Title level={4} style={{ margin: 0 }}>Receive Stock</Title>
      </div>

      <Card style={{ borderRadius: 12 }}>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item name="productId" label="Product" rules={[{ required: true }]}>
                <Select placeholder="Select product" showSearch optionFilterProp="label"
                  options={trackedProducts.map(p => ({ value: p.id, label: `${p.name} (${p.sku}) — ${p.stock} in stock` }))} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="warehouseId" label="Warehouse" rules={[{ required: true }]} initialValue="w1">
                <Select options={mockWarehouses.map(w => ({ value: w.id, label: w.name }))} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="quantity" label="Quantity" rules={[{ required: true }]}>
                <InputNumber min={1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="unitCost" label="Unit Cost" rules={[{ required: true }]}>
                <InputNumber min={0} precision={2} prefix="$" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="reference" label="Reference / PO Number">
                <Input placeholder="e.g. PO-001" />
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
            <Button type="primary" htmlType="submit">Receive Stock</Button>
          </div>
        </Form>
      </Card>
    </div>
  )
}
