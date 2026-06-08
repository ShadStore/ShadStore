import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'wouter'
import App from './App.tsx'
import './index.css'

const queryClient = new QueryClient()

const isTelegram = () => {
  if (typeof window === 'undefined') return false
  return Boolean((window as any).Telegram?.WebApp)
}

async function bootstrap() {
  const mainEl = document.getElementById('root')
  if (!mainEl) return

  const root = createRoot(mainEl)
  
  if (isTelegram()) {
    root.render(
      <StrictMode>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </QueryClientProvider>
      </StrictMode>
    )
    return
  }

  const apiBase = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')
  const isMaintenanceRes = await fetch(`${apiBase}/website/maintenance-page`)
  const isMaintenance = isMaintenanceRes.ok && (await isMaintenanceRes.json()).maintenance

  if (isMaintenance) {
    root.render(
      <StrictMode>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <MaintenancePage />
          </BrowserRouter>
        </QueryClientProvider>
      </StrictMode>
    )
    return
  }

  const sessionRes = await fetch(`${apiBase}/website/me`, { credentials: 'include' })
  if (!sessionRes.ok) {
    root.render(
      <StrictMode>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <AuthPage />
          </BrowserRouter>
        </QueryClientProvider>
      </StrictMode>
    )
    return
  }

  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </QueryClientProvider>
    </StrictMode>
  )
}

bootstrap()