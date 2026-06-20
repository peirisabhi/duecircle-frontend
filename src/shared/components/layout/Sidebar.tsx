import { useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, Tooltip } from 'antd'
import type { MenuProps } from 'antd'
import {
  DashboardOutlined,
  TeamOutlined,
  ShoppingOutlined,
  FileTextOutlined,
  CreditCardOutlined,
  SwapOutlined,
  BankOutlined,
  BarChartOutlined,
  SettingOutlined,
  InboxOutlined,
  StockOutlined,
  AuditOutlined,
  FileProtectOutlined,
} from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { useUiStore } from '@shared/store'
import { colorTokens } from '@styles/tokens'

type MenuItem = Required<MenuProps>['items'][number]

function makeItem(
  label: string,
  key: string,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return { key, icon, children, label: <Link to={key}>{label}</Link> } as MenuItem
}

function makeGroup(label: string, children: MenuItem[]): MenuItem {
  return { type: 'group', label, children } as MenuItem
}

export function Sidebar() {
  const { t } = useTranslation('common')
  const location = useLocation()
  const isCollapsed = useUiStore((s) => s.isSidebarCollapsed)

  // Determine which menu key is active based on current route
  const selectedKey = useMemo(() => {
    const path = location.pathname
    // Exact matches first, then prefix matches
    const routes = [
      '/app/dashboard',
      '/app/customers',
      '/app/products/units',
      '/app/products/warehouses',
      '/app/products',
      '/app/quotations',
      '/app/invoices',
      '/app/payments',
      '/app/credit-debit-notes',
      '/app/stock/movements',
      '/app/stock/in',
      '/app/stock/out',
      '/app/stock',
      '/app/cash-bank',
      '/app/reports/sales',
      '/app/reports/outstanding',
      '/app/reports/stock-valuation',
      '/app/reports/tax',
      '/app/reports',
      '/app/settings',
      '/app/notifications',
    ]
    return routes.find((r) => path === r || path.startsWith(r + '/')) ?? '/app/dashboard'
  }, [location.pathname])

  const openKeys = useMemo(() => {
    if (location.pathname.startsWith('/app/products')) return ['products']
    if (location.pathname.startsWith('/app/stock')) return ['stock']
    if (location.pathname.startsWith('/app/reports')) return ['reports']
    return []
  }, [location.pathname])

  const menuItems: MenuItem[] = [
    makeItem(t('nav.dashboard'), '/app/dashboard', <DashboardOutlined />),

    makeGroup('Sales', [
      makeItem(t('nav.customers'), '/app/customers', <TeamOutlined />),
      makeItem(t('nav.quotations'), '/app/quotations', <FileProtectOutlined />),
      makeItem(t('nav.invoices'), '/app/invoices', <FileTextOutlined />),
      makeItem(t('nav.payments'), '/app/payments', <CreditCardOutlined />),
      makeItem(t('nav.creditNotes'), '/app/credit-debit-notes', <SwapOutlined />),
    ]),

    makeGroup('Inventory', [
      {
        key: 'products',
        icon: <ShoppingOutlined />,
        label: t('nav.products'),
        children: [
          makeItem('All Products', '/app/products'),
          makeItem(t('nav.units'), '/app/products/units'),
          makeItem(t('nav.warehouses'), '/app/products/warehouses'),
        ],
      } as MenuItem,
      {
        key: 'stock',
        icon: <StockOutlined />,
        label: t('nav.stock'),
        children: [
          makeItem('Stock Overview', '/app/stock'),
          makeItem('Movements', '/app/stock/movements'),
          makeItem('Stock In', '/app/stock/in'),
          makeItem('Stock Out', '/app/stock/out'),
        ],
      } as MenuItem,
    ]),

    makeGroup('Finance', [
      makeItem(t('nav.cashBank'), '/app/cash-bank', <BankOutlined />),
      {
        key: 'reports',
        icon: <BarChartOutlined />,
        label: t('nav.reports'),
        children: [
          makeItem('Reports Overview', '/app/reports'),
          makeItem('Sales Report', '/app/reports/sales'),
          makeItem('Outstanding Dues', '/app/reports/outstanding'),
          makeItem('Stock Valuation', '/app/reports/stock-valuation'),
          makeItem('Tax Report', '/app/reports/tax'),
        ],
      } as MenuItem,
    ]),

    makeGroup('System', [
      makeItem(t('nav.notifications'), '/app/notifications', <InboxOutlined />),
      makeItem(t('nav.auditTrail'), '/app/settings/audit', <AuditOutlined />),
      makeItem(t('nav.settings'), '/app/settings', <SettingOutlined />),
    ]),
  ]

  return (
    <div
      style={{
        width: isCollapsed ? 64 : 240,
        minHeight: '100vh',
        background: colorTokens.sidebarBg,
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.2s ease',
        overflow: 'hidden',
        flexShrink: 0,
      }}
    >
      {/* Brand */}
      <div style={{
        height: 60,
        display: 'flex',
        alignItems: 'center',
        padding: isCollapsed ? '0 20px' : '0 20px',
        borderBottom: `1px solid ${colorTokens.sidebarBorder}`,
        flexShrink: 0,
      }}>
        <DueCircleBrand collapsed={isCollapsed} />
      </div>

      {/* Nav */}
      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', paddingTop: 8, paddingBottom: 24 }}>
        <Menu
          mode="inline"
          theme="dark"
          selectedKeys={[selectedKey]}
          defaultOpenKeys={openKeys}
          inlineCollapsed={isCollapsed}
          items={menuItems}
          style={{
            background: 'transparent',
            border: 'none',
          }}
        />
      </div>
    </div>
  )
}

function DueCircleBrand({ collapsed }: { collapsed: boolean }) {
  const logo = (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
      <circle cx="16" cy="16" r="16" fill={colorTokens.sidebarAccent} />
      <circle cx="16" cy="16" r="10" stroke="white" strokeWidth="2" fill="none" />
      <circle cx="16" cy="16" r="4" fill="white" />
    </svg>
  )

  if (collapsed) {
    return <Tooltip title="DueCircle" placement="right">{logo}</Tooltip>
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      {logo}
      <span style={{
        fontSize: 16,
        fontWeight: 700,
        color: '#FFFFFF',
        letterSpacing: '-0.3px',
        whiteSpace: 'nowrap',
      }}>
        DueCircle
      </span>
    </div>
  )
}
