import { useSearchParams, Link } from 'react-router-dom'
import { Form, Input, Button, Typography, Alert, Progress } from 'antd'
import { LockOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'
import { useForm, Controller, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AuthLayout } from '../components/AuthLayout'
import { useResetPassword } from '../hooks/useAuth'
import { colorTokens } from '@styles/tokens'

const { Title, Text } = Typography

const schema = z
  .object({
    password: z
      .string()
      .min(8, 'At least 8 characters')
      .regex(/[0-9]/, 'Must include a number')
      .regex(/[^a-zA-Z0-9]/, 'Must include a special character'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

type FormData = z.infer<typeof schema>

function passwordStrength(pw: string): { score: number; label: string; color: string } {
  if (!pw) return { score: 0, label: '', color: '' }
  let score = 0
  if (pw.length >= 8) score++
  if (pw.length >= 12) score++
  if (/[A-Z]/.test(pw)) score++
  if (/[0-9]/.test(pw)) score++
  if (/[^a-zA-Z0-9]/.test(pw)) score++

  if (score <= 2) return { score: score * 20, label: 'Weak', color: colorTokens.error }
  if (score === 3) return { score: 60, label: 'Fair', color: colorTokens.warning }
  if (score === 4) return { score: 80, label: 'Good', color: colorTokens.info }
  return { score: 100, label: 'Strong', color: colorTokens.success }
}

export default function ResetPasswordPage() {
  const { t } = useTranslation('auth')
  const [params] = useSearchParams()
  const token = params.get('token') ?? ''
  const { mutate, isPending, error } = useResetPassword()

  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { password: '', confirmPassword: '' },
  })

  const passwordValue = useWatch({ control, name: 'password' })
  const strength = passwordStrength(passwordValue ?? '')

  if (!token) {
    return (
      <AuthLayout>
        <Alert
          type="error"
          message="Invalid reset link"
          description="This reset link is missing a token. Please request a new one."
          showIcon
          action={
            <Link to="/auth/forgot-password">
              <Button size="small">Request new link</Button>
            </Link>
          }
        />
      </AuthLayout>
    )
  }

  const onSubmit = (data: FormData) => {
    mutate({ token, password: data.password })
  }

  return (
    <AuthLayout>
      <div style={{ animation: 'fadeIn 0.3s ease' }}>
        <Link
          to="/auth/login"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 24, fontSize: 13, color: colorTokens.textSecondary }}
        >
          <ArrowLeftOutlined /> Back to sign in
        </Link>

        <Title level={3} style={{ marginBottom: 4, fontSize: 24 }}>
          {t('resetPassword.title')}
        </Title>
        <Text type="secondary" style={{ fontSize: 14 }}>
          {t('resetPassword.subtitle')}
        </Text>

        <Form layout="vertical" onFinish={handleSubmit(onSubmit)} style={{ marginTop: 28 }} size="large">
          {error && (
            <Alert
              type="error"
              message={(error as { message?: string }).message ?? 'Reset link is invalid or expired.'}
              showIcon
              style={{ marginBottom: 20, borderRadius: 8 }}
            />
          )}

          <Form.Item
            label={t('resetPassword.passwordLabel')}
            validateStatus={errors.password ? 'error' : ''}
            help={errors.password?.message}
          >
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <Input.Password
                  {...field}
                  prefix={<LockOutlined style={{ color: colorTokens.textTertiary }} />}
                  placeholder={t('resetPassword.passwordPlaceholder')}
                  autoComplete="new-password"
                  autoFocus
                />
              )}
            />
            {passwordValue && (
              <div style={{ marginTop: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <Text style={{ fontSize: 11, color: colorTokens.textTertiary }}>Password strength</Text>
                  <Text style={{ fontSize: 11, color: strength.color, fontWeight: 600 }}>{strength.label}</Text>
                </div>
                <Progress
                  percent={strength.score}
                  showInfo={false}
                  size="small"
                  strokeColor={strength.color}
                  trailColor={colorTokens.border}
                />
              </div>
            )}
          </Form.Item>

          <Form.Item
            label={t('resetPassword.confirmLabel')}
            validateStatus={errors.confirmPassword ? 'error' : ''}
            help={errors.confirmPassword?.message}
          >
            <Controller
              name="confirmPassword"
              control={control}
              render={({ field }) => (
                <Input.Password
                  {...field}
                  prefix={<LockOutlined style={{ color: colorTokens.textTertiary }} />}
                  placeholder={t('resetPassword.confirmPlaceholder')}
                  autoComplete="new-password"
                />
              )}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={isPending}
              size="large"
              style={{ height: 44, fontWeight: 600, fontSize: 15 }}
            >
              {isPending ? t('resetPassword.submitting') : t('resetPassword.submit')}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </AuthLayout>
  )
}
