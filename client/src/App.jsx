import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  useLocation,
  Navigate,
} from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'

import HomePage from './pages/store/HomePage'
import ShopPage from './pages/store/ShopPage'
import ProductPage from './pages/store/ProductPage'
import CheckoutPage from './pages/store/CheckoutPage'
import OrderSuccessPage from './pages/store/OrderSuccessPage'
import MyOrdersPage from './pages/store/MyOrdersPage'
import DashboardPage from './pages/admin/DashboardPage'
import ProductsPage from './pages/admin/ProductsPage'
import OrdersPage from './pages/admin/OrdersPage'
import CustomersPage from './pages/admin/CustomersPage'
import SettingsPage from './pages/admin/SettingsPage'

import StoreNav from './components/layout/StoreNav'
import AdminNav from './components/layout/AdminNav'
import AdminSidebar from './components/layout/AdminSidebar'
import Footer from './components/layout/Footer'
import CartSlide from './components/layout/CartSlide'

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false, retry: 1 } },
})

function StoreLayout() {
  return (
    <>
      <StoreNav />
      <CartSlide />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}

function AdminLayout() {
  const { user, isAdmin } = useAuthStore()
  if (!user) return <Navigate to='/' replace />
  if (!isAdmin()) return <Navigate to='/' replace />
  return (
    <>
      <AdminNav />
      <AdminSidebar />
      <div className='md:ml-60 pt-16 min-h-screen'>
        <Outlet />
      </div>
    </>
  )
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<StoreLayout />}>
            <Route path='/' element={<HomePage />} />
            <Route path='/shop' element={<ShopPage />} />
            <Route path='/product/:id' element={<ProductPage />} />
            <Route path='/checkout' element={<CheckoutPage />} />
            <Route path='/order-success' element={<OrderSuccessPage />} />
            <Route path='/orders' element={<MyOrdersPage />} />
          </Route>
          <Route path='/admin' element={<AdminLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path='products' element={<ProductsPage />} />
            <Route path='orders' element={<OrdersPage />} />
            <Route path='customers' element={<CustomersPage />} />
            <Route path='settings' element={<SettingsPage />} />
          </Route>
          <Route path='*' element={<Navigate to='/' replace />} />
        </Routes>
        <Toaster
          position='top-right'
          toastOptions={{
            duration: 3500,
            style: {
              background: '#1E1E1E',
              color: '#F5F5F0',
              border: '1px solid #2A2A2A',
              borderRadius: '12px',
              fontSize: '14px',
              padding: '14px 20px',
            },
            success: {
              iconTheme: { primary: '#34D399', secondary: '#1E1E1E' },
            },
            error: { iconTheme: { primary: '#EF4444', secondary: '#1E1E1E' } },
          }}
        />
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
