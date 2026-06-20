import { Typography, Empty } from 'antd'
const { Title, Text } = Typography
export default function ReportsDashboardPage() {
  return (
    <div className="page-container">
      <div className="page-header"><Title level={4} style={{ margin: 0 }}>ReportsDashboardPage</Title></div>
      <Empty description={<Text type="secondary">Coming soon — check build order.</Text>} />
    </div>
  )
}
