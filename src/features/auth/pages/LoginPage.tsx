import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Form, Input, Button, Checkbox, Divider, Typography, Alert } from 'antd'
import { MailOutlined, LockOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AuthLayout } from '../components/AuthLayout'
import { useLogin } from '../hooks/useAuth'
import { useAuthStore } from '@shared/store'
import { colorTokens } from '@styles/tokens'

// Zod doesn't ship with zodResolver by default — import from @hookform/resolvers/zod
// npm install @hookform/resolvers
// Adding to package.json dependencies

const { Title, Text } = Typography

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
})

type LoginForm = z.infer<typeof loginSchema>

export default function LoginPage() {
  const { t } = useTranslation('auth')
  const navigate = useNavigate()
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const { mutate: login, isPending, error } = useLogin()

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', rememberMe: false },
  })

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) navigate('/app/dashboard', { replace: true })
  }, [isAuthenticated, navigate])

  const onSubmit = (data: LoginForm) => {
    login({ email: data.email, password: data.password, rememberMe: data.rememberMe })
  }

  return (
    <AuthLayout>
      <div style={{ animation: 'fadeIn 0.3s ease' }}>
        <Title level={3} style={{ marginBottom: 4, fontSize: 24 }}>
          {t('login.title')}
        </Title>
        <Text type="secondary" style={{ fontSize: 14 }}>
          {t('login.subtitle')}
        </Text>

        <Form
          layout="vertical"
          onFinish={handleSubmit(onSubmit)}
          style={{ marginTop: 28 }}
          size="large"
        >
          {error && (
            <Alert
              type="error"
              message={(error as { message?: string }).message ?? t('login.errors.invalidCredentials')}
              showIcon
              style={{ marginBottom: 20, borderRadius: 8 }}
            />
          )}

          <Form.Item
            label="Email address"
            validateStatus={errors.email ? 'error' : ''}
            help={errors.email?.message}
          >
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="email"
                  prefix={<MailOutlined style={{ color: colorTokens.textTertiary }} />}
                  placeholder={t('login.emailPlaceholder')}
                  autoComplete="email"
                  autoFocus
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Password"
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
                  placeholder={t('login.passwordPlaceholder')}
                  autoComplete="current-password"
                />
              )}
            />
          </Form.Item>

          <Form.Item>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Controller
                name="rememberMe"
                control={control}
                render={({ field }) => (
                  <Checkbox checked={field.value} onChange={field.onChange}>
                    <Text style={{ fontSize: 13 }}>{t('login.rememberMe')}</Text>
                  </Checkbox>
                )}
              />
              <Link
                to="/auth/forgot-password"
                style={{ fontSize: 13, color: colorTokens.primary }}
              >
                {t('login.forgotPassword')}
              </Link>
            </div>
          </Form.Item>

          <Form.Item style={{ marginBottom: 16 }}>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={isPending}
              size="large"
              style={{ height: 44, fontWeight: 600, fontSize: 15 }}
            >
              {isPending ? t('login.submitting') : t('login.submit')}
            </Button>
          </Form.Item>
        </Form>

        <Divider style={{ margin: '20px 0' }} />

        <div style={{ textAlign: 'center' }}>
          <Text type="secondary" style={{ fontSize: 13 }}>
            {t('login.noAccount')}{' '}
            <Link to="/auth/signup" style={{ fontWeight: 600 }}>
              {t('login.signupLink')}
            </Link>
          </Text>
        </div>
      </div>
    </AuthLayout>
  )
}
