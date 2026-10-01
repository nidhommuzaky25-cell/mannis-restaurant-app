import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface CartItem {
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  notes: string;
  imageUrl?: string;
}

export default function Checkout() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const tableNumber = localStorage.getItem('table_number') || '01';

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(savedCart);
  }, []);

  const updateQuantity = (index: number, delta: number) => {
    const updatedCart = [...cart];
    updatedCart[index].quantity += delta;
    if (updatedCart[index].quantity <= 0) updatedCart.splice(index, 1);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = totalAmount * 0.1;
  const grandTotal = totalAmount + tax;

  const handlePlaceOrder = async () => {
    if (!customerName.trim()) { alert('Mohon isi Nama kamu terlebih dahulu!'); return; }
    if (cart.length === 0) { alert('Keranjang belanja kamu kosong.'); return; }

    const orderData = {
      tableNumber,
      customerName,
      additionalNotes,
      cartItems: cart.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        notes: item.notes,
      })),
    };

    try {
      setLoading(true);
      const response = await fetch('http://localhost:5029/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });
      const result = await response.json();
      if (response.ok) {
        localStorage.removeItem('cart');
        navigate(`/order-success/${result.orderId}`);
      } else {
        alert(result.message || 'Gagal memproses pesanan.');
      }
    } catch (error) {
      console.error('Error saat checkout:', error);
      alert('Terjadi kesalahan jaringan dengan server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-[#2e2520]">

      {/* ══════════════════════════════════════════
          HEADER — full width, sticky
      ══════════════════════════════════════════ */}
      <header className="sticky top-0 z-30 bg-white backdrop-blur-sm border-b border-stone-100 px-4 md:px-10 py-3">
        <div className="max-w-screen-xl mx-auto flex items-center justify-between">
          {/* Tombol kembali */}
          <button
            onClick={() => navigate('/menu')}
            className="flex items-center gap-2 text-[13px] font-semibold text-stone-500 hover:text-[#2e2520] transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            <span className="hidden sm:inline">Kembali ke Menu</span>
          </button>

          {/* Judul */}
          <h1 className="text-[17px] font-bold text-[#2e2520] tracking-tight">Checkout</h1>

          {/* Badge meja */}
          <span className="text-[#2e2520] text-[12px] font-semibold px-3 py-1.5 rounded-full border border-gray-200" style={{ backgroundColor: '#F5F1EC' }}>
            Meja No: {tableNumber}
          </span>
        </div>
      </header>

      {/* ══════════════════════════════════════════
          WARNING BANNER
      ══════════════════════════════════════════ */}
      <div className="px-4 md:px-10 pt-4">
        <div className="max-w-screen-xl mx-auto">
          <div className="text-white px-4 py-3 rounded-xl flex items-start gap-2 text-xs font-medium" style={{ backgroundColor: '#B8A98C' }}>
            <span className="mt-0.5 shrink-0">⚠️</span>
            <span>Pembayaran harus dilakukan di <strong>KASIR</strong> dengan menyebutkan nomor pesanan.</span>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          MAIN CONTENT
          Mobile  : 1 kolom (stack vertikal)
          Desktop : 2 kolom (kiri pesanan | kanan form+ringkasan)
      ══════════════════════════════════════════ */}
      <main className="px-4 md:px-10 py-6 pb-28 md:pb-10">
        <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row gap-6 items-start">

          {/* ── KOLOM KIRI — Daftar Pesanan ── */}
          <div className="w-full md:flex-1">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[16px] font-bold text-[#2e2520]">Pesanan Anda</h2>
              <span className="text-[12px] text-stone-400 font-medium bg-stone-100 px-2.5 py-1 rounded-full">
                {cart.reduce((s, i) => s + i.quantity, 0)} items
              </span>
            </div>

            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-stone-400 bg-white rounded-2xl border border-stone-100">
                <svg className="w-12 h-12 mb-3" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272" />
                </svg>
                <p className="text-sm font-medium mb-2">Keranjang kosong</p>
                <button onClick={() => navigate('/menu')} className="font-semibold text-sm hover:opacity-80 transition" style={{ color: '#B8A98C' }}>
                  Pilih Menu →
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {cart.map((item, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-2xl p-4 shadow-sm flex gap-3 border border-stone-100 hover:shadow-md transition-shadow"
                  >
                    {/* Gambar */}
                    <img
                      src={item.imageUrl || 'https://placehold.co/80x80/f5e6d3/a16207?text=🍽'}
                      alt={item.productName}
                      className="rounded-xl object-cover w-20 h-20 shrink-0"
                    />

                    {/* Info */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-0.5">
                          <p className="text-[14px] font-bold text-[#2e2520] leading-tight line-clamp-2 flex-1">
                            {item.productName}
                          </p>
                          <span className="text-[13px] font-bold whitespace-nowrap shrink-0" style={{ color: '#B8A98C' }}>
                            Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-400 mb-0.5">
                          @ Rp {item.price.toLocaleString('id-ID')} / item
                        </p>
                        {item.notes && (
                          <p className="text-[11px] text-stone-400 italic line-clamp-1">✍️ {item.notes}</p>
                        )}
                      </div>

                      {/* Counter */}
                      <div className="mt-2 flex items-center gap-0">
                        <div className="rounded-full px-3 py-1 flex items-center gap-3 w-fit" style={{ backgroundColor: '#F5F1EC' }}>
                          <button
                            onClick={() => updateQuantity(index, -1)}
                            className="w-5 h-5 flex items-center justify-center text-[#2e2520] font-bold text-base leading-none hover:opacity-70 transition"
                          >
                            −
                          </button>
                          <span className="text-[13px] font-bold text-[#2e2520] min-w-[20px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(index, 1)}
                            className="w-5 h-5 flex items-center justify-center text-[#2e2520] font-bold text-base leading-none hover:opacity-70 transition"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── KOLOM KANAN — Form + Ringkasan + Tombol ── */}
          <div className="w-full md:w-[380px] lg:w-[420px] shrink-0 flex flex-col gap-4 md:sticky md:top-24">

            {/* Form Informasi Pemesan */}
            <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5">
              <h2 className="text-[15px] font-bold text-[#2e2520] mb-4">Informasi Pemesan</h2>

              {/* Nama */}
              <div className="mb-3">
                <label className="block text-[12px] font-semibold text-[#2e2520] mb-1.5 tracking-wide uppercase">
                  Nama Pemesan <span className="text-red-400 normal-case">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Masukkan nama kamu..."
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-4 py-3 pr-10 rounded-xl border border-gray-200 bg-white text-[14px] text-[#2e2520] placeholder-stone-300 outline-none transition"
                    style={{ boxShadow: 'none' }}
                    onFocus={(e) => e.target.style.boxShadow = '0 0 0 2px #B8A98C'}
                    onBlur={(e) => e.target.style.boxShadow = 'none'}
                  />
                  <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                </div>
              </div>

              {/* Catatan */}
              <div>
                <label className="block text-[12px] font-semibold text-[#2e2520] mb-1.5 tracking-wide uppercase">
                  Catatan Tambahan
                </label>
                <textarea
                  placeholder="Contoh: Tolong pisahkan sambal, sendok 2..."
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-[14px] text-[#2e2520] placeholder-stone-300 outline-none transition resize-none"
                  style={{ boxShadow: 'none' }}
                  onFocus={(e) => e.target.style.boxShadow = '0 0 0 2px #B8A98C'}
                  onBlur={(e) => e.target.style.boxShadow = 'none'}
                />
              </div>
            </div>

            {/* Ringkasan Pembayaran */}
            <div className="rounded-2xl p-5" style={{ backgroundColor: '#F5F1EC' }}>
              <h2 className="text-[15px] font-bold text-[#2e2520] mb-4">Ringkasan Pembayaran</h2>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] text-stone-500">Subtotal</span>
                  <span className="text-[13px] font-semibold text-[#2e2520]">
                    Rp {totalAmount.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[13px] text-stone-500">Tax (10%)</span>
                  <span className="text-[13px] font-semibold text-[#2e2520]">
                    Rp {tax.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[14px] font-bold text-[#2e2520]">Total Pembayaran</span>
                    <span className="text-[18px] font-black" style={{ color: '#B8A98C' }}>
                      Rp {grandTotal.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tombol Place Order — desktop only, mobile pakai fixed bottom bar */}
            <button
              onClick={handlePlaceOrder}
              disabled={loading}
              className={`hidden md:flex w-full rounded-full text-white font-bold py-4 shadow-lg justify-center items-center gap-2 hover:opacity-90 transition text-[15px] ${
                loading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'
              }`}
              style={{ backgroundColor: '#B8A98C' }}
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
                  </svg>
                  Sedang Memproses...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Place Order →
                </>
              )}
            </button>

          </div>{/* end kolom kanan */}
        </div>
      </main>

      {/* Fixed bottom bar — mobile only */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-stone-100 px-4 py-3 shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[12px] text-stone-400">Total Pembayaran</span>
          <span className="text-[16px] font-black" style={{ color: '#B8A98C' }}>Rp {grandTotal.toLocaleString('id-ID')}</span>
        </div>
        <button
          onClick={handlePlaceOrder}
          disabled={loading}
          className={`w-full rounded-full text-white font-bold py-3.5 flex justify-center items-center gap-2 hover:opacity-90 transition text-[15px] ${
            loading ? 'opacity-70 cursor-not-allowed' : ''
          }`}
          style={{ backgroundColor: '#B8A98C' }}
        >
          {loading ? 'Sedang Memproses...' : 'Place Order →'}
        </button>
      </div>

    </div>
  );
}
