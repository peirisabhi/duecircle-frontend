import { useNavigate } from 'react-router-dom'
import { Row, Col, Card, Button, Typography, Tag, List, Skeleton, Empty, Space } from 'antd'
import {
  PlusOutlined,
  FileTextOutlined,
  CreditCardOutlined,
  WarningOutlined,
  RiseOutlined,
  FallOutlined,
  ArrowRightOutlined,
} from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useOrgStore } from '@shared/store'
import { formatCurrency, formatDate } from '@shared/utils'
import { colorTokens } from '@styles/tokens'
import type { InvoiceStatus } from '@shared/types'

const { Title, Text } = Typography

// ─── Placeholder API types & fetchers ─────────────────────────────────
interface DashboardStats {
  totalOutstanding: number
  salesThisMonth: number
  salesLastMonth: number
  lowStockAlerts: number
  overdueInvoices: number
  unpaidInvoices: number
}

interface RecentInvoice {
  id: string
  invoiceNumber: string
  customerName: string
  total: number
  status: InvoiceStatus
  dueDate: string
  createdAt: string
}

interface SalesDataPoint {
  month: string
  sales: number
  collected: number
}

// Mock data for scaffold — replace with real API calls
const mockStats: DashboardStats = {
  totalOutstanding: 84250.0,
  salesThisMonth: 32400.0,
  salesLastMonth: 28100.0,
  lowStockAlerts: 4,
  overdueInvoices: 7,
  unpaidInvoices: 23,
}

const mockSalesData: SalesDataPoint[] = [
  { month: 'Jan', sales: 18200, collected: 14000 },
  { month: 'Feb', sales: 22400, collected: 20000 },
  { month: 'Mar', sales: 19800, collected: 17500 },
  { month: 'Apr', sales: 26000, collected: 23000 },
  { month: 'May', sales: 28100, collected: 25000 },
  { month: 'Jun', sales: 32400, collected: 28000 },
]

const mockRecentInvoices: RecentInvoice[] = [
  { id: '1', invoiceNumber: 'INV-00042', customerName: 'Acme Corp', total: 4200, status: 'OVERDUE', dueDate: '2026-05-15', createdAt: '2026-05-01' },
  { id: '2', invoiceNumber: 'INV-00041', customerName: 'Blue Sky Ltd', total: 8750, status: 'SENT', dueDate: '2026-06-30', createdAt: '2026-06-01' },
  { id: '3', invoiceNumber: 'INV-00040', customerName: 'Vertex Inc', total: 1200, status: 'PAID', dueDate: '2026-06-15', createdAt: '2026-05-28' },
  { id: '4', invoiceNumber: 'INV-00039', customerName: 'Summit Group', total: 3400, status: 'PARTIAL', dueDate: '2026-06-20', createdAt: '2026-05-25' },
  { id: '5', invoiceNumber: 'INV-00038', customerName: 'River Co', total: 660, status: 'DRAFT', dueDate: '2026-07-01', createdAt: '2026-06-18' },
]

const statusColors: Record<InvoiceStatus, string> = {
  DRAFT: colorTokens.statusDraft,
  SENT: colorTokens.statusSent,
  PAID: colorTokens.statusPaid,
  PARTIAL: colorTokens.statusPartial,
  OVERDUE: colorTokens.statusOverdue,
  VOIDED: colorTokens.statusVoided,
  CANCELLED: colorTokens.statusVoided,
}

function StatusTag({ status }: { status: InvoiceStatus }) {
  return (
    <Tag
      style={{
        color: statusColors[status],
        background: `${statusColors[status]}18`,
        border: 'none',
        fontWeight: 600,
        fontSize: 11,
        textTransform: 'uppercase',
      }}
    >
      {status}
    </Tag>
  )
}

// KPI Card skeleton
function KpiSkeleton() {
  return (
    <Card style={{ borderRadius: 12 }}>
      <Skeleton active paragraph={{ rows: 2 }} title={false} />
    </Card>
  )
}

export default function DashboardPage() {
  const navigate = useNavigate()
  const activeOrg = useOrgStore((s) => s.activeOrg)
  const currency = activeOrg?.currency ?? 'USD'

  // In production, replace with: useQuery({ queryKey: ['dashboard-stats'], queryFn: dashboardApi.getStats })
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard-stats', activeOrg?.id],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 600)) // simulate network
      return mockStats
    },
    enabled: !!activeOrg,
  })

  const salesGrowth = stats
    ? ((stats.salesThisMonth - stats.salesLastMonth) / stats.salesLastMonth) * 100
    : 0

  return (
    <div className="page-container" style={{ maxWidth: 1400, margin: '0 auto' }}>
      {/* Header */}
      <div className="page-header">
        <div>
          <Title level={4} style={{ margin: 0, fontSize: 20 }}>
            Dashboard
          </Title>
          <Text type="secondary" style={{ fontSize: 13 }}>
            {activeOrg?.name ?? 'Your organization'} — {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </Text>
        </div>
        <Space>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate('/app/invoices/new')}
          >
            New Invoice
          </Button>
          <Button icon={<FileTextOutlined />} onClick={() => navigate('/app/quotations/new')}>
            New Quotation
          </Button>
          <Button icon={<CreditCardOutlined />} onClick={() => navigate('/app/payments/new')}>
            Record Payment
          </Button>
        </Space>
      </div>

      {/* KPI Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {statsLoading ? (
          [1, 2, 3, 4].map((i) => (
            <Col key={i} xs={24} sm={12} xl={6}>
              <KpiSkeleton />
            </Col>
          ))
        ) : (
          <>
            <Col xs={24} sm={12} xl={6}>
              <KpiCard
                title="Total Outstanding"
                value={formatCurrency(stats?.totalOutstanding ?? 0, { currency })}
                icon={<FileTextOutlined />}
                iconColor={colorTokens.info}
                subtitle={`${stats?.unpaidInvoices ?? 0} unpaid invoices`}
                onClick={() => navigate('/app/reports/outstanding')}
              />
            </Col>
            <Col xs={24} sm={12} xl={6}>
              <KpiCard
                title="Sales This Month"
                value={formatCurrency(stats?.salesThisMonth ?? 0, { currency })}
                icon={salesGrowth >= 0 ? <RiseOutlined /> : <FallOutlined />}
                iconColor={salesGrowth >= 0 ? colorTokens.success : colorTokens.error}
                subtitle={
                  <span style={{ color: salesGrowth >= 0 ? colorTokens.success : colorTokens.error }}>
                    {salesGrowth >= 0 ? '▲' : '▼'} {Math.abs(salesGrowth).toFixed(1)}% vs last month
                  </span>
                }
                onClick={() => navigate('/app/reports/sales')}
              />
            </Col>
            <Col xs={24} sm={12} xl={6}>
              <KpiCard
                title="Overdue Invoices"
                value={String(stats?.overdueInvoices ?? 0)}
                icon={<WarningOutlined />}
                iconColor={colorTokens.error}
                subtitle="Require immediate attention"
                accent={colorTokens.errorBg}
                onClick={() => navigate('/app/invoices?status=OVERDUE')}
              />
            </Col>
            <Col xs={24} sm={12} xl={6}>
              <KpiCard
                title="Low Stock Alerts"
                value={String(stats?.lowStockAlerts ?? 0)}
                icon={<WarningOutlined />}
                iconColor={colorTokens.warning}
                subtitle="Products below minimum"
                accent={colorTokens.warningBg}
                onClick={() => navigate('/app/stock')}
              />
            </Col>
          </>
        )}
      </Row>

      {/* Charts + Recent Invoices */}
      <Row gutter={[16, 16]}>
        {/* Sales Chart */}
        <Col xs={24} lg={14}>
          <Card
            title="Sales vs Collected"
            extra={<Button type="link" size="small" onClick={() => navigate('/app/reports/sales')}>Full report <ArrowRightOutlined /></Button>}
            style={{ borderRadius: 12 }}
          >
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={mockSalesData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={colorTokens.primary} stopOpacity={0.15} />
                    <stop offset="95%" stopColor={colorTokens.primary} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="collectedGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={colorTokens.success} stopOpacity={0.15} />
                    <stop offset="95%" stopColor={colorTokens.success} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={colorTokens.border} vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: colorTokens.textTertiary }} />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: colorTokens.textTertiary }}
                  tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value, { currency })}
                  contentStyle={{ borderRadius: 8, border: `1px solid ${colorTokens.border}`, fontSize: 13 }}
                />
                <Area type="monotone" dataKey="sales" name="Sales" stroke={colorTokens.primary} strokeWidth={2} fill="url(#salesGrad)" dot={false} />
                <Area type="monotone" dataKey="collected" name="Collected" stroke={colorTokens.success} strokeWidth={2} fill="url(#collectedGrad)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* Recent Invoices */}
        <Col xs={24} lg={10}>
          <Card
            title="Recent Invoices"
            extra={<Button type="link" size="small" onClick={() => navigate('/app/invoices')}>View all <ArrowRightOutlined /></Button>}
            style={{ borderRadius: 12 }}
            styles={{ body: { padding: 0 } }}
          >
            <List
              dataSource={mockRecentInvoices}
              locale={{ emptyText: <Empty description="No invoices yet" style={{ padding: 24 }} /> }}
              renderItem={(invoice) => (
                <List.Item
                  key={invoice.id}
                  style={{
                    padding: '12px 20px',
                    cursor: 'pointer',
                    transition: 'background 0.15s',
                  }}
                  onClick={() => navigate(`/app/invoices/${invoice.id}`)}
                  onMouseEnter={(e) => (e.currentTarget.style.background = colorTokens.bgCardHover)}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                      <Text strong style={{ fontSize: 13 }}>{invoice.invoiceNumber}</Text>
                      <StatusTag status={invoice.status} />
                    </div>
                    <Text type="secondary" style={{ fontSize: 12 }} ellipsis>{invoice.customerName}</Text>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>
                      {formatCurrency(invoice.total, { currency })}
                    </div>
                    <Text type="secondary" style={{ fontSize: 11 }}>
                      Due {formatDate(invoice.dueDate)}
                    </Text>
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  )
}

// ─── KPI Card component ───────────────────────────────────────────────
interface KpiCardProps {
  title: string
  value: string
  icon: React.ReactNode
  iconColor: string
  subtitle: React.ReactNode
  accent?: string
  onClick?: () => void
}

function KpiCard({ title, value, icon, iconColor, subtitle, accent, onClick }: KpiCardProps) {
  return (
    <Card
      onClick={onClick}
      style={{
        borderRadius: 12,
        cursor: onClick ? 'pointer' : 'default',
        background: accent ?? 'white',
        transition: 'box-shadow 0.2s ease, transform 0.2s ease',
      }}
      onMouseEnter={(e) => {
        if (onClick) {
          ;(e.currentTarget as HTMLDivElement).style.transform = 'translateY(-1px)'
        }
      }}
      onMouseLeave={(e) => {
        ;(e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <Text style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: colorTokens.textSecondary }}>
            {title}
          </Text>
          <div style={{ fontSize: 26, fontWeight: 700, color: colorTokens.text, lineHeight: 1.2, marginTop: 6, marginBottom: 4 }}>
            {value}
          </div>
          <Text style={{ fontSize: 12, color: colorTokens.textSecondary }}>
            {subtitle}
          </Text>
        </div>
        <div style={{
          width: 40,
          height: 40,
          borderRadius: 10,
          background: `${iconColor}18`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: iconColor,
          fontSize: 18,
          flexShrink: 0,
        }}>
          {icon}
        </div>
      </div>
    </Card>
  )
}
