import { useSearchParams } from 'react-router-dom'
import { Form, Input, Button, Typography, Alert, Skeleton, Card } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AuthLayout } from '../components/AuthLayout'
import { useAcceptInvite } from '../hooks/useAuth'
import { authApi } from '../api'
import { colorTokens } from '@styles/tokens'

const { Title, Text } = Typography

const schema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  password: z.string().min(8, 'At least 8 characters'),
})
type FormData = z.infer<typeof schema>

export default function AcceptInvitePage() {
  const [params] = useSearchParams()
  const token = params.get('token') ?? ''

  const { data: invite, isLoading, error: inviteError } = useQuery({
    queryKey: ['invite-info', token],
    queryFn: () => authApi.getInviteInfo(token),
    enabled: !!token,
    retry: false,
  })

  const { mutate: acceptInvite, isPending, error: acceptError } = useAcceptInvite()

  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { firstName: '', lastName: '', password: '' },
  })

  const onSubmit = (data: FormData) => {
    acceptInvite({ token, ...data })
  }

  if (!token || inviteError) {
    return (
      <AuthLayout>
        <Alert
          type="error"
          message="Invalid invitation"
          description="This invitation link is invalid or has expired."
          showIcon
        />
      </AuthLayout>
    )
  }

  return (
    <AuthLayout>
      <div style={{ animation: 'fadeIn 0.3s ease' }}>
        {isLoading ? (
          <Skeleton active paragraph={{ rows: 6 }} />
        ) : (
          <>
            <Card
              style={{ background: colorTokens.primaryBg, border: `1px solid ${colorTokens.primary}22`, marginBottom: 28, borderRadius: 10 }}
              size="small"
            >
              <Text style={{ fontSize: 13 }}>
                <strong>{invite?.inviterName}</strong> invited you to join{' '}
                <strong>{invite?.orgName}</strong>
              </Text>
              <br />
              <Text type="secondary" style={{ fontSize: 12 }}>as {invite?.role?.toLowerCase()}</Text>
            </Card>

            <Title level={3} style={{ marginBottom: 4, fontSize: 22 }}>
              Create your account
            </Title>
            <Text type="secondary" style={{ fontSize: 13 }}>
              You'll sign in with <strong>{invite?.email}</strong>
            </Text>

            {acceptError && (
              <Alert
                type="error"
                message={(acceptError as { message?: string }).message ?? 'Failed to accept invitation'}
                showIcon
                style={{ marginTop: 16, borderRadius: 8 }}
              />
            )}

            <Form layout="vertical" size="large" onFinish={handleSubmit(onSubmit)} style={{ marginTop: 24 }}>
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
              <Form.Item label="Password" validateStatus={errors.password ? 'error' : ''} help={errors.password?.message}>
                <Controller name="password" control={control} render={({ field }) => (
                  <Input.Password {...field} prefix={<LockOutlined style={{ color: colorTokens.textTertiary }} />} placeholder="At least 8 characters" />
                )} />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" block loading={isPending} size="large" style={{ height: 44, fontWeight: 600 }}>
                  {isPending ? 'Joining...' : 'Accept invitation'}
                </Button>
              </Form.Item>
            </Form>
          </>
        )}
      </div>
    </AuthLayout>
  )
}
