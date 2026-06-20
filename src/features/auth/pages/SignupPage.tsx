import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Form, Input, Button, Select, Steps, Typography, Alert } from 'antd'
import { UserOutlined, MailOutlined, LockOutlined, BankOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'
import { useForm, Controller, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AuthLayout } from '../components/AuthLayout'
import { useSignup } from '../hooks/useAuth'
import { CURRENCIES, TIMEZONES } from '@shared/constants'
import { colorTokens } from '@styles/tokens'

const { Title, Text } = Typography

const schema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().min(1, 'Email is required').email('Enter a valid email'),
  password: z.string().min(8, 'At least 8 characters'),
  orgName: z.string().min(1, 'Organization name is required'),
  currency: z.string().min(1, 'Please select a currency'),
  timezone: z.string().min(1, 'Please select a timezone'),
})

type FormData = z.infer<typeof schema>

const STEPS = [
  { title: 'Your account', fields: ['firstName', 'lastName', 'email', 'password'] as const },
  { title: 'Organization', fields: ['orgName'] as const },
  { title: 'Preferences', fields: ['currency', 'timezone'] as const },
]

export default function SignupPage() {
  const { t } = useTranslation('auth')
  const [currentStep, setCurrentStep] = useState(0)
  const { mutate: signup, isPending, error } = useSignup()

  const { control, handleSubmit, trigger, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: '', lastName: '', email: '', password: '',
      orgName: '', currency: 'USD', timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
  })

  const nextStep = async () => {
    const valid = await trigger(STEPS[currentStep].fields as (keyof FormData)[])
    if (valid) setCurrentStep((s) => s + 1)
  }

  const onSubmit = (data: FormData) => signup(data)

  return (
    <AuthLayout>
      <div style={{ animation: 'fadeIn 0.3s ease' }}>
        <Title level={3} style={{ marginBottom: 4, fontSize: 24 }}>
          {t('signup.title')}
        </Title>
        <Text type="secondary" style={{ fontSize: 14 }}>
          {t('signup.subtitle')}
        </Text>

        <Steps
          current={currentStep}
          size="small"
          style={{ marginTop: 24, marginBottom: 28 }}
          items={STEPS.map((s) => ({ title: s.title }))}
        />

        {error && (
          <Alert
            type="error"
            message={(error as { message?: string }).message ?? 'Something went wrong'}
            showIcon
            style={{ marginBottom: 20, borderRadius: 8 }}
          />
        )}

        <Form layout="vertical" size="large" onFinish={handleSubmit(onSubmit)}>
          {/* Step 0 — Account */}
          {currentStep === 0 && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <Form.Item label="First name" validateStatus={errors.firstName ? 'error' : ''} help={errors.firstName?.message}>
                  <Controller name="firstName" control={control} render={({ field }) => (
                    <Input {...field} prefix={<UserOutlined style={{ color: colorTokens.textTertiary }} />} placeholder="Jane" autoFocus />
                  )} />
                </Form.Item>
                <Form.Item label="Last name" validateStatus={errors.lastName ? 'error' : ''} help={errors.lastName?.message}>
                  <Controller name="lastName" control={control} render={({ field }) => (
                    <Input {...field} prefix={<UserOutlined style={{ color: colorTokens.textTertiary }} />} placeholder="Smith" />
                  )} />
                </Form.Item>
              </div>
              <Form.Item label="Work email" validateStatus={errors.email ? 'error' : ''} help={errors.email?.message}>
                <Controller name="email" control={control} render={({ field }) => (
                  <Input {...field} type="email" prefix={<MailOutlined style={{ color: colorTokens.textTertiary }} />} placeholder="jane@company.com" />
                )} />
              </Form.Item>
              <Form.Item label="Password" validateStatus={errors.password ? 'error' : ''} help={errors.password?.message}>
                <Controller name="password" control={control} render={({ field }) => (
                  <Input.Password {...field} prefix={<LockOutlined style={{ color: colorTokens.textTertiary }} />} placeholder="At least 8 characters" />
                )} />
              </Form.Item>
            </>
          )}

          {/* Step 1 — Organization */}
          {currentStep === 1 && (
            <Form.Item label="Organization name" validateStatus={errors.orgName ? 'error' : ''} help={errors.orgName?.message}>
              <Controller name="orgName" control={control} render={({ field }) => (
                <Input {...field} prefix={<BankOutlined style={{ color: colorTokens.textTertiary }} />} placeholder="Acme Corp" autoFocus />
              )} />
            </Form.Item>
          )}

          {/* Step 2 — Preferences */}
          {currentStep === 2 && (
            <>
              <Form.Item label="Base currency" validateStatus={errors.currency ? 'error' : ''} help={errors.currency?.message}>
                <Controller name="currency" control={control} render={({ field }) => (
                  <Select
                    {...field}
                    showSearch
                    placeholder="Select currency"
                    options={CURRENCIES}
                    filterOption={(input, option) =>
                      (option?.label as string ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                  />
                )} />
              </Form.Item>
              <Form.Item label="Timezone" validateStatus={errors.timezone ? 'error' : ''} help={errors.timezone?.message}>
                <Controller name="timezone" control={control} render={({ field }) => (
                  <Select
                    {...field}
                    showSearch
                    placeholder="Select timezone"
                    options={TIMEZONES}
                    filterOption={(input, option) =>
                      (option?.label as string ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                  />
                )} />
              </Form.Item>
            </>
          )}

          {/* Navigation buttons */}
          <Form.Item style={{ marginTop: 8, marginBottom: 16 }}>
            <div style={{ display: 'flex', gap: 12 }}>
              {currentStep > 0 && (
                <Button onClick={() => setCurrentStep((s) => s - 1)} style={{ flex: 1, height: 44 }}>
                  Back
                </Button>
              )}
              {currentStep < STEPS.length - 1 ? (
                <Button type="primary" onClick={() => void nextStep()} style={{ flex: 2, height: 44, fontWeight: 600 }}>
                  Continue
                </Button>
              ) : (
                <Button type="primary" htmlType="submit" loading={isPending} style={{ flex: 2, height: 44, fontWeight: 600 }}>
                  {isPending ? 'Creating account...' : 'Create account'}
                </Button>
              )}
            </div>
          </Form.Item>
        </Form>

        <div style={{ textAlign: 'center' }}>
          <Text type="secondary" style={{ fontSize: 13 }}>
            {t('signup.alreadyHaveAccount')}{' '}
            <Link to="/auth/login" style={{ fontWeight: 600 }}>
              {t('signup.loginLink')}
            </Link>
          </Text>
        </div>
      </div>
    </AuthLayout>
  )
}
