import { useNavigate } from 'react-router-dom'
import { Card, Row, Col, Typography, Button } from 'antd'
import { BarChartOutlined, TeamOutlined, ShoppingOutlined, CalculatorOutlined } from '@ant-design/icons'
import { colorTokens } from '@styles/tokens'

const { Title, Text } = Typography

const REPORTS = [
  { title: 'Sales Report', description: 'Monthly and annual revenue, invoice counts, and collection rates', icon: <BarChartOutlined style={{ fontSize: 28 }} />, path: '/app/reports/sales', color: colorTokens.primary },
  { title: 'Outstanding Dues', description: 'Overdue invoices, aging summary, customer-wise outstanding balances', icon: <TeamOutlined style={{ fontSize: 28 }} />, path: '/app/reports/outstanding', color: colorTokens.error },
  { title: 'Stock Valuation', description: 'Inventory value by product and warehouse, low-stock analysis', icon: <ShoppingOutlined style={{ fontSize: 28 }} />, path: '/app/reports/stock-valuation', color: colorTokens.success },
  { title: 'Tax Report', description: 'VAT/GST collected and paid, tax-wise breakdown for filing', icon: <CalculatorOutlined style={{ fontSize: 28 }} />, path: '/app/reports/tax', color: colorTokens.warning },
]

export default function ReportsDashboardPage() {
  const navigate = useNavigate()
  return (
    <div className="page-container">
      <Title level={4} style={{ marginBottom: 24 }}>Reports</Title>
      <Row gutter={[16, 16]}>
        {REPORTS.map(r => (
          <Col key={r.path} xs={24} sm={12}>
            <Card
              hoverable
              style={{ borderRadius: 14, borderLeft: `4px solid ${r.color}`, cursor: 'pointer' }}
              onClick={() => navigate(r.path)}>
              <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <div style={{ color: r.color, padding: 12, background: `${r.color}11`, borderRadius: 10, flexShrink: 0 }}>{r.icon}</div>
                <div>
                  <Title level={5} style={{ margin: 0 }}>{r.title}</Title>
                  <Text type="secondary" style={{ fontSize: 13 }}>{r.description}</Text>
                  <div style={{ marginTop: 12 }}>
                    <Button size="small" type="link" style={{ paddingLeft: 0, color: r.color }} onClick={() => navigate(r.path)}>View report →</Button>
                  </div>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  )
}
