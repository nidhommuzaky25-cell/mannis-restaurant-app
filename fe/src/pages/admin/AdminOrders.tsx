import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface OrderItem {
  namaProduk: string;
  quantity: number;
  price: number;
  notes: string | null;
}

interface OrderData {
  orderId: number;
  tableNumber: string;
  customerName: string;
  orderDate: string;
  totalAmount: number;
  status: string;
  additionalNotes: string | null;
  itemsBeli: OrderItem[];
}

// ── Shared Sidebar ─────────────────────────────────────
function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    {
      label: 'Dashboard',
      path: '/admin/dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
        </svg>
      ),
    },
    {
      label: 'Orders',
      path: '/admin/orders',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
    },
    {
      label: 'Products',
      path: '/admin/inventory',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
        </svg>
      ),
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    navigate('/admin/login');
  };

  return (
    <aside className="fixed top-0 left-0 h-screen w-52 bg-white border-r border-stone-200 flex flex-col z-20 shadow-sm">
      <div className="px-5 py-5 border-b border-stone-100">
        <h1 className="text-[22px] font-black tracking-tight leading-none" style={{ color: '#B8A98C', fontFamily: 'serif' }}>mannis</h1>
        <p className="text-[10px] font-semibold text-stone-400 tracking-widest uppercase mt-0.5">Command Center</p>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold transition-all ${
                isActive
                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                  : 'text-stone-500 hover:bg-stone-50 hover:text-stone-700'
              }`}
            >
              <span className={isActive ? 'text-amber-600' : 'text-stone-400'}>{item.icon}</span>
              {item.label}
            </button>
          );
        })}
      </nav>
      <div className="px-3 py-4 border-t border-stone-100">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold text-red-500 hover:bg-red-50 transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
          </svg>
          Logout
        </button>
      </div>
    </aside>
  );
}

// ── Main Orders Page ───────────────────────────────────
const PAGE_SIZE = 5;

export default function AdminOrders() {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedReceipt, setSelectedReceipt] = useState<any | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchOrders = async (keyword: string) => {
    try {
      setLoading(true);
      const url = keyword
        ? `http://localhost:5029/api/orders?search=${keyword}`
        : `http://localhost:5029/api/orders`;
      const response = await fetch(url);
      const data = await response.json();
      setOrders(data);
      setCurrentPage(1);
    } catch (error) {
      console.error('Gagal mengambil data orderan:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(() => fetchOrders(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  const handleMarkAsLunas = async (orderId: number) => {
    try {
      const response = await fetch(
        `http://localhost:5029/api/orders/${orderId}/lunas`,
        { method: 'PUT' }
      );
      if (response.ok) fetchOrders(search);
    } catch (error) {
      console.error('Gagal mengubah status:', error);
    }
  };

  const handlePrintReceipt = async (orderId: number) => {
    try {
      const response = await fetch(
        `http://localhost:5029/api/orders/${orderId}/struk`
      );
      const data = await response.json();
      if (response.ok) setSelectedReceipt(data);
      else alert(data.message || 'Gagal membuat struk.');
    } catch (error) {
      console.error('Gagal mengambil data struk:', error);
    }
  };

  // Pagination
  const totalPages = Math.ceil(orders.length / PAGE_SIZE);
  const paginated = orders.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const activeCount = orders.filter((o) => o.status !== 'Lunas').length;

  return (
    <div className="min-h-screen bg-stone-50 font-sans">
      <Sidebar />

      <div className="ml-52 min-h-screen">
        {/* Top bar */}
        <header className="bg-white border-b border-stone-200 px-8 py-4 sticky top-0 z-10">
          <h2 className="text-[20px] font-black text-stone-800 tracking-tight">Order Management</h2>
        </header>

        <main className="px-8 py-6 space-y-5">

          {/* ── Active Orders stat card ── */}
          <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6 flex items-start justify-between">
            <div>
              <p className="text-[13px] font-semibold text-stone-400 mb-1">Active Orders</p>
              <p className="text-[32px] font-black text-stone-800 leading-none">{activeCount}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className="text-[12px] font-bold text-emerald-500 flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                </svg>
                12%
              </span>
              {/* Mini bar decorative */}
              <div className="flex items-end gap-0.5 h-8">
                {[3, 5, 4, 7, 6, 8, 7].map((h, i) => (
                  <div
                    key={i}
                    className="w-1.5 bg-stone-200 rounded-sm"
                    style={{ height: `${h * 4}px` }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* ── Search bar ── */}
          <div className="relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              placeholder="Search orders, customers, or tables..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-stone-200 bg-white text-[14px] text-stone-700 placeholder-stone-400 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition shadow-sm"
            />
          </div>

          {/* ── Live Orders table ── */}
          <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">

            {/* Table header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
              <div className="flex items-center gap-3">
                <h3 className="text-[15px] font-bold text-stone-800">Live Orders</h3>
                <span className="flex items-center gap-1.5 bg-red-50 border border-red-200 text-red-500 text-[11px] font-bold px-2.5 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                  Live Syncing
                </span>
              </div>
              <button className="flex items-center gap-1.5 text-[12px] font-semibold text-stone-500 border border-stone-200 rounded-xl px-3 py-1.5 hover:bg-stone-50 transition">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 4.5h14.25M3 9h9.75M3 13.5h5.25m5.25-.75L17.25 9m0 0L21 12.75M17.25 9v12" />
                </svg>
                Filter
              </button>
            </div>

            {loading ? (
              <div className="p-8 space-y-3">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="h-16 bg-stone-100 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : orders.length === 0 ? (
              <div className="px-6 py-12 text-center text-stone-400 text-sm">
                Tidak ada pesanan yang cocok.
              </div>
            ) : (
              <>
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-stone-50 border-b border-stone-100">
                      {['Order ID', 'Table', 'Customer', 'Items', 'Total Price', 'Status', 'Actions'].map((h) => (
                        <th key={h} className="px-5 py-3 text-[11px] font-bold text-stone-400 uppercase tracking-wider whitespace-nowrap">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {paginated.map((order) => (
                      <tr key={order.orderId} className="hover:bg-stone-50/60 transition">
                        {/* Order ID */}
                        <td className="px-5 py-4">
                          <span className="text-[13px] font-black text-stone-700">
                            #ORD-{String(order.orderId).padStart(3, '0')}
                          </span>
                        </td>

                        {/* Table */}
                        <td className="px-5 py-4 text-[13px] font-semibold text-stone-600">
                          T-{order.tableNumber}
                        </td>

                        {/* Customer */}
                        <td className="px-5 py-4 text-[13px] font-semibold text-stone-700">
                          {order.customerName}
                        </td>

                        {/* Items */}
                        <td className="px-5 py-4 max-w-[200px]">
                          {order.itemsBeli.map((item, idx) => (
                            <div key={idx} className="text-[12px] text-stone-700 leading-snug">
                              {item.quantity}x {item.namaProduk}
                              {item.notes && (
                                <span className="text-stone-400 italic"> - {item.notes}</span>
                              )}
                            </div>
                          ))}
                        </td>

                        {/* Total */}
                        <td className="px-5 py-4">
                          <span className="text-[13px] font-black text-stone-800">
                            Rp {order.totalAmount.toLocaleString('id-ID')}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-5 py-4">
                          {order.status === 'Lunas' ? (
                            <span className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[12px] font-semibold px-3 py-1 rounded-full">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              Lunas
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 bg-red-50 border border-red-200 text-red-600 text-[12px] font-semibold px-3 py-1 rounded-full">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              Belum Bayar
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4">
                          {order.status !== 'Lunas' ? (
                            <button
                              onClick={() => handleMarkAsLunas(order.orderId)}
                              className="bg-amber-500 hover:bg-amber-600 text-white text-[12px] font-bold px-3 py-2 rounded-xl transition shadow-sm whitespace-nowrap"
                            >
                              Mark as Lunas
                            </button>
                          ) : (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handlePrintReceipt(order.orderId)}
                                className="text-[12px] font-semibold text-stone-500 hover:text-stone-700 border border-stone-200 px-3 py-2 rounded-xl hover:bg-stone-50 transition whitespace-nowrap"
                              >
                                Struk
                              </button>
                              <button className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-stone-100 text-stone-400 transition">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M12 6a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm0 7.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3zM12 21a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" />
                                </svg>
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Pagination */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-stone-100">
                  <p className="text-[12px] text-stone-400">
                    Showing {(currentPage - 1) * PAGE_SIZE + 1} to{' '}
                    {Math.min(currentPage * PAGE_SIZE, orders.length)} of {orders.length} orders
                  </p>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="w-8 h-8 flex items-center justify-center rounded-lg border border-stone-200 text-stone-500 hover:bg-stone-50 disabled:opacity-30 disabled:cursor-not-allowed transition"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                      </svg>
                    </button>

                    {Array.from({ length: totalPages }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`w-8 h-8 flex items-center justify-center rounded-lg text-[13px] font-semibold transition ${
                          currentPage === i + 1
                            ? 'bg-stone-800 text-white'
                            : 'border border-stone-200 text-stone-500 hover:bg-stone-50'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}

                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="w-8 h-8 flex items-center justify-center rounded-lg border border-stone-200 text-stone-500 hover:bg-stone-50 disabled:opacity-30 disabled:cursor-not-allowed transition"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                      </svg>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </main>
      </div>

      {/* ── MODAL STRUK ── */}
      {selectedReceipt && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4"
          onClick={() => setSelectedReceipt(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header struk */}
            <div className="bg-stone-800 px-6 py-4 text-center">
              <p className="text-white font-black text-[16px] uppercase tracking-wide">
                {selectedReceipt.namaResto}
              </p>
              <p className="text-stone-400 text-[11px] mt-0.5">{selectedReceipt.alamat}</p>
            </div>

            <div className="px-6 py-5 font-mono text-[13px] space-y-1 text-stone-700">
              <div className="flex justify-between">
                <span className="text-stone-400">Nota</span>
                <span className="font-bold">{selectedReceipt.noNota}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">Meja</span>
                <span>{selectedReceipt.meja}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">Pelanggan</span>
                <span>{selectedReceipt.pelanggan}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">Waktu</span>
                <span className="text-[11px]">{selectedReceipt.waktuCetak}</span>
              </div>
            </div>

            <div className="border-t-2 border-dashed border-stone-200 mx-6" />

            <div className="px-6 py-4 space-y-3">
              {selectedReceipt.itemBelanja?.map((item: any, idx: number) => (
                <div key={idx} className="flex justify-between items-start text-[13px]">
                  <div>
                    <p className="font-semibold text-stone-700">{item.menu}</p>
                    <p className="text-stone-400 text-[11px]">
                      {item.quantity}x @ Rp {item.hargaSatuan?.toLocaleString('id-ID')}
                    </p>
                  </div>
                  <span className="font-bold text-stone-800">
                    Rp {item.subTotal?.toLocaleString('id-ID')}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t-2 border-dashed border-stone-200 mx-6" />

            <div className="px-6 py-4 flex justify-between items-center">
              <span className="font-bold text-stone-800">TOTAL</span>
              <span className="text-[18px] font-black text-amber-600">
                Rp {selectedReceipt.totalBayar?.toLocaleString('id-ID')}
              </span>
            </div>

            <div className="px-6 pb-5">
              <p className="text-center text-emerald-600 font-bold text-[12px] mb-3">─── LUNAS ───</p>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="w-full bg-stone-800 hover:bg-stone-900 text-white font-bold py-3 rounded-xl transition text-[14px]"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
