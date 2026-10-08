import { BrowserRouter as Router, Routes, Route, useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';
import Menu from './pages/Menu';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import ProtectedRoute from './components/ProtectedRoute';

// Import Halaman Admin
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminOrders from './pages/admin/AdminOrders';
import AdminInventory from './pages/admin/AdminInventory';

function MainLayout() {
  const [searchParams] = useSearchParams();
  const tableNumber = searchParams.get('table');

  useEffect(() => {
    if (tableNumber) {
      localStorage.setItem('table_number', tableNumber);
      console.log("Meja berhasil disimpan:", tableNumber);
    }
  }, [tableNumber]);

  return (
    // REVISI: Mengubah max-w-sm menjadi w-full agar layout utama bisa responsif & fleksibel mengikuti masing-masing halaman
    <div className="w-full min-h-svh font-sans">
      <Routes>
        {/* Rute Sisi Customer */}
        <Route path="/" element={<Menu />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-success/:id" element={<OrderSuccess />} />

        {/* Rute Sisi Admin */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/orders" element={
          <ProtectedRoute>
            <AdminOrders />
          </ProtectedRoute>
        } />
        <Route path="/admin/inventory" element={
          <ProtectedRoute>
            <AdminInventory />
          </ProtectedRoute>
        } />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <MainLayout />
    </Router>
  );
}

export default App;