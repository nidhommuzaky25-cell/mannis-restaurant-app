import { useState, useEffect } from 'react';

interface Product {
  productId: number;
  productName: string;
  category: string;
  price: number;
  description: string;
  imageUrl: string;
}

export interface MenuDetailProps {
  id: number;
  onClose: () => void;
}

const SPICY_KEYWORDS = ['pedas', 'spicy', 'gacoan', 'sambal', 'balado', 'rica', 'setan', 'mercon'];

function isSpicy(product: Product): boolean {
  const haystack = `${product.productName} ${product.category}`.toLowerCase();
  return SPICY_KEYWORDS.some((kw) => haystack.includes(kw));
}

export default function MenuDetail({ id, onClose }: MenuDetailProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setQuantity(1);
    setNotes('');
    setProduct(null);
    setLoading(true);

    const fetchProductDetail = async () => {
      try {
        const response = await fetch(
          `http://localhost:5029/api/products/${id}`
        );
        if (response.ok) {
          setProduct(await response.json());
        }
      } catch (error) {
        console.error('Gagal memuat detail produk:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProductDetail();
    }
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;

    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    const newItem = {
      productId: product.productId,
      productName: product.productName,
      price: product.price,
      quantity,
      notes,
      imageUrl: product.imageUrl,
    };

    const itemIndex = existingCart.findIndex(
      (item: { productId: number; notes: string }) =>
        item.productId === product.productId && item.notes === notes
    );

    if (itemIndex > -1) existingCart[itemIndex].quantity += quantity;
    else existingCart.push(newItem);

    localStorage.setItem('cart', JSON.stringify(existingCart));
    onClose();
  };

  const totalHarga = (product?.price ?? 0) * quantity;

  // ── Shared inner content (dipakai di kedua layout) ──────────────────────
  const DetailContent = () => (
    <>
      {/* Loading skeleton */}
      {loading && (
        <div className="animate-pulse space-y-4 p-6">
          <div className="w-full h-48 bg-stone-200 rounded-2xl md:hidden" />
          <div className="h-6 bg-stone-200 rounded w-3/4" />
          <div className="h-4 bg-stone-200 rounded w-1/3" />
          <div className="h-3 bg-stone-200 rounded w-full" />
          <div className="h-3 bg-stone-200 rounded w-5/6" />
          <div className="h-20 bg-stone-200 rounded-xl" />
          <div className="h-14 bg-stone-200 rounded-2xl" />
          <div className="h-14 bg-stone-200 rounded-full" />
        </div>
      )}

      {/* Error */}
      {!loading && !product && (
        <div className="text-center py-12 px-6">
          <p className="text-stone-400 text-sm mb-4">Menu tidak ditemukan atau habis.</p>
          <button onClick={onClose} className="font-semibold text-sm hover:opacity-80 transition" style={{ color: '#B8A98C' }}>← Kembali</button>
        </div>
      )}

      {/* Konten */}
      {!loading && product && (
        <div className="px-6 pb-8 pt-2 flex flex-col gap-5">

          {/* Nama + badge */}
          <div>
            <div className="flex items-start gap-2 flex-wrap">
              <h2 className="text-[22px] font-black text-[#2e2520] leading-tight flex-1">
                {product.productName}
              </h2>
              {isSpicy(product) && (
                <span className="flex items-center gap-1 bg-red-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap mt-0.5">
                  🔥 SPICY
                </span>
              )}
            </div>
            <p className="text-[20px] font-bold mt-1" style={{ color: '#B8A98C' }}>
              Rp {product.price.toLocaleString('id-ID')}
            </p>
          </div>

          {/* Divider */}
          <div className="border-t border-dashed border-stone-200" />

          {/* Deskripsi */}
          <p className="text-[13px] text-gray-500 leading-relaxed tracking-wide">
            {product.description}
          </p>

          {/* Special Notes */}
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <svg className="w-3.5 h-3.5 text-[#2e2520]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 3.487a2.25 2.25 0 113.182 3.182L7.5 19.213l-4.5 1.5 1.5-4.5L16.862 3.487z" />
              </svg>
              <span className="text-[11px] font-bold text-[#2e2520] tracking-widest uppercase">
                Special Notes
              </span>
            </div>
            <textarea
              rows={3}
              placeholder="contoh: Pedas level 3, Gak pake daun bawang"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white text-[13px] text-[#2e2520] placeholder-stone-300 outline-none transition resize-none"
              style={{ boxShadow: 'none' }}
              onFocus={(e) => e.target.style.boxShadow = '0 0 0 2px #B8A98C'}
              onBlur={(e) => e.target.style.boxShadow = 'none'}
            />
          </div>

          {/* Set Quantity */}
          <div className="flex items-center justify-between rounded-2xl px-4 py-3" style={{ backgroundColor: '#F5F1EC' }}>
            <div>
              <p className="text-[11px] text-stone-400 font-medium uppercase tracking-wider">Jumlah</p>
              <p className="text-[14px] font-semibold text-[#2e2520]">Set Quantity</p>
            </div>
            <div className="flex items-center rounded-full px-1 py-1 gap-1" style={{ backgroundColor: '#B8A98C' }}>
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-9 h-9 flex items-center justify-center text-white text-lg font-bold rounded-full hover:bg-white/10 active:bg-white/20 transition"
              >
                −
              </button>
              <span className="text-white font-bold text-[16px] min-w-[32px] text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="w-9 h-9 flex items-center justify-center text-white text-lg font-bold rounded-full hover:bg-white/10 active:bg-white/20 transition"
              >
                +
              </button>
            </div>
          </div>

          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            className="w-full flex items-center justify-center gap-2.5 text-white font-bold text-[15px] py-4 rounded-full shadow-md hover:opacity-90 transition"
            style={{ backgroundColor: '#B8A98C' }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
            </svg>
            Add to Cart — Rp {totalHarga.toLocaleString('id-ID')}
          </button>
        </div>
      )}
    </>
  );

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col justify-end md:justify-center md:items-center"
      onClick={onClose}
    >

      {/* MOBILE — Bottom Sheet (< md) */}
      <div className="md:hidden w-full" onClick={(e) => e.stopPropagation()}>
        <div className="h-16 w-full" />
        <div className="bg-white rounded-t-[32px] max-h-[92vh] overflow-y-auto shadow-2xl">
          <div className="flex justify-center pt-3 pb-1 sticky top-0 bg-white z-10">
            <div className="w-10 h-1 bg-stone-300 rounded-full" />
          </div>

          {!loading && product && (
            <div className="mx-4 mt-2 h-52 rounded-2xl overflow-hidden shadow-sm">
              <img
                src={product.imageUrl || 'https://placehold.co/400x250/f5e6d3/a16207?text=Food'}
                alt={product.productName}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <DetailContent />
        </div>
      </div>

      {/* DESKTOP — Side-by-side dialog (≥ md) */}
      <div
        className="hidden md:flex bg-white rounded-2xl shadow-2xl overflow-hidden w-full max-w-3xl lg:max-w-4xl max-h-[88vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Kiri — Gambar */}
        <div className="relative w-[45%] shrink-0">
          {loading ? (
            <div className="w-full h-full bg-stone-200 animate-pulse" />
          ) : (
            <img
              src={product?.imageUrl || 'https://placehold.co/600x700/f5e6d3/a16207?text=Food'}
              alt={product?.productName}
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/30 to-transparent" />
          {!loading && product && isSpicy(product) && (
            <span className="absolute top-4 left-4 flex items-center gap-1 bg-red-500 text-white text-[11px] font-bold px-3 py-1.5 rounded-full shadow-md">
              🔥 SPICY
            </span>
          )}
        </div>

        {/* Kanan — Detail */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-6 pt-5 pb-0 shrink-0">
            <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-widest">
              Detail Menu
            </span>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="overflow-y-auto flex-1">
            <DetailContent />
          </div>
        </div>
      </div>

    </div>
  );
}