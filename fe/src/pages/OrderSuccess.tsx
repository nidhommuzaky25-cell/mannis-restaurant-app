import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getApiUrl } from '../config/api';

interface OrderDetailResponse {
  orderId: number;
  customerName: string;
  tableNumber: string;
  totalAmount: number;
  status: string;
  itemsBeli: Array<{
    namaProduk: string;
    quantity: number;
    price: number;
    notes: string | null;
  }>;
}

export default function OrderSuccess() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<OrderDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const response = await fetch(
          getApiUrl(`/api/orders?search=${id}`)
        );
        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) setOrder(data[0]);
        }
      } catch (error) {
        console.error('Gagal memuat status order:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrderData();
  }, [id]);

  // ── Loading ──
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-4 animate-pulse">
          <div className="w-24 h-24 rounded-full" style={{ backgroundColor: '#D4C9BE' }} />
          <div className="h-8 bg-stone-200 rounded-full w-48" />
          <div className="h-4 bg-stone-200 rounded-full w-64" />
          <div className="w-full max-w-md h-80 bg-white rounded-3xl shadow-sm mt-4" />
        </div>
      </div>
    );
  }

  // ── Not found ──
  if (!order) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center font-sans text-[#2e2520] gap-3">
        <svg className="w-14 h-14 text-stone-300" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        </svg>
        <p className="text-stone-400 text-sm">Data pesanan tidak ditemukan.</p>
        <button onClick={() => navigate('/menu')} className="font-semibold text-sm hover:opacity-80 transition" style={{ color: '#B8A98C' }}>
          ← Kembali ke Menu
        </button>
      </div>
    );
  }

  const tax = order.totalAmount * 0.1;

  return (
    <div className="min-h-screen bg-white font-sans text-[#2e2520]">

      {/* ── Decorative blobs ── */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-0">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full blur-3xl" style={{ backgroundColor: 'rgba(184, 169, 140, 0.1)' }} />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full blur-3xl" style={{ backgroundColor: 'rgba(184, 169, 140, 0.15)' }} />
      </div>

      <div className="relative z-10 px-4 md:px-8 py-10 md:py-14">
        <div className="max-w-2xl mx-auto flex flex-col items-center gap-8">

          {/* ══════════════════════════════════════
              HERO SECTION
          ══════════════════════════════════════ */}
          <div className="flex flex-col items-center text-center gap-3">
            {/* Animated check circle */}
            <div className="relative">
              <div className="w-24 h-24 rounded-full flex items-center justify-center shadow-xl" style={{ backgroundColor: '#B8A98C', boxShadow: '0 20px 25px -5px rgba(184, 169, 140, 0.3)' }}>
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              {/* Pulse ring */}
              <div className="absolute inset-0 rounded-full scale-125 animate-ping" style={{ backgroundColor: 'rgba(184, 169, 140, 0.2)' }} />
            </div>

            <div className="mt-2">
              <h1 className="text-4xl md:text-5xl font-black text-[#2e2520] tracking-tight leading-tight">
                Thank You!
              </h1>
              <p className="text-stone-400 text-[15px] mt-2 leading-relaxed">
                Pesanan <strong className="text-[#2e2520]">{order.customerName}</strong> sudah masuk ke dapur. 🎉
              </p>
            </div>

            {/* Status pill */}
            <span className="mt-1 inline-flex items-center gap-1.5 bg-green-50 border border-green-200 text-green-700 text-[12px] font-bold px-4 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block animate-pulse" />
              {order.status}
            </span>
          </div>

          {/* ══════════════════════════════════════
              META BADGES ROW
          ══════════════════════════════════════ */}
          <div className="flex items-center gap-3 flex-wrap justify-center">
            <div className="flex items-center gap-2 bg-white border border-stone-200 rounded-2xl px-4 py-2.5 shadow-sm">
              <svg className="w-4 h-4" style={{ color: '#B8A98C' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span className="text-[12px] text-stone-400 font-medium">Order</span>
              <span className="text-[13px] font-black text-[#2e2520]">#{order.orderId}</span>
            </div>

            <div className="flex items-center gap-2 bg-white border border-stone-200 rounded-2xl px-4 py-2.5 shadow-sm">
              <svg className="w-4 h-4" style={{ color: '#B8A98C' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" />
              </svg>
              <span className="text-[12px] text-stone-400 font-medium">Nama</span>
              <span className="text-[13px] font-black text-[#2e2520]">{order.customerName}</span>
            </div>

            <div className="flex items-center gap-2 bg-white border border-stone-200 rounded-2xl px-4 py-2.5 shadow-sm">
              <svg className="w-4 h-4" style={{ color: '#B8A98C' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 018.25 20.25H6A2.25 2.25 0 013.75 18v-2.25z" />
              </svg>
              <span className="text-[12px] text-stone-400 font-medium">Meja</span>
              <span className="text-[13px] font-black text-[#2e2520]">{order.tableNumber}</span>
            </div>
          </div>

          {/* ══════════════════════════════════════
              STRUK RECEIPT CARD
          ══════════════════════════════════════ */}
          <div className="w-full bg-white rounded-3xl shadow-xl shadow-stone-200/60 overflow-hidden">

            {/* Receipt header */}
            <div className="bg-[#2e2520] px-6 py-5 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-0.5">
                  Struk Pesanan
                </p>
                <p className="text-white font-black text-[17px] tracking-tight">
                  {order.customerName}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-0.5">
                  Meja
                </p>
                <p className="text-white font-black text-[22px]">
                  {order.tableNumber}
                </p>
              </div>
            </div>

            {/* Kasir notice */}
            <div className="flex items-center gap-3 px-6 py-3 border-b border-dashed border-gray-200" style={{ backgroundColor: '#F5F1EC' }}>
              <span className="shrink-0" style={{ color: '#B8A98C' }}>⚠️</span>
              <p className="text-[12px] font-medium leading-snug" style={{ color: '#6B5D4F' }}>
                Silahkan menuju <strong>kasir</strong> untuk melakukan pembayaran.
              </p>
            </div>

            {/* Items list */}
            <div className="px-6 py-5">
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-4">
                Daftar Pesanan — {order.itemsBeli?.length ?? 0} menu
              </p>

              <div className="flex flex-col divide-y divide-stone-100">
                {order.itemsBeli?.map((item, idx) => (
                  <div key={idx} className="flex items-start justify-between py-3 gap-3">
                    {/* Kiri */}
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <span className="w-6 h-6 text-white text-[10px] font-black rounded-md flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: '#B8A98C' }}>
                        {item.quantity}
                      </span>
                      <div className="min-w-0">
                        <p className="text-[13px] font-semibold text-[#2e2520] leading-tight truncate">
                          {item.namaProduk}
                        </p>
                        {item.notes && (
                          <p className="text-[11px] text-stone-400 italic mt-0.5 truncate">
                            ✍️ {item.notes}
                          </p>
                        )}
                        <p className="text-[11px] text-stone-400 mt-0.5">
                          {item.quantity} × Rp {item.price.toLocaleString('id-ID')}
                        </p>
                      </div>
                    </div>
                    {/* Kanan */}
                    <span className="text-[13px] font-bold text-[#2e2520] whitespace-nowrap shrink-0 pt-0.5">
                      Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Gerigi tiket */}
            <div className="relative flex items-center -my-1 z-10">
              <div className="w-6 h-6 bg-white rounded-full -ml-3 border border-stone-200 shrink-0" />
              <div className="flex-1 border-t-2 border-dashed border-stone-200" />
              <div className="w-6 h-6 bg-white rounded-full -mr-3 border border-stone-200 shrink-0" />
            </div>

            {/* Total breakdown */}
            <div className="px-6 pt-5 pb-2">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[12px] text-stone-400">Subtotal</span>
                  <span className="text-[12px] text-stone-500 font-medium">
                    Rp {(order.totalAmount - tax).toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[12px] text-stone-400">Tax (10%)</span>
                  <span className="text-[12px] text-stone-500 font-medium">
                    Rp {tax.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            </div>

            {/* Total utama */}
            <div className="flex justify-between items-center px-6 py-4 mx-4 mb-5 mt-3 rounded-2xl" style={{ backgroundColor: '#F5F1EC' }}>
              <span className="text-[14px] font-bold text-[#2e2520]">Total Pembayaran</span>
              <span className="text-[22px] font-black" style={{ color: '#B8A98C' }}>
                Rp {order.totalAmount.toLocaleString('id-ID')}
              </span>
            </div>

          </div>

          {/* ══════════════════════════════════════
              TOMBOL RETURN
          ══════════════════════════════════════ */}
          <div className="w-full flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate('/menu')}
              className="flex-1 rounded-full text-white font-bold py-4 shadow-lg flex justify-center items-center gap-2 text-[15px] hover:opacity-90 transition"
              style={{ backgroundColor: '#B8A98C' }}
            >
              🍴 Return to Menu
            </button>
          </div>

          {/* Footer note */}
          <p className="text-[11px] text-stone-400 text-center pb-4">
            Terima kasih telah memesan! Pesanan Anda sedang diproses.
          </p>

        </div>
      </div>
    </div>
  );
}
