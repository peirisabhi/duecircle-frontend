import { Outlet } from 'react-router-dom'
import { Layout, Drawer, Button } from 'antd'
import { MenuOutlined } from '@ant-design/icons'
import { useState, useEffect } from 'react'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'
import { useUiStore } from '@shared/store'
import { colorTokens } from '@styles/tokens'

const { Sider, Header, Content } = Layout

const MOBILE_BREAKPOINT = 768

export default function AppLayout() {
  const isSidebarCollapsed = useUiStore((s) => s.isSidebarCollapsed)
  const toggleSidebar = useUiStore((s) => s.toggleSidebar)
  const [isMobile, setIsMobile] = useState(window.innerWidth < MOBILE_BREAKPOINT)
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // ─── Mobile layout ──────────────────────────────────────────────────
  if (isMobile) {
    return (
      <Layout style={{ minHeight: '100vh', background: colorTokens.bgPage }}>
        <Header
          style={{
            height: 56,
            lineHeight: '56px',
            padding: '0 16px',
            background: '#fff',
            borderBottom: `1px solid ${colorTokens.border}`,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            position: 'sticky',
            top: 0,
            zIndex: 200,
          }}
        >
          <Button
            type="text"
            icon={<MenuOutlined />}
            onClick={() => setMobileDrawerOpen(true)}
            aria-label="Open menu"
          />
          <span style={{ fontWeight: 700, fontSize: 16, color: colorTokens.text, flex: 1 }}>
            DueCircle
          </span>
          <TopBar mobileMode />
        </Header>

        <Drawer
          open={mobileDrawerOpen}
          onClose={() => setMobileDrawerOpen(false)}
          placement="left"
          width={240}
          styles={{ body: { padding: 0, background: colorTokens.sidebarBg } }}
          closeIcon={false}
        >
          <Sidebar />
        </Drawer>

        <Content style={{ overflow: 'auto' }}>
          <Outlet />
        </Content>
      </Layout>
    )
  }

  // ─── Desktop layout ─────────────────────────────────────────────────
  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Sidebar — using antd Sider so Layout auto-sets flex-direction: row */}
      <Sider
        width={240}
        collapsedWidth={64}
        collapsed={isSidebarCollapsed}
        onCollapse={toggleSidebar}
        trigger={null}
        className="no-print"
        style={{
          background: colorTokens.sidebarBg,
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflowY: 'auto',
          overflowX: 'hidden',
          zIndex: 100,
          flexShrink: 0,
        }}
      >
        <Sidebar />
      </Sider>

      {/* Main column */}
      <Layout style={{ background: colorTokens.bgPage }}>
        <Header
          style={{
            padding: 0,
            height: 60,
            lineHeight: '60px',
            background: '#fff',
            borderBottom: `1px solid ${colorTokens.border}`,
            position: 'sticky',
            top: 0,
            zIndex: 200,
          }}
        >
          <TopBar />
        </Header>

        <Content style={{ overflow: 'auto', minHeight: 'calc(100vh - 60px)' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}
