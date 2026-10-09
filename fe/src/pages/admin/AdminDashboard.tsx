import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { API_BASE_URL } from '../../config/api';

interface RecentOrder {
  orderId: number;
  tableNumber: string;
  customerName: string;
  totalAmount: number;
  status: string;
  orderDate: string;
}

interface ChartData {
  date: string;
  revenue: number;
}

interface ChartPoint {
  label: string;
  revenue: number;
}

interface AvailableMonth {
  year: number;
  month: number;
  label: string;
}

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  productSold: number;
  recentOrders: RecentOrder[];
  revenueChart: ChartData[];
}

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const navItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg> },
    { label: 'Orders', path: '/admin/orders', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg> },
    { label: 'Inventory', path: '/admin/inventory', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg> },
  ];
  const handleLogout = () => { localStorage.removeItem('admin_token'); localStorage.removeItem('admin_user'); navigate('/admin/login'); };
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
            <button key={item.path} onClick={() => navigate(item.path)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold transition-all ${isActive ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'text-stone-500 hover:bg-stone-50 hover:text-stone-700'}`}>
              <span className={isActive ? 'text-amber-600' : 'text-stone-400'}>{item.icon}</span>
              {item.label}
            </button>
          );
        })}
      </nav>
      <div className="px-3 py-4 border-t border-stone-100">
        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold text-red-500 hover:bg-red-50 transition">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" /></svg>
          Logout
        </button>
      </div>
    </aside>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [availableMonths, setAvailableMonths] = useState<AvailableMonth[]>([]);
  const [chartPoints, setChartPoints] = useState<ChartPoint[]>([]);
  const [chartLoading, setChartLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [chartMode, setChartMode] = useState<'default' | 'monthly' | 'weekly'>('default');
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<AvailableMonth | null>(null);
  const [dropdownLabel, setDropdownLabel] = useState('Last 7 Days');
  const navigate = useNavigate();

  const BASE = API_BASE_URL;

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('admin_token');
        const res = await fetch(`${BASE}/api/dashboard/stats`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setStats(data);
          if (data.revenueChart?.length) {
            setChartPoints(data.revenueChart.map((d: ChartData) => ({
              label: new Date(d.date).toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric' }),
              revenue: d.revenue,
            })));
          }
        }
      } catch (e) { console.error(e); } finally { setLoading(false); }
    };
    const fetchMonths = async () => {
      try {
        const token = localStorage.getItem('admin_token');
        const res = await fetch(`${BASE}/api/dashboard/available-months`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (res.ok) setAvailableMonths(await res.json());
      } catch { /* ignore */ }
    };
    fetchStats();
    fetchMonths();
  }, []);

  const fetchChart = async (mode: 'monthly' | 'weekly', year: number, month?: number, label?: string) => {
    setChartLoading(true);
    setShowDropdown(false);
    try {
      const token = localStorage.getItem('admin_token');
      const url = mode === 'monthly'
        ? `${BASE}/api/dashboard/chart?year=${year}&view=monthly`
        : `${BASE}/api/dashboard/chart?year=${year}&month=${month}&view=weekly`;
      const res = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        setChartPoints(await res.json());
        setChartMode(mode);
        setDropdownLabel(label ?? `Tahun ${year}`);
      }
    } catch { /* ignore */ } finally { setChartLoading(false); }
  };

  const handleSelectDefault = () => {
    if (!stats) return;
    setChartPoints(stats.revenueChart?.map((d: ChartData) => ({
      label: new Date(d.date).toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric' }),
      revenue: d.revenue,
    })) ?? []);
    setChartMode('default');
    setDropdownLabel('Last 7 Days');
    setShowDropdown(false);
  };

  const maxRevenue = chartPoints.length ? Math.max(...chartPoints.map(d => d.revenue), 1) : 1;
  const availableYears = [...new Set(availableMonths.map(m => m.year))].sort((a, b) => b - a);

  const renderChart = () => {
    const CHART_HEIGHT = 220;
    const Y_STEPS = 5;
    const rawMax = maxRevenue || 1;
    const magnitude = Math.pow(10, Math.floor(Math.log10(rawMax)));
    const niceMax = Math.ceil(rawMax / magnitude) * magnitude;
    const stepValue = niceMax / Y_STEPS;
    return (
      <div className="flex gap-3">
        <div className="flex flex-col justify-between items-end shrink-0 pb-7" style={{ height: CHART_HEIGHT }}>
          {Array.from({ length: Y_STEPS + 1 }).map((_, i) => {
            const val = niceMax - i * stepValue;
            return (
              <span key={i} className="text-[10px] text-stone-400 font-medium whitespace-nowrap">
                {val >= 1_000_000 ? `${(val / 1_000_000).toFixed(val % 1_000_000 === 0 ? 0 : 1)}jt`
                  : val >= 1_000 ? `${(val / 1_000).toFixed(0)}rb`
                  : val.toLocaleString('id-ID')}
              </span>
            );
          })}
        </div>
        <div className="flex-1 flex flex-col">
          <div className="relative flex items-end gap-2 border-l border-b border-stone-200 bg-gradient-to-b from-amber-50/40 to-white" style={{ height: CHART_HEIGHT - 28 }}>
            {Array.from({ length: Y_STEPS }).map((_, i) => (
              <div key={i} className="absolute left-0 right-0 border-t border-dashed border-stone-200" style={{ bottom: `${((i + 1) / Y_STEPS) * 100}%` }} />
            ))}
            {chartPoints.map((point, idx) => {
              const heightPct = niceMax > 0 ? (point.revenue / niceMax) * 100 : 0;
              return (
                <div key={idx} className="relative flex-1 flex flex-col justify-end items-center h-full group">
                  {point.revenue > 0 && (
                    <div className="absolute bottom-full mb-2 hidden group-hover:flex bg-stone-800 text-white text-[11px] font-semibold px-2 py-1 rounded-lg whitespace-nowrap z-10">
                      Rp {point.revenue.toLocaleString('id-ID')}
                    </div>
                  )}
                  <div className="w-full max-w-[40px] rounded-t-md bg-amber-400 hover:bg-amber-500 transition-all duration-300" style={{ height: `${Math.max(heightPct, point.revenue > 0 ? 2 : 0)}%` }} />
                </div>
              );
            })}
          </div>
          <div className="flex gap-2 mt-1.5">
            {chartPoints.map((point, idx) => (
              <div key={idx} className="flex-1 flex justify-center">
                <span className="text-[10px] text-stone-400 font-medium text-center leading-tight">{point.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-stone-50 font-sans">
      <Sidebar />
      <div className="ml-52 min-h-screen">
        <header className="bg-white border-b border-stone-200 px-8 py-4 sticky top-0 z-10">
          <h2 className="text-[20px] font-black text-stone-800 tracking-tight">Dashboard Overview</h2>
        </header>
        <main className="px-8 py-6 space-y-6">

          {loading && (
            <div className="grid grid-cols-3 gap-5">
              {[1,2,3].map(n => <div key={n} className="bg-white rounded-2xl p-6 animate-pulse h-32 border border-stone-100" />)}
            </div>
          )}

          {!loading && !stats && (
            <div className="bg-white rounded-2xl p-8 text-center text-stone-400 border border-stone-100">
              <p>Gagal memuat data dari server.</p>
            </div>
          )}

          {!loading && stats && (
            <>
              {/* STAT CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="bg-white rounded-2xl p-5 border border-stone-100 shadow-sm">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75" /></svg>
                    </div>
                    <span className="text-[12px] font-bold text-emerald-500">↗ 12.5%</span>
                  </div>
                  <p className="text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-1">Total Revenue</p>
                  <p className="text-[22px] font-black text-stone-800 leading-tight">Rp {stats.totalRevenue.toLocaleString('id-ID')}</p>
                </div>
                <div className="bg-white rounded-2xl p-5 border border-stone-100 shadow-sm">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" /></svg>
                    </div>
                    <span className="text-[12px] font-bold text-emerald-500">↗ 8.2%</span>
                  </div>
                  <p className="text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-1">Total Orders</p>
                  <p className="text-[28px] font-black text-stone-800 leading-tight">{stats.totalOrders}</p>
                </div>
                <div className="bg-white rounded-2xl p-5 border border-stone-100 shadow-sm">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-teal-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" /></svg>
                    </div>
                    <span className="text-[12px] font-bold text-red-400">↘ 2.4%</span>
                  </div>
                  <p className="text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-1">Products Sold</p>
                  <p className="text-[28px] font-black text-stone-800 leading-tight">{stats.productSold}</p>
                </div>
              </div>

              {/* REVENUE CHART */}
              <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-[16px] font-bold text-stone-800">Grafik Pendapatan</h3>
                    <p className="text-[12px] text-stone-400 mt-0.5">
                      {chartMode === 'default' ? 'Visualisasi tren pendapatan 7 hari terakhir'
                        : chartMode === 'monthly' ? `Pendapatan per bulan — Tahun ${selectedYear}`
                        : `Pendapatan per minggu — ${selectedMonth?.label}`}
                    </p>
                  </div>
                  <div className="relative">
                    <button onClick={() => setShowDropdown(v => !v)} className="text-[12px] font-semibold text-stone-500 border border-stone-200 rounded-xl px-3 py-1.5 bg-stone-50 hover:bg-stone-100 transition flex items-center gap-1.5">
                      {dropdownLabel}
                      <svg className={`w-3.5 h-3.5 transition-transform ${showDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
                    </button>
                    {showDropdown && (
                      <div className="absolute right-0 top-full mt-1.5 w-64 bg-white border border-stone-200 rounded-2xl shadow-xl z-30 overflow-hidden">
                        <button onClick={handleSelectDefault} className="w-full text-left px-4 py-2.5 text-[13px] font-semibold text-stone-700 hover:bg-amber-50 hover:text-amber-700 transition border-b border-stone-100">
                          📅 Last 7 Days
                        </button>
                        <div className="px-4 py-2 border-b border-stone-100">
                          <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1.5">Per Bulan (pilih tahun)</p>
                          <div className="flex flex-wrap gap-1.5">
                            {availableYears.length === 0
                              ? <span className="text-[11px] text-stone-400">Belum ada data</span>
                              : availableYears.map(y => (
                                <button key={y} onClick={() => { setSelectedYear(y); fetchChart('monthly', y, undefined, `Tahun ${y}`); }} className="px-3 py-1 rounded-lg text-[12px] font-semibold bg-stone-100 hover:bg-amber-400 hover:text-white transition">
                                  {y}
                                </button>
                              ))}
                          </div>
                        </div>
                        <div className="px-4 py-2 max-h-52 overflow-y-auto">
                          <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1.5">Per Minggu (pilih bulan)</p>
                          {availableMonths.length === 0
                            ? <span className="text-[11px] text-stone-400">Belum ada data</span>
                            : availableMonths.map(m => (
                              <button key={`${m.year}-${m.month}`} onClick={() => { setSelectedMonth(m); fetchChart('weekly', m.year, m.month, m.label); }} className="w-full text-left px-2 py-1.5 text-[12px] font-semibold text-stone-600 hover:bg-amber-50 hover:text-amber-700 rounded-lg transition">
                                {m.label}
                              </button>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                {chartLoading ? (
                  <div className="h-56 flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : chartPoints.length === 0 ? (
                  <div className="h-52 flex items-center justify-center text-stone-400 text-sm">Belum ada data transaksi.</div>
                ) : renderChart()}
              </div>

              {/* RECENT ORDERS */}
              <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
                  <div>
                    <h3 className="text-[16px] font-bold text-stone-800">Recent Orders</h3>
                    <p className="text-[12px] text-stone-400 mt-0.5">Update terakhir dari kasir pusat</p>
                  </div>
                  <button onClick={() => navigate('/admin/orders')} className="text-[13px] font-semibold text-amber-600 hover:text-amber-700 transition flex items-center gap-1">
                    Lihat Semua
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                  </button>
                </div>
                {stats.recentOrders.length === 0 ? (
                  <div className="px-6 py-10 text-center text-stone-400 text-sm">Belum ada pesanan masuk.</div>
                ) : (
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-stone-50 border-b border-stone-100">
                        {['Customer Name','Order ID','Total Amount','Status'].map(h => (
                          <th key={h} className="px-6 py-3 text-[11px] font-bold text-stone-400 uppercase tracking-wider">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {stats.recentOrders.map(order => (
                        <tr key={order.orderId} className="hover:bg-stone-50/60 transition">
                          <td className="px-6 py-4 text-[14px] font-semibold text-stone-700">{order.customerName}</td>
                          <td className="px-6 py-4 text-[13px] text-stone-500">#ORD-{order.orderId}</td>
                          <td className="px-6 py-4 text-[14px] font-bold text-stone-800">Rp {order.totalAmount.toLocaleString('id-ID')}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-[12px] font-semibold border ${order.status === 'Lunas' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-600 border-red-200'}`}>
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
