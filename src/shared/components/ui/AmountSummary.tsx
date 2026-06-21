import { Divider } from 'antd'
import { formatCurrency } from '@shared/utils'
import { colorTokens } from '@styles/tokens'

interface Props {
  subtotal: number
  discountTotal?: number
  taxTotal: number
  total: number
  currency?: string
  paid?: number
  style?: React.CSSProperties
}

export function AmountSummary({ subtotal, discountTotal = 0, taxTotal, total, currency = 'USD', paid, style }: Props) {
  const balance = paid !== undefined ? Math.max(0, total - paid) : undefined

  const Row = ({ label, value, bold, color }: { label: string; value: string; bold?: boolean; color?: string }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0' }}>
      <span style={{ color: colorTokens.textSecondary, fontSize: 13 }}>{label}</span>
      <span style={{ fontWeight: bold ? 700 : 500, fontSize: bold ? 16 : 13, color: color ?? colorTokens.text }}>
        {value}
      </span>
    </div>
  )

  return (
    <div style={{ background: colorTokens.bgPage, borderRadius: 10, padding: '16px 20px', minWidth: 260, ...style }}>
      <Row label="Subtotal" value={formatCurrency(subtotal, { currency })} />
      {discountTotal > 0 && (
        <Row label="Discount" value={`−${formatCurrency(discountTotal, { currency })}`} color={colorTokens.success} />
      )}
      <Row label="Tax" value={formatCurrency(taxTotal, { currency })} />
      <Divider style={{ margin: '8px 0' }} />
      <Row label="Total" value={formatCurrency(total, { currency })} bold />
      {paid !== undefined && (
        <>
          <Row label="Paid" value={formatCurrency(paid, { currency })} color={colorTokens.success} />
          <Row
            label="Balance Due"
            value={formatCurrency(balance!, { currency })}
            bold
            color={balance! > 0 ? colorTokens.error : colorTokens.success}
          />
        </>
      )}
    </div>
  )
}
