import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Form, Input, Button, Typography, Result, Alert } from 'antd'
import { MailOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AuthLayout } from '../components/AuthLayout'
import { useForgotPassword } from '../hooks/useAuth'
import { colorTokens } from '@styles/tokens'

const { Title, Text } = Typography

const schema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
})
type FormData = z.infer<typeof schema>

export default function ForgotPasswordPage() {
  const { t } = useTranslation('auth')
  const [sentTo, setSentTo] = useState<string | null>(null)
  const { mutate, isPending, error } = useForgotPassword()

  const { control, handleSubmit, formState: { errors }, getValues } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: '' },
  })

  const onSubmit = (data: FormData) => {
    mutate(data.email, {
      onSuccess: () => setSentTo(data.email),
    })
  }

  if (sentTo) {
    return (
      <AuthLayout>
        <Result
          status="success"
          title={t('forgotPassword.successTitle')}
          subTitle={t('forgotPassword.successMessage', { email: sentTo })}
          extra={
            <Link to="/auth/login">
              <Button type="primary" icon={<ArrowLeftOutlined />}>
                {t('forgotPassword.backToLogin')}
              </Button>
            </Link>
          }
          style={{ padding: 0 }}
        />
      </AuthLayout>
    )
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
          {t('forgotPassword.title')}
        </Title>
        <Text type="secondary" style={{ fontSize: 14 }}>
          {t('forgotPassword.subtitle')}
        </Text>

        <Form layout="vertical" onFinish={handleSubmit(onSubmit)} style={{ marginTop: 28 }} size="large">
          {error && (
            <Alert
              type="error"
              message={(error as { message?: string }).message ?? 'Something went wrong'}
              showIcon
              style={{ marginBottom: 20, borderRadius: 8 }}
            />
          )}

          <Form.Item
            label={t('forgotPassword.emailLabel')}
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
                  placeholder={t('forgotPassword.emailPlaceholder')}
                  autoComplete="email"
                  autoFocus
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
              {isPending ? t('forgotPassword.submitting') : t('forgotPassword.submit')}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </AuthLayout>
  )
}
