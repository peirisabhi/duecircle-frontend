import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { Spin } from 'antd'
import { ProtectedRoute } from './ProtectedRoute'

// ─── Lazy-loaded pages ────────────────────────────────────────────────
// Auth
const LoginPage = lazy(() => import('@features/auth/pages/LoginPage'))
const ForgotPasswordPage = lazy(() => import('@features/auth/pages/ForgotPasswordPage'))
const ResetPasswordPage = lazy(() => import('@features/auth/pages/ResetPasswordPage'))
const SignupPage = lazy(() => import('@features/auth/pages/SignupPage'))
const AcceptInvitePage = lazy(() => import('@features/auth/pages/AcceptInvitePage'))

// Layout shell
const AppLayout = lazy(() => import('@shared/components/layout/AppLayout'))

// Dashboard
const DashboardPage = lazy(() => import('@features/dashboard/pages/DashboardPage'))

// Customers
const CustomersListPage = lazy(() => import('@features/customers/pages/CustomersListPage'))
const CustomerDetailPage = lazy(() => import('@features/customers/pages/CustomerDetailPage'))
const CustomerFormPage = lazy(() => import('@features/customers/pages/CustomerFormPage'))

// Products
const ProductsListPage = lazy(() => import('@features/products/pages/ProductsListPage'))
const ProductFormPage = lazy(() => import('@features/products/pages/ProductFormPage'))
const UnitsPage = lazy(() => import('@features/products/pages/UnitsPage'))
const WarehousesPage = lazy(() => import('@features/products/pages/WarehousesPage'))

// Quotations
const QuotationsListPage = lazy(() => import('@features/quotations/pages/QuotationsListPage'))
const QuotationFormPage = lazy(() => import('@features/quotations/pages/QuotationFormPage'))
const QuotationDetailPage = lazy(() => import('@features/quotations/pages/QuotationDetailPage'))

// Invoices
const InvoicesListPage = lazy(() => import('@features/invoices/pages/InvoicesListPage'))
const InvoiceFormPage = lazy(() => import('@features/invoices/pages/InvoiceFormPage'))
const InvoiceDetailPage = lazy(() => import('@features/invoices/pages/InvoiceDetailPage'))

// Payments
const PaymentsListPage = lazy(() => import('@features/payments/pages/PaymentsListPage'))
const RecordPaymentPage = lazy(() => import('@features/payments/pages/RecordPaymentPage'))

// Credit/Debit Notes
const CreditDebitNotesListPage = lazy(() => import('@features/credit-debit-notes/pages/CreditDebitNotesListPage'))
const CreateCreditNotePage = lazy(() => import('@features/credit-debit-notes/pages/CreateCreditNotePage'))

// Stock
const StockDashboardPage = lazy(() => import('@features/stock/pages/StockDashboardPage'))
const StockMovementsPage = lazy(() => import('@features/stock/pages/StockMovementsPage'))
const StockInPage = lazy(() => import('@features/stock/pages/StockInPage'))
const StockOutPage = lazy(() => import('@features/stock/pages/StockOutPage'))

// Cash & Bank
const CashBankPage = lazy(() => import('@features/cash-bank/pages/CashBankPage'))

// Reports
const ReportsDashboardPage = lazy(() => import('@features/reports/pages/ReportsDashboardPage'))
const SalesReportPage = lazy(() => import('@features/reports/pages/SalesReportPage'))
const OutstandingDuesPage = lazy(() => import('@features/reports/pages/OutstandingDuesPage'))
const StockValuationPage = lazy(() => import('@features/reports/pages/StockValuationPage'))
const TaxReportPage = lazy(() => import('@features/reports/pages/TaxReportPage'))

// Settings
const SettingsPage = lazy(() => import('@features/settings/pages/SettingsPage'))

// Notifications
const NotificationsPage = lazy(() => import('@features/notifications/pages/NotificationsPage'))

// ─── Loading fallback ─────────────────────────────────────────────────
function PageLoader() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <Spin size="large" />
    </div>
  )
}

function Lazy({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>
}

// ─── Error boundary page ──────────────────────────────────────────────
const ErrorPage = lazy(() => import('@app/ErrorPage'))

// ─── Router ───────────────────────────────────────────────────────────
export const router = createBrowserRouter([
  // Auth routes (public)
  {
    path: '/auth',
    children: [
      { index: true, element: <Navigate to="/auth/login" replace /> },
      { path: 'login',           element: <Lazy><LoginPage /></Lazy> },
      { path: 'forgot-password', element: <Lazy><ForgotPasswordPage /></Lazy> },
      { path: 'reset-password',  element: <Lazy><ResetPasswordPage /></Lazy> },
      { path: 'signup',          element: <Lazy><SignupPage /></Lazy> },
      { path: 'accept-invite',   element: <Lazy><AcceptInvitePage /></Lazy> },
    ],
  },

  // App routes (protected)
  {
    path: '/app',
    element: <ProtectedRoute />,
    errorElement: <Lazy><ErrorPage /></Lazy>,
    children: [
      {
        element: <Lazy><AppLayout /></Lazy>,
        children: [
          { index: true, element: <Navigate to="/app/dashboard" replace /> },
          { path: 'dashboard', element: <Lazy><DashboardPage /></Lazy> },

          // Customers
          { path: 'customers',                element: <Lazy><CustomersListPage /></Lazy> },
          { path: 'customers/new',            element: <Lazy><CustomerFormPage /></Lazy> },
          { path: 'customers/:id',            element: <Lazy><CustomerDetailPage /></Lazy> },
          { path: 'customers/:id/edit',       element: <Lazy><CustomerFormPage /></Lazy> },

          // Products
          { path: 'products',                 element: <Lazy><ProductsListPage /></Lazy> },
          { path: 'products/new',             element: <Lazy><ProductFormPage /></Lazy> },
          { path: 'products/:id/edit',        element: <Lazy><ProductFormPage /></Lazy> },
          { path: 'products/units',           element: <Lazy><UnitsPage /></Lazy> },
          { path: 'products/warehouses',      element: <Lazy><WarehousesPage /></Lazy> },

          // Quotations
          { path: 'quotations',               element: <Lazy><QuotationsListPage /></Lazy> },
          { path: 'quotations/new',           element: <Lazy><QuotationFormPage /></Lazy> },
          { path: 'quotations/:id',           element: <Lazy><QuotationDetailPage /></Lazy> },
          { path: 'quotations/:id/edit',      element: <Lazy><QuotationFormPage /></Lazy> },

          // Invoices
          { path: 'invoices',                 element: <Lazy><InvoicesListPage /></Lazy> },
          { path: 'invoices/new',             element: <Lazy><InvoiceFormPage /></Lazy> },
          { path: 'invoices/:id',             element: <Lazy><InvoiceDetailPage /></Lazy> },
          { path: 'invoices/:id/edit',        element: <Lazy><InvoiceFormPage /></Lazy> },

          // Payments
          { path: 'payments',                 element: <Lazy><PaymentsListPage /></Lazy> },
          { path: 'payments/new',             element: <Lazy><RecordPaymentPage /></Lazy> },

          // Credit/Debit Notes
          { path: 'credit-debit-notes',       element: <Lazy><CreditDebitNotesListPage /></Lazy> },
          { path: 'credit-debit-notes/new',   element: <Lazy><CreateCreditNotePage /></Lazy> },

          // Stock
          { path: 'stock',                    element: <Lazy><StockDashboardPage /></Lazy> },
          { path: 'stock/movements',          element: <Lazy><StockMovementsPage /></Lazy> },
          { path: 'stock/in',                 element: <Lazy><StockInPage /></Lazy> },
          { path: 'stock/out',                element: <Lazy><StockOutPage /></Lazy> },

          // Cash & Bank
          { path: 'cash-bank',                element: <Lazy><CashBankPage /></Lazy> },

          // Reports
          { path: 'reports',                  element: <Lazy><ReportsDashboardPage /></Lazy> },
          { path: 'reports/sales',            element: <Lazy><SalesReportPage /></Lazy> },
          { path: 'reports/outstanding',      element: <Lazy><OutstandingDuesPage /></Lazy> },
          { path: 'reports/stock-valuation',  element: <Lazy><StockValuationPage /></Lazy> },
          { path: 'reports/tax',              element: <Lazy><TaxReportPage /></Lazy> },

          // Settings
          { path: 'settings/*',              element: <Lazy><SettingsPage /></Lazy> },

          // Notifications
          { path: 'notifications',            element: <Lazy><NotificationsPage /></Lazy> },
        ],
      },
    ],
  },

  // Default redirect
  { index: true, element: <Navigate to="/app/dashboard" replace /> },
  { path: '*',   element: <Navigate to="/app/dashboard" replace /> },
])
