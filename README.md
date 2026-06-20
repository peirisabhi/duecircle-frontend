# DueCircle Frontend

Multi-tenant invoicing and ERP platform — React 18 + TypeScript frontend.

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy env file and configure
cp .env.example .env

# 3. Start dev server (http://localhost:3000)
npm run dev
```

Point `VITE_API_BASE_URL` in `.env` at your Spring Boot backend (default: `http://localhost:8080`).

## Stack

| Concern | Library |
|---|---|
| Framework | React 18 + TypeScript (strict) |
| Build | Vite 5 |
| Server state | TanStack Query v5 |
| Tables | TanStack Table v8 + Virtual |
| Global state | Zustand v4 |
| Routing | React Router v6 |
| HTTP | Axios with JWT interceptor |
| Forms | React Hook Form + Zod |
| UI | Ant Design v5 (custom theme) |
| Charts | Recharts |
| i18n | i18next + react-i18next |
| Dates | date-fns + date-fns-tz |
| Tests | Vitest + React Testing Library |

## Folder Structure

```
src/
  app/
    router/          # Route definitions, ProtectedRoute
    App.tsx          # Root: QueryClient + ConfigProvider + Router
    ErrorPage.tsx    # Route error boundary
  features/
    auth/            # Login, Forgot/Reset, Signup, AcceptInvite
    dashboard/       # KPI cards, sales chart, recent invoices
    customers/
    products/        # Products, Units, Warehouses
    quotations/
    invoices/
    payments/        # Payment recording + FIFO allocation
    credit-debit-notes/
    stock/
    cash-bank/
    reports/
    settings/
    notifications/
  shared/
    api/             # Axios instance + typed helpers
    store/           # Zustand: auth, org, ui
    components/
      layout/        # AppLayout, Sidebar, TopBar
      ui/            # Reusable primitives
      forms/         # Shared form components
    hooks/           # Custom React hooks
    utils/           # Formatting, invoice-calc (unit-tested)
    types/           # Shared TypeScript types
    constants/       # Currencies, timezones, enums
    i18n/            # i18next init
  styles/
    tokens.ts        # Design token values
    theme.ts         # antd ConfigProvider theme
    global.css       # CSS custom properties + global styles
  main.tsx           # Entry point
  test-setup.ts      # Vitest setup
public/
  locales/en/        # i18n translation files (common, auth, ...)
  favicon.svg
```

## Key Patterns

### API calls
Never call axios directly from components. Use typed service functions:

```ts
// features/invoices/api.ts
export const invoicesApi = {
  list: (params: InvoiceListParams) => get<PaginatedResponse<Invoice>>('/invoices', { params }),
  create: (data: CreateInvoiceRequest) => post<Invoice>('/invoices', data),
}

// features/invoices/hooks/useInvoices.ts
export function useInvoices(params: InvoiceListParams) {
  return useQuery({ queryKey: ['invoices', params], queryFn: () => invoicesApi.list(params) })
}
```

### Auth flow
- Access token lives **in memory only** (not localStorage) via `tokenStore` in `src/shared/api/client.ts`
- Refresh token stored in localStorage under key `dc_refresh_token`
- 401 responses trigger automatic token refresh before retrying the original request
- Active org id stored in localStorage under `dc_active_org` and sent as `X-Org-Id` header on every request
- On app boot, `App.tsx` attempts session restoration via `/auth/refresh`

### Multi-tenancy
- Active organization stored in `useOrgStore` (Zustand, persisted)
- Every API call is scoped by `X-Org-Id` header via axios request interceptor
- Org switcher in top bar updates the store, localStorage, and triggers relevant query invalidations

### Protected routes
```tsx
// All /app/* routes require auth — see src/app/router/ProtectedRoute.tsx
// Redirects to /auth/login with `state.from` for post-login redirect
```

### Dark mode
- Toggle in top bar user menu
- Persisted to localStorage via Zustand persist middleware
- Applied via `data-theme="dark"` on `<html>` + antd `darkAlgorithm`

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `VITE_API_BASE_URL` | `http://localhost:8080` | Backend API base URL |
| `VITE_APP_NAME` | `DueCircle` | App display name |
| `VITE_ENABLE_DEVTOOLS` | `true` | Show TanStack Query devtools |

## Scripts

```bash
npm run dev         # Dev server on :3000
npm run build       # TypeScript check + Vite build
npm run preview     # Preview production build
npm run lint        # ESLint
npm run lint:fix    # ESLint with auto-fix
npm run format      # Prettier
npm run test        # Vitest (watch mode)
npm run coverage    # Vitest coverage report
npm run typecheck   # tsc --noEmit only
```

## Build Order / Implementation Priority

The scaffold is complete with stub pages for all routes. Implementation priority:

1. ✅ App shell, routing, theme, design tokens
2. ✅ Auth flow (Login, Forgot/Reset, Signup, Accept Invite)
3. ✅ Layout (Sidebar, TopBar, Dashboard KPIs + Chart)
4. 🔲 Customers + Products / Units / Warehouses
5. 🔲 Quotations + Invoices (dynamic line items, live totals)
6. 🔲 Payments + allocation UI
7. 🔲 Credit/Debit Notes, Stock, Cash & Bank
8. 🔲 Reports
9. 🔲 Settings (org, PDF templates, users/roles)
10. 🔲 Notifications, polish, accessibility, responsive QA

## Adding a new feature module

1. Create `src/features/<name>/` with `pages/`, `components/`, `hooks/`, `api.ts`, `types.ts`
2. Add typed service functions to `api.ts`
3. Create TanStack Query hooks in `hooks/`
4. Register routes in `src/app/router/index.tsx`
5. Add nav item in `src/shared/components/layout/Sidebar.tsx`

## Testing

Unit tests live alongside source in `__tests__/` subdirectories.

```bash
npm run test              # watch mode
npm run coverage          # coverage report
```

Core calculation logic (invoice totals, FIFO payment allocation) is unit-tested in `src/shared/utils/__tests__/invoice-calc.test.ts`.
