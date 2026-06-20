import type { ThemeConfig } from 'antd'
import { colorTokens, borderRadiusTokens, typographyTokens } from './tokens'

/**
 * Ant Design theme configuration for DueCircle.
 * Applied via <ConfigProvider theme={antdTheme}> at the app root.
 */
export const antdTheme: ThemeConfig = {
  token: {
    // Brand colors
    colorPrimary: colorTokens.primary,
    colorSuccess: colorTokens.success,
    colorWarning: colorTokens.warning,
    colorError: colorTokens.error,
    colorInfo: colorTokens.info,

    // Text
    colorText: colorTokens.text,
    colorTextSecondary: colorTokens.textSecondary,
    colorTextTertiary: colorTokens.textTertiary,
    colorTextDisabled: colorTokens.textDisabled,

    // Surfaces
    colorBgBase: colorTokens.bgCard,
    colorBgContainer: colorTokens.bgCard,
    colorBgLayout: colorTokens.bgPage,
    colorBgElevated: colorTokens.bgCard,

    // Borders
    colorBorder: colorTokens.border,
    colorBorderSecondary: colorTokens.border,

    // Typography
    fontFamily: typographyTokens.fontFamily,
    fontSize: typographyTokens.fontSizeBase,
    fontSizeLG: typographyTokens.fontSizeLg,
    fontSizeSM: typographyTokens.fontSizeSm,

    // Shape
    borderRadius: borderRadiusTokens.md,
    borderRadiusLG: borderRadiusTokens.lg,
    borderRadiusSM: borderRadiusTokens.sm,

    // Sizing
    controlHeight: 36,
    controlHeightLG: 42,
    controlHeightSM: 28,

    // Motion
    motionDurationSlow: '0.25s',
    motionDurationMid: '0.15s',
    motionDurationFast: '0.1s',

    // Shadows
    boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.08)',
    boxShadowSecondary: '0 4px 6px -1px rgb(0 0 0 / 0.07)',
  },
  components: {
    Button: {
      borderRadius: borderRadiusTokens.md,
      fontWeight: typographyTokens.fontWeightMedium,
      primaryShadow: 'none',
    },
    Card: {
      borderRadius: borderRadiusTokens.lg,
      boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.06)',
    },
    Table: {
      headerBg: colorTokens.bgPage,
      headerColor: colorTokens.textSecondary,
      headerSortActiveBg: colorTokens.bgPage,
      rowHoverBg: colorTokens.bgCardHover,
      borderColor: colorTokens.border,
      borderRadius: borderRadiusTokens.lg,
      fontSize: typographyTokens.fontSizeBase,
    },
    Form: {
      labelColor: colorTokens.textSecondary,
      labelFontSize: typographyTokens.fontSizeSm,
    },
    Input: {
      borderRadius: borderRadiusTokens.md,
      activeBorderColor: colorTokens.primary,
      hoverBorderColor: colorTokens.primaryHover,
    },
    Select: {
      borderRadius: borderRadiusTokens.md,
    },
    DatePicker: {
      borderRadius: borderRadiusTokens.md,
    },
    Modal: {
      borderRadius: borderRadiusTokens.xl,
    },
    Drawer: {
      borderRadius: 0,
    },
    Tag: {
      borderRadius: borderRadiusTokens.sm,
      fontSize: typographyTokens.fontSizeXs,
      fontWeightStrong: typographyTokens.fontWeightSemibold,
    },
    Badge: {
      fontSize: typographyTokens.fontSizeXs,
    },
    Tabs: {
      inkBarColor: colorTokens.primary,
      itemSelectedColor: colorTokens.primary,
    },
    Menu: {
      itemBorderRadius: borderRadiusTokens.md,
      subMenuItemBorderRadius: borderRadiusTokens.md,
    },
    Statistic: {
      titleFontSize: typographyTokens.fontSizeSm,
      contentFontSize: typographyTokens.fontSize2xl,
    },
  },
}

/**
 * Dark mode theme overlay — merges on top of antdTheme when dark mode is active.
 */
export const antdDarkTheme: ThemeConfig = {
  ...antdTheme,
  token: {
    ...antdTheme.token,
    colorBgBase: '#0F172A',
    colorBgContainer: '#1E293B',
    colorBgLayout: '#0F172A',
    colorBgElevated: '#1E293B',
    colorText: '#F1F5F9',
    colorTextSecondary: '#94A3B8',
    colorBorder: '#334155',
    colorBorderSecondary: '#1E293B',
  },
}
