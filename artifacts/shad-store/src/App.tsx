import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Router, Route } from 'wouter'
import { useState } from 'react'
import CategoriesPage from './pages/categories'
import HomePage from './pages/home'
import ProductDetailPage from './pages/product-detail'
import OrdersPage from './pages/orders'
import OrderDetailPage from './pages/order-detail'
import DepositsPage from './pages/deposits'
import DepositPage from './pages/deposit'
import DepositMethodPage from './pages/deposit-method'
import ProfilePage from './pages/profile'
import ShamcashInvoiceVerify from './pages/shamcash-invoice-verify'
import NotFoundPage from './pages/not-found'
import SupportPage from './pages/support'
import MaintenancePage from './pages/Maintenance'
import AuthPage from './pages/Auth'

const useQueryClient = () => {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: { queries: { retry: false, refetchOnWindowFocus: false } }
  }))
  return queryClient
}

function AppContent() {
  return (
    <Router>
      <Route path="/" component={HomePage as any} />
      <Route path="/categories" component={CategoriesPage as any} />
      <Route path="/product/:id" component={ProductDetailPage as any} />
      <Route path="/orders" component={OrdersPage as any} />
      <Route path="/order/:id" component={OrderDetailPage as any} />
      <Route path="/deposits" component={DepositsPage as any} />
      <Route path="/deposit" component={DepositPage as any} />
      <Route path="/deposit-method" component={DepositMethodPage as any} />
      <Route path="/profile" component={ProfilePage as any} />
      <Route path="/shamcash-invoice-verify" component={ShamcashInvoiceVerify as any} />
      <Route path="/support" component={SupportPage as any} />
      <Route path="/auth" component={AuthPage as any} />
      <Route path="/maintenance" component={MaintenancePage as any} />
      <Route component={NotFoundPage as any} />
    </Router>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={useQueryClient()}>
      <AppContent />
    </QueryClientProvider>
  )
}