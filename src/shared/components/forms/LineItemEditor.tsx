/**
 * Dynamic line-item editor shared by Invoice and Quotation forms.
 * Supports add/remove rows, product autocomplete, qty, price, discount, tax, live totals.
 */
import { Button, Input, InputNumber, Select, Tooltip, AutoComplete } from 'antd'
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import { useFieldArray, useWatch, Control, UseFormSetValue, FieldValues } from 'react-hook-form'
import { calcLineItem } from '@shared/utils/invoice-calc'
import { formatCurrency } from '@shared/utils'
import { colorTokens } from '@styles/tokens'
import { TAX_RATES } from '@shared/constants'

// Mock product options — replace with useQuery fetching real products
const PRODUCT_OPTIONS = [
  { value: 'Web Design Services', label: 'Web Design Services', price: 1200, taxRate: 0 },
  { value: 'SEO Package', label: 'SEO Package', price: 800, taxRate: 0 },
  { value: 'Hosting (Annual)', label: 'Hosting (Annual)', price: 240, taxRate: 18 },
  { value: 'Logo Design', label: 'Logo Design', price: 500, taxRate: 0 },
  { value: 'Mobile App Dev', label: 'Mobile App Dev', price: 5000, taxRate: 0 },
  { value: 'Content Writing (per 1000 words)', label: 'Content Writing', price: 80, taxRate: 0 },
  { value: 'Social Media Management', label: 'Social Media Management', price: 350, taxRate: 18 },
]

export interface LineItemRow {
  productName: string
  description?: string
  quantity: number
  unitPrice: number
  discount: number
  discountType: 'PERCENT' | 'AMOUNT'
  taxRate: number
}

// The parent form's type must include: items: LineItemRow[]
// Generic over the parent's form values so callers can pass their own typed
// Control/setValue without it being narrowed to `Control<any>`.
interface Props<TFieldValues extends FieldValues = FieldValues> {
  control: Control<TFieldValues>
  setValue: UseFormSetValue<TFieldValues>
  currency?: string
  fieldName?: string
}

export function LineItemEditor<TFieldValues extends FieldValues = FieldValues>({
  control,
  setValue,
  currency = 'USD',
  fieldName = 'items',
}: Props<TFieldValues>) {
  // Field paths are built dynamically (e.g. `${fieldName}.${index}.unitPrice`),
  // so we intentionally widen to `any` for the internal field-array plumbing.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const genericControl = control as unknown as Control<any>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const setFieldValue = setValue as unknown as UseFormSetValue<any>
  const { fields, append, remove } = useFieldArray({ control: genericControl, name: fieldName })
  const items: LineItemRow[] = useWatch({ control: genericControl, name: fieldName }) ?? []

  const addRow = () =>
    append({ productName: '', description: '', quantity: 1, unitPrice: 0, discount: 0, discountType: 'PERCENT', taxRate: 0 })

  const onProductSelect = (value: string, index: number) => {
    const product = PRODUCT_OPTIONS.find((p) => p.value === value)
    if (product) {
      setFieldValue(`${fieldName}.${index}.unitPrice`, product.price)
      setFieldValue(`${fieldName}.${index}.taxRate`, product.taxRate)
    }
  }

  const colStyle = (width: number | string, align: 'left' | 'right' | 'center' = 'left'): React.CSSProperties => ({
    width, minWidth: width as number, textAlign: align, flexShrink: 0,
  })

  const headerCell = (label: string, width: number | string, align: 'left' | 'right' | 'center' = 'left') => (
    <div style={{ ...colStyle(width, align), fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: colorTokens.textSecondary, padding: '8px 6px' }}>
      {label}
    </div>
  )

  return (
    <div>
      {/* Table header */}
      <div style={{ display: 'flex', gap: 8, borderBottom: `1px solid ${colorTokens.border}`, marginBottom: 4, paddingBottom: 4 }}>
        {headerCell('#', 32, 'center')}
        {headerCell('Product / Description', '30%')}
        {headerCell('Qty', 80, 'right')}
        {headerCell('Unit Price', 110, 'right')}
        {headerCell('Disc %', 80, 'right')}
        {headerCell('Tax %', 90, 'right')}
        {headerCell('Amount', 110, 'right')}
        <div style={{ width: 36 }} />
      </div>

      {/* Rows */}
      {fields.map((field, index) => {
        const row = items[index] ?? { quantity: 1, unitPrice: 0, discount: 0, taxRate: 0 }
        const calc = calcLineItem({ quantity: row.quantity, unitPrice: row.unitPrice, discount: row.discount, discountType: row.discountType, taxRate: row.taxRate })

        return (
          <div key={field.id} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', padding: '6px 0', borderBottom: `1px solid ${colorTokens.bgPage}` }}>
            {/* # */}
            <div style={{ ...colStyle(32, 'center'), paddingTop: 6, color: colorTokens.textTertiary, fontSize: 12 }}>{index + 1}</div>

            {/* Product name + description */}
            <div style={{ flex: 1, minWidth: 160, display: 'flex', flexDirection: 'column', gap: 4 }}>
              <AutoComplete
                options={PRODUCT_OPTIONS}
                filterOption={(input, opt) => (opt?.label as string ?? '').toLowerCase().includes(input.toLowerCase())}
                value={row.productName}
                onChange={(val) => setFieldValue(`${fieldName}.${index}.productName`, val)}
                onSelect={(val) => { setFieldValue(`${fieldName}.${index}.productName`, val); onProductSelect(val, index) }}
                placeholder="Product or service name"
                style={{ width: '100%' }}
              >
                <Input size="small" />
              </AutoComplete>
              <Input
                size="small"
                placeholder="Description (optional)"
                value={row.description ?? ''}
                onChange={(e) => setFieldValue(`${fieldName}.${index}.description`, e.target.value)}
                style={{ fontSize: 12, color: colorTokens.textSecondary }}
              />
            </div>

            {/* Qty */}
            <InputNumber
              size="small"
              min={0}
              value={row.quantity}
              onChange={(v) => setFieldValue(`${fieldName}.${index}.quantity`, v ?? 0)}
              style={{ width: 80, textAlign: 'right' }}
              controls={false}
            />

            {/* Unit Price */}
            <InputNumber
              size="small"
              min={0}
              precision={2}
              value={row.unitPrice}
              onChange={(v) => setFieldValue(`${fieldName}.${index}.unitPrice`, v ?? 0)}
              style={{ width: 110, textAlign: 'right' }}
              controls={false}
            />

            {/* Discount */}
            <InputNumber
              size="small"
              min={0}
              max={100}
              value={row.discount}
              onChange={(v) => setFieldValue(`${fieldName}.${index}.discount`, v ?? 0)}
              style={{ width: 80, textAlign: 'right' }}
              controls={false}
              suffix="%"
            />

            {/* Tax */}
            <Select
              size="small"
              value={row.taxRate}
              onChange={(v) => setFieldValue(`${fieldName}.${index}.taxRate`, v)}
              style={{ width: 90 }}
              options={TAX_RATES}
            />

            {/* Amount */}
            <div style={{ ...colStyle(110, 'right'), paddingTop: 5, fontSize: 13, fontWeight: 600 }}>
              {formatCurrency(calc.lineTotal, { currency })}
            </div>

            {/* Delete */}
            <Tooltip title="Remove line">
              <Button
                type="text"
                danger
                size="small"
                icon={<DeleteOutlined />}
                onClick={() => remove(index)}
                disabled={fields.length === 1}
                style={{ width: 28, flexShrink: 0 }}
              />
            </Tooltip>
          </div>
        )
      })}

      {/* Add row */}
      <Button
        type="dashed"
        icon={<PlusOutlined />}
        onClick={addRow}
        style={{ marginTop: 12, width: '100%' }}
      >
        Add Line Item
      </Button>
    </div>
  )
}
