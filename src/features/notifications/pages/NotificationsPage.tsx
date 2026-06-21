import { useState } from 'react'
import { Card, List, Badge, Button, Empty, Tag, Typography, Space, Tooltip, Avatar } from 'antd'
import { BellOutlined, CheckOutlined, DeleteOutlined, ExclamationCircleOutlined, CheckCircleOutlined, ShoppingOutlined, FileTextOutlined, ClockCircleOutlined } from '@ant-design/icons'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { mockNotifications } from '@shared/mocks/data'
import { colorTokens } from '@styles/tokens'

const { Title, Text } = Typography

const TYPE_CONFIG: Record<string, { color: string; icon: React.ReactNode; bg: string }> = {
  OVERDUE:   { color: colorTokens.error,   icon: <ExclamationCircleOutlined />, bg: '#FEE2E2' },
  PAYMENT:   { color: colorTokens.success, icon: <CheckCircleOutlined />,       bg: '#D1FAE5' },
  QUOTATION: { color: colorTokens.primary, icon: <FileTextOutlined />,           bg: '#EDE9FE' },
  STOCK:     { color: colorTokens.warning, icon: <ShoppingOutlined />,           bg: '#FEF3C7' },
  DUE_SOON:  { color: '#0284C7',           icon: <ClockCircleOutlined />,        bg: '#E0F2FE' },
}

const RESOURCE_PATHS: Record<string, string> = {
  INVOICE: '/app/invoices',
  PAYMENT: '/app/payments',
  QUOTATION: '/app/quotations',
  PRODUCT: '/app/products',
}

function timeAgo(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime()
  const h = Math.floor(ms / 3600000)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

export default function NotificationsPage() {
  const navigate = useNavigate()
  const qc = useQueryClient()
  const [filter, setFilter] = useState<'ALL' | 'UNREAD'>('ALL')

  const { data: notifications = [] } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => { await new Promise(r => setTimeout(r, 200)); return mockNotifications },
  })

  const unreadCount = notifications.filter(n => !n.isRead).length
  const displayed = filter === 'UNREAD' ? notifications.filter(n => !n.isRead) : notifications

  const markAllRead = () => qc.setQueryData(['notifications'], (old: typeof mockNotifications) => old?.map(n => ({ ...n, isRead: true })))
  const markRead = (id: string) => qc.setQueryData(['notifications'], (old: typeof mockNotifications) => old?.map(n => n.id === id ? { ...n, isRead: true } : n))
  const dismiss = (id: string) => qc.setQueryData(['notifications'], (old: typeof mockNotifications) => old?.filter(n => n.id !== id))

  return (
    <div className="page-container" style={{ maxWidth: 760 }}>
      <div className="flex-between" style={{ marginBottom: 20 }}>
        <Space align="center">
          <Title level={4} style={{ margin: 0 }}>Notifications</Title>
          {unreadCount > 0 && <Badge count={unreadCount} style={{ background: colorTokens.primary }} />}
        </Space>
        <Space>
          <Button.Group>
            <Button type={filter === 'ALL' ? 'primary' : 'default'} size="small" onClick={() => setFilter('ALL')}>All</Button>
            <Button type={filter === 'UNREAD' ? 'primary' : 'default'} size="small" onClick={() => setFilter('UNREAD')}>Unread {unreadCount > 0 ? `(${unreadCount})` : ''}</Button>
          </Button.Group>
          {unreadCount > 0 && <Button size="small" icon={<CheckOutlined />} onClick={markAllRead}>Mark all read</Button>}
        </Space>
      </div>

      <Card style={{ borderRadius: 12 }}>
        {displayed.length === 0 ? (
          <Empty image={<BellOutlined style={{ fontSize: 48, color: colorTokens.textTertiary }} />} description={filter === 'UNREAD' ? 'No unread notifications' : 'No notifications'} style={{ padding: '32px 0' }} />
        ) : (
          <List
            dataSource={displayed}
            renderItem={n => {
              const cfg = TYPE_CONFIG[n.type] ?? TYPE_CONFIG['STOCK']
              const path = RESOURCE_PATHS[n.resourceType]
              return (
                <List.Item
                  style={{ padding: '14px 4px', opacity: n.isRead ? 0.65 : 1, cursor: path ? 'pointer' : 'default' }}
                  onClick={() => { markRead(n.id); if (path) navigate(path) }}
                  actions={[
                    <Tooltip title="Dismiss" key="dismiss">
                      <Button type="text" size="small" icon={<DeleteOutlined />} danger onClick={(e) => { e.stopPropagation(); dismiss(n.id) }} />
                    </Tooltip>,
                    !n.isRead ? (
                      <Tooltip title="Mark as read" key="read">
                        <Button type="text" size="small" icon={<CheckOutlined />} onClick={(e) => { e.stopPropagation(); markRead(n.id) }} />
                      </Tooltip>
                    ) : null,
                  ].filter(Boolean)}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar style={{ background: cfg.bg, color: cfg.color, flexShrink: 0 }} icon={cfg.icon} />
                    }
                    title={
                      <Space size={6}>
                        {!n.isRead && <div style={{ width: 7, height: 7, borderRadius: '50%', background: colorTokens.primary, display: 'inline-block' }} />}
                        <Text strong>{n.title}</Text>
                        <Text type="secondary" style={{ fontSize: 12 }}>{timeAgo(n.createdAt)}</Text>
                      </Space>
                    }
                    description={<Text type="secondary">{n.body}</Text>}
                  />
                </List.Item>
              )
            }}
          />
        )}
      </Card>
    </div>
  )
}
