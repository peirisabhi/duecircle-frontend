import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Button,
  Badge,
  Dropdown,
  Avatar,
  Space,
  Switch,
  Input,
  Select,
  Typography,
  Divider,
  App,
} from 'antd'
import type { MenuProps } from 'antd'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined,
  SearchOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  SwapOutlined,
  MoonOutlined,
  SunOutlined,
} from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { useUiStore, useAuthStore, useOrgStore } from '@shared/store'
import { useLogout } from '@features/auth/hooks/useAuth'
import { colorTokens } from '@styles/tokens'
import { initials } from '@shared/utils'

const { Text } = Typography

interface TopBarProps {
  /** On mobile the hamburger is rendered by AppLayout, so skip the sidebar toggle */
  mobileMode?: boolean
}

export function TopBar({ mobileMode = false }: TopBarProps) {
  const { t } = useTranslation('common')
  const navigate = useNavigate()
  const { modal } = App.useApp()

  const isSidebarCollapsed = useUiStore((s) => s.isSidebarCollapsed)
  const toggleSidebar = useUiStore((s) => s.toggleSidebar)
  const isDarkMode = useUiStore((s) => s.isDarkMode)
  const toggleDarkMode = useUiStore((s) => s.toggleDarkMode)

  const user = useAuthStore((s) => s.user)
  const activeOrg = useOrgStore((s) => s.activeOrg)
  const memberships = useOrgStore((s) => s.memberships)
  const switchOrg = useOrgStore((s) => s.switchOrg)

  const { mutate: logout } = useLogout()

  const [searchVisible, setSearchVisible] = useState(false)

  const handleLogout = useCallback(() => {
    modal.confirm({
      title: 'Sign out',
      content: 'Are you sure you want to sign out?',
      okText: 'Sign out',
      cancelText: 'Cancel',
      onOk: () => logout(),
    })
  }, [modal, logout])

  const orgMenuItems: MenuProps['items'] = [
    {
      key: 'org-header',
      type: 'group',
      label: 'Switch organization',
    },
    ...memberships.map((m) => ({
      key: m.org.id,
      label: (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <span>{m.org.name}</span>
          {m.org.id === activeOrg?.id && (
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: colorTokens.success, display: 'inline-block' }} />
          )}
        </div>
      ),
      onClick: () => switchOrg(m.org.id),
    })),
  ]

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'user-info',
      label: (
        <div style={{ padding: '2px 0' }}>
          <div style={{ fontWeight: 600 }}>{user?.fullName}</div>
          <div style={{ fontSize: 12, color: colorTokens.textSecondary }}>{user?.email}</div>
        </div>
      ),
      disabled: true,
    },
    { type: 'divider' },
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
      onClick: () => navigate('/app/settings/profile'),
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
      onClick: () => navigate('/app/settings'),
    },
    {
      key: 'dark-mode',
      icon: isDarkMode ? <SunOutlined /> : <MoonOutlined />,
      label: (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24 }}>
          <span>{isDarkMode ? 'Light mode' : 'Dark mode'}</span>
          <Switch size="small" checked={isDarkMode} onChange={toggleDarkMode} />
        </div>
      ),
    },
    { type: 'divider' },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: t('misc.logout'),
      danger: true,
      onClick: handleLogout,
    },
  ]

  return (
    <div
      className="app-topbar no-print"
      style={{
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        padding: '0 16px',
        gap: 8,
      }}
    >
      {/* Sidebar toggle — hidden on mobile (hamburger is in AppLayout header) */}
      {!mobileMode && (
        <Button
          type="text"
          icon={isSidebarCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
          style={{ color: colorTokens.textSecondary }}
        />
      )}

      {/* Org switcher */}
      {memberships.length > 1 && (
        <Dropdown menu={{ items: orgMenuItems }} trigger={['click']}>
          <Button
            type="text"
            icon={<SwapOutlined />}
            style={{ color: colorTokens.textSecondary, fontSize: 13 }}
          >
            <Text strong style={{ fontSize: 13, maxWidth: 140 }} ellipsis>
              {activeOrg?.name ?? 'Select org'}
            </Text>
          </Button>
        </Dropdown>
      )}

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Global search */}
      {searchVisible ? (
        <Input
          autoFocus
          prefix={<SearchOutlined style={{ color: colorTokens.textTertiary }} />}
          placeholder="Search customers, invoices, products..."
          style={{ width: 320, borderRadius: 8 }}
          onBlur={() => setSearchVisible(false)}
          onKeyDown={(e) => e.key === 'Escape' && setSearchVisible(false)}
          allowClear
        />
      ) : (
        <Button
          type="text"
          icon={<SearchOutlined />}
          onClick={() => setSearchVisible(true)}
          aria-label="Search"
          style={{ color: colorTokens.textSecondary }}
        />
      )}

      {/* Notifications bell */}
      <Badge count={3} size="small" offset={[-2, 2]}>
        <Button
          type="text"
          icon={<BellOutlined />}
          onClick={() => navigate('/app/notifications')}
          aria-label="Notifications"
          style={{ color: colorTokens.textSecondary }}
        />
      </Badge>

      {/* User menu */}
      <Dropdown menu={{ items: userMenuItems }} trigger={['click']} placement="bottomRight">
        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px 8px',
            borderRadius: 8,
            transition: 'background 0.15s',
          }}
          aria-label="User menu"
        >
          <Avatar
            size={32}
            style={{ background: colorTokens.primary, fontSize: 12, fontWeight: 600, flexShrink: 0 }}
          >
            {initials(user?.fullName ?? 'U')}
          </Avatar>
          <div className="hide-mobile" style={{ textAlign: 'left' }}>
            <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.3, color: colorTokens.text }}>
              {user?.firstName ?? 'User'}
            </div>
            <div style={{ fontSize: 11, color: colorTokens.textSecondary, lineHeight: 1.3 }}>
              {activeOrg?.name ?? ''}
            </div>
          </div>
        </button>
      </Dropdown>
    </div>
  )
}
