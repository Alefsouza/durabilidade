import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AppProvider } from '@/store/use-app-store'
import Layout from './components/Layout'
import Index from './pages/Index'
import NotFound from './pages/NotFound'
import InventoryPage from './pages/inventory/InventoryPage'
import ActiveTestsPage from './pages/tests/ActiveTestsPage'
import HistoryTestsPage from './pages/tests/HistoryTestsPage'
import SettingsPage from './pages/SettingsPage'

const App = () => (
  <BrowserRouter future={{ v7_startTransition: false, v7_relativeSplatPath: false }}>
    <TooltipProvider>
      <AppProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Index />} />
            <Route path="/estoque" element={<InventoryPage />} />
            <Route path="/testes/ativos" element={<ActiveTestsPage />} />
            <Route path="/testes/historico" element={<HistoryTestsPage />} />
            <Route path="/configuracoes" element={<SettingsPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AppProvider>
    </TooltipProvider>
  </BrowserRouter>
)

export default App
