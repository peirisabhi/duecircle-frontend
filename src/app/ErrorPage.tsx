import { useRouteError, isRouteErrorResponse, useNavigate } from 'react-router-dom'
import { Button, Result } from 'antd'

export default function ErrorPage() {
  const error = useRouteError()
  const navigate = useNavigate()

  let title = 'Something went wrong'
  let subTitle = 'An unexpected error occurred. Please try refreshing the page.'

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      title = 'Page not found'
      subTitle = "The page you're looking for doesn't exist or has been moved."
    } else if (error.status === 403) {
      title = 'Access denied'
      subTitle = "You don't have permission to view this page."
    }
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <Result
        status={isRouteErrorResponse(error) && error.status === 404 ? '404' : 'error'}
        title={title}
        subTitle={subTitle}
        extra={[
          <Button type="primary" key="home" onClick={() => navigate('/app/dashboard')}>
            Go to Dashboard
          </Button>,
          <Button key="back" onClick={() => navigate(-1)}>
            Go Back
          </Button>,
        ]}
      />
    </div>
  )
}
