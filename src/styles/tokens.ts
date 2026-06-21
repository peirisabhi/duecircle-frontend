/**
 * DueCircle Design Tokens
 * Single source of truth for the design system.
 * Consumed by antd ConfigProvider and global CSS variables.
 */

export const colorTokens = {
  // Brand — Indigo-based, distinct from antd default blue
  primary: '#4338CA',        // indigo-700
  primaryHover: '#4F46E5',   // indigo-600
  primaryActive: '#3730A3',  // indigo-800
  primaryBg: '#EEF2FF',      // indigo-50

  // Accent for positive financial states
  success: '#059669',
  successBg: '#ECFDF5',

  // Warning
  warning: '#D97706',
  warningBg: '#FFFBEB',

  // Error / destructive
  error: '#DC2626',
  errorBg: '#FEF2F2',

  // Info
  info: '#0284C7',
  infoBg: '#F0F9FF',

  // Neutrals
  text: '#0F172A',           // slate-900
  textSecondary: '#475569',  // slate-600
  textTertiary: '#94A3B8',   // slate-400
  textDisabled: '#CBD5E1',   // slate-300

  // Surfaces
  bgPage: '#F1F5F9',         // slate-100
  bgCard: '#FFFFFF',
  bgCardHover: '#F8FAFC',    // slate-50
  bgInput: '#FFFFFF',

  // Borders
  border: '#E2E8F0',         // slate-200
  borderStrong: '#CBD5E1',   // slate-300
  borderFocus: '#4338CA',

  // Sidebar (dark — lightened to slate-800 base)
  sidebarBg: '#1E293B',      // slate-800 (was slate-900, now lighter)
  sidebarBgActive: '#334155', // slate-700
  sidebarBgHover: '#2D3B4F',
  sidebarText: '#94A3B8',    // slate-400
  sidebarTextActive: '#FFFFFF',
  sidebarAccent: '#818CF8',  // indigo-400 (brighter on lighter bg)
  sidebarBorder: '#2D3B4F',

  // Status colors for badges
  statusDraft: '#6B7280',
  statusSent: '#0284C7',
  statusPaid: '#059669',
  statusPartial: '#D97706',
  statusOverdue: '#DC2626',
  statusVoided: '#9CA3AF',
  statusAccepted: '#059669',
  statusRejected: '#DC2626',
}

export const spacingTokens = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  '2xl': 32,
  '3xl': 48,
  '4xl': 64,
}

export const borderRadiusTokens = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
}

export const shadowTokens = {
  sm: '0 1px 3px 0 rgb(0 0 0 / 0.08), 0 1px 2px -1px rgb(0 0 0 / 0.06)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.07), 0 2px 4px -2px rgb(0 0 0 / 0.05)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.08), 0 4px 6px -4px rgb(0 0 0 / 0.05)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.08), 0 8px 10px -6px rgb(0 0 0 / 0.05)',
}

export const typographyTokens = {
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  fontFamilyMono: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
  fontSizeXs: 11,
  fontSizeSm: 12,
  fontSizeBase: 14,
  fontSizeMd: 15,
  fontSizeLg: 16,
  fontSizeXl: 18,
  fontSize2xl: 20,
  fontSize3xl: 24,
  fontWeightNormal: 400,
  fontWeightMedium: 500,
  fontWeightSemibold: 600,
  fontWeightBold: 700,
  lineHeightTight: 1.25,
  lineHeightNormal: 1.5,
  lineHeightRelaxed: 1.75,
}
