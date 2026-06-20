import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { colorTokens } from '@styles/tokens'

interface Props {
  children: ReactNode
  showBrand?: boolean
}

export function AuthLayout({ children, showBrand = true }: Props) {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'grid',
      gridTemplateColumns: '1fr',
      background: colorTokens.bgPage,
    }}>
      {/* Left panel — branding (hidden on mobile) */}
      <div style={{
        display: 'none',
        '@media (min-width: 1024px)': { display: 'flex' },
      }} />

      {/* Right panel — form */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 24px',
        minHeight: '100vh',
      }}>
        <div style={{ width: '100%', maxWidth: 420 }}>
          {showBrand && (
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
              <Link to="/" style={{ textDecoration: 'none' }}>
                <DueCircleLogo size={48} />
                <div style={{
                  marginTop: 12,
                  fontSize: 22,
                  fontWeight: 700,
                  color: colorTokens.text,
                  letterSpacing: '-0.5px',
                }}>
                  DueCircle
                </div>
              </Link>
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  )
}

function DueCircleLogo({ size = 40 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'inline-block' }}
    >
      <circle cx="20" cy="20" r="20" fill={colorTokens.primary} />
      <circle cx="20" cy="20" r="12" stroke="white" strokeWidth="2.5" fill="none" />
      <circle cx="20" cy="20" r="5" fill="white" />
    </svg>
  )
}
