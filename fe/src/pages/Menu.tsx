import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MenuDetail from './MenuDetail';
import { getApiUrl } from '../config/api';

interface Product {
  productId: number;
  productName: string;
  category: string;
  price: number;
  description: string;
  imageUrl: string;
  isAvailable: boolean;
}

interface CartItem {
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

function getCart(): CartItem[] {
  return JSON.parse(localStorage.getItem('cart') || '[]');
}

function saveCart(cart: CartItem[]) {
  localStorage.setItem('cart', JSON.stringify(cart));
}

const CATEGORIES = ['Semua Menu', 'Makanan Berat', 'Makanan Ringan', 'Minuman'];

export default function Menu() {
  const [products, setProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]); // Store all products
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>(getCart());
  const [activeCategory, setActiveCategory] = useState('Semua Menu');
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);

  const navigate = useNavigate();
  const nomorMeja = localStorage.getItem('table_number') || '01';

  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);
  const cartTotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  useEffect(() => { saveCart(cart); }, [cart]);

  const handleCloseModal = () => {
    setSelectedProductId(null);
    setCart(getCart());
  };

  // Load all products once on mount
  const fetchAllProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch(getApiUrl('/api/products'));
      const data = await res.json();
      setAllProducts(data);
      setProducts(data);
    } catch (e) {
      console.error('Gagal mengambil data menu:', e);
    } finally {
      setLoading(false);
    }
  };

  // Load products only once on mount
  useEffect(() => {
    fetchAllProducts();
  }, []);

  // Client-side filtering for search (no API call)
  useEffect(() => {
    let filtered = allProducts;

    // Filter by search keyword (client-side)
    if (search.trim()) {
      const keyword = search.toLowerCase();
      filtered = filtered.filter(p => 
        p.productName.toLowerCase().includes(keyword) ||
        p.description.toLowerCase().includes(keyword) ||
        p.category.toLowerCase().includes(keyword)
      );
    }

    // Filter by category (if not "Semua Menu")
    if (activeCategory !== 'Semua Menu') {
      filtered = filtered.filter(p => p.category === activeCategory);
    }

    setProducts(filtered);
  }, [search, activeCategory, allProducts]);

  const getItemQty = (id: number) =>
    cart.find((i) => i.productId === id)?.quantity ?? 0;

  const addToCart = (e: React.MouseEvent, item: Product) => {
    e.stopPropagation();
    setCart((prev) => {
      const ex = prev.find((i) => i.productId === item.productId);
      if (ex) return prev.map((i) => i.productId === item.productId ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { productId: item.productId, productName: item.productName, price: item.price, quantity: 1, imageUrl: item.imageUrl }];
    });
  };

  const decreaseFromCart = (e: React.MouseEvent, productId: number) => {
    e.stopPropagation();
    setCart((prev) => {
      const ex = prev.find((i) => i.productId === productId);
      if (!ex) return prev;
      if (ex.quantity <= 1) return prev.filter((i) => i.productId !== productId);
      return prev.map((i) => i.productId === productId ? { ...i, quantity: i.quantity - 1 } : i);
    });
  };

  // Filter produk berdasarkan kategori
  const filteredProducts = activeCategory === 'Semua Menu' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  // Pisahkan produk per kategori untuk tampilan bersection
  const productsByCategory = {
    'Makanan Berat': products.filter(p => p.category === 'Makanan Berat'),
    'Makanan Ringan': products.filter(p => p.category === 'Makanan Ringan'),
    'Minuman': products.filter(p => p.category === 'Minuman'),
  };

  return (
    <>
      <div className="min-h-screen bg-white pb-24">
        {/* ── HEADER ── */}
        <header className="sticky top-0 z-30 bg-white px-4 py-3">
          <div className="max-w-4xl mx-auto">
            {/* Logo & Cart Icon */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center">
                  <span className="text-2xl font-black tracking-tight" style={{ color: '#B8A98C', fontFamily: 'serif' }}>mannis</span>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Meja No: {nomorMeja}</p>
                </div>
              </div>
              
              {/* Cart Button */}
              <button
                onClick={() => navigate('/checkout')}
                className="relative w-10 h-10 flex items-center justify-center"
              >
                <svg className="w-6 h-6" style={{ color: '#B8A98C' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 text-white text-[10px] font-bold rounded-full flex items-center justify-center" style={{ backgroundColor: '#B8A98C' }}>
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </button>
            </div>

            {/* Search */}
            <div className="relative mb-3">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
              </svg>
              <input
                type="text"
                placeholder="Cari menu, favorit kamu tersedia!"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 rounded-lg bg-gray-100 border-0 text-sm placeholder-gray-400 focus:bg-white transition focus:outline-none"
                style={{ boxShadow: 'none' }}
                onFocus={(e) => e.target.style.boxShadow = '0 0 0 2px #B8A98C'}
                onBlur={(e) => e.target.style.boxShadow = 'none'}
              />
              {/* Clear button (X) */}
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-full bg-stone-300 hover:bg-stone-400 text-white transition"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* Category Pills/Chips (Lebih modern daripada dropdown) */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2.5 rounded-full text-[13px] font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                    activeCategory === cat
                      ? 'text-white shadow-lg'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                  style={activeCategory === cat ? { backgroundColor: '#B8A98C', boxShadow: '0 10px 25px -5px rgba(184, 169, 140, 0.3)' } : {}}
                >
                  {/* Icon per kategori */}
                  {cat === 'Semua Menu' && (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.25" />
                    </svg>
                  )}
                  {cat === 'Makanan Berat' && (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.87c1.355 0 2.697.055 4.024.165C17.155 8.51 18 9.473 18 10.608v2.513m-3-4.87v-1.5m-6 1.5v-1.5m12 9.75l-1.5.75a3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0L3 16.5m15-3.38a48.474 48.474 0 00-6-.37c-2.032 0-4.034.125-6 .37m12 0c.39.049.777.102 1.163.16 1.07.16 1.837 1.094 1.837 2.175v5.17c0 .62-.504 1.124-1.125 1.124H4.125A1.125 1.125 0 013 20.625v-5.17c0-1.08.768-2.014 1.837-2.174A47.78 47.78 0 016 13.12M12.265 3.11a.375.375 0 11-.53 0L12 2.845l.265.265zm-3 0a.375.375 0 11-.53 0L9 2.845l.265.265zm6 0a.375.375 0 11-.53 0L15 2.845l.265.265z" />
                    </svg>
                  )}
                  {cat === 'Makanan Ringan' && (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.87c1.355 0 2.697.055 4.024.165C17.155 8.51 18 9.473 18 10.608v2.513M15 8.25v-1.5m-6 1.5v-1.5m12 9.75l-1.5.75a3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0L3 16.5m15-3.38a48.474 48.474 0 00-6-.37c-2.032 0-4.034.125-6 .37m12 0c.39.049.777.102 1.163.16 1.07.16 1.837 1.094 1.837 2.175v5.17c0 .62-.504 1.124-1.125 1.124H4.125A1.125 1.125 0 013 20.625v-5.17c0-1.08.768-2.014 1.837-2.174A47.78 47.78 0 016 13.12" />
                    </svg>
                  )}
                  {cat === 'Minuman' && (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" />
                    </svg>
                  )}
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* ── CONTENT ── */}
        <main className="px-4 pt-4">
          <div className="max-w-4xl mx-auto space-y-6">

            {/* Loading Skeleton */}
            {loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div key={n} className="flex gap-3 animate-pulse">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-3 bg-gray-200 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty State */}
            {!loading && products.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                <p className="text-sm">Menu tidak ditemukan</p>
              </div>
            )}

            {/* Tampilan ketika pakai filter kategori */}
            {!loading && products.length > 0 && activeCategory !== 'Semua Menu' && (
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-3">{activeCategory}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {filteredProducts.map((item) => {
                    const qty = getItemQty(item.productId);
                    const outOfStock = !item.isAvailable;
                    return (
                      <div
                        key={item.productId}
                        onClick={() => !outOfStock && setSelectedProductId(item.productId)}
                        className={`flex gap-3 bg-white rounded-xl p-3 border border-gray-200 transition-all relative ${
                          outOfStock 
                            ? 'opacity-60 cursor-not-allowed' 
                            : 'hover:shadow-md active:scale-[0.98] cursor-pointer'
                        }`}
                      >
                        {/* Out of Stock Badge */}
                        {outOfStock && (
                          <div className="absolute top-2 left-2 z-10">
                            <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg flex items-center gap-1">
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                              </svg>
                              Stok Habis
                            </span>
                          </div>
                        )}
                        <img
                          src={item.imageUrl || 'https://placehold.co/80x80/f5e6d3/a16207?text=Food'}
                          alt={item.productName}
                          className={`w-20 h-20 object-cover rounded-lg shrink-0 ${outOfStock ? 'grayscale' : ''}`}
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm text-gray-900 truncate">{item.productName}</h3>
                          <p className="text-xs text-gray-400 line-clamp-2 mt-0.5">{item.description}</p>
                          <p className={`text-sm font-bold mt-1 ${outOfStock ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                            Rp {item.price.toLocaleString('id-ID')}
                          </p>
                        </div>
                        <div className="flex items-center" onClick={(e) => e.stopPropagation()}>
                          {outOfStock ? (
                            <div className="text-[11px] font-bold text-red-500 text-center">
                              Tidak<br/>Tersedia
                            </div>
                          ) : qty === 0 ? (
                            <button
                              onClick={(e) => addToCart(e, item)}
                              className="w-9 h-9 rounded-full hover:opacity-90 flex items-center justify-center text-white font-bold text-xl shadow-sm"
                              style={{ backgroundColor: '#B8A98C' }}
                            >
                              +
                            </button>
                          ) : (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={(e) => decreaseFromCart(e, item.productId)}
                                className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-bold"
                              >
                                −
                              </button>
                              <span className="text-sm font-bold text-gray-900 min-w-[20px] text-center">{qty}</span>
                              <button
                                onClick={(e) => addToCart(e, item)}
                                className="w-8 h-8 rounded-full hover:opacity-90 flex items-center justify-center text-white font-bold"
                                style={{ backgroundColor: '#B8A98C' }}
                              >
                                +
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Tampilan semua menu dengan section per kategori */}
            {!loading && products.length > 0 && activeCategory === 'Semua Menu' && (
              <>
                {/* Section Menu Populer */}
                <div>
                  <h2 className="text-lg font-bold text-gray-900 mb-3">Menu Populer</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {products.slice(0, 4).map((item) => {
                      const qty = getItemQty(item.productId);
                      const outOfStock = !item.isAvailable;
                      return (
                        <div
                          key={item.productId}
                          onClick={() => !outOfStock && setSelectedProductId(item.productId)}
                          className={`flex gap-3 bg-white rounded-xl p-3 border border-gray-200 transition-all relative ${
                            outOfStock 
                              ? 'opacity-60 cursor-not-allowed' 
                              : 'hover:shadow-md active:scale-[0.98] cursor-pointer'
                          }`}
                        >
                          {/* Out of Stock Badge */}
                          {outOfStock && (
                            <div className="absolute top-2 left-2 z-10">
                              <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg flex items-center gap-1">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                Stok Habis
                              </span>
                            </div>
                          )}
                          <img
                            src={item.imageUrl || 'https://placehold.co/80x80/f5e6d3/a16207?text=Food'}
                            alt={item.productName}
                            className={`w-20 h-20 object-cover rounded-lg shrink-0 ${outOfStock ? 'grayscale' : ''}`}
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-sm text-gray-900 truncate">{item.productName}</h3>
                            <p className="text-xs text-gray-400 line-clamp-2 mt-0.5">{item.description}</p>
                            <p className={`text-sm font-bold mt-1 ${outOfStock ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                              Rp {item.price.toLocaleString('id-ID')}
                            </p>
                          </div>
                          <div className="flex items-center" onClick={(e) => e.stopPropagation()}>
                            {outOfStock ? (
                              <div className="text-[11px] font-bold text-red-500 text-center">
                                Tidak<br/>Tersedia
                              </div>
                            ) : qty === 0 ? (
                              <button
                                onClick={(e) => addToCart(e, item)}
                                className="w-9 h-9 rounded-full hover:opacity-90 flex items-center justify-center text-white font-bold text-xl shadow-sm"
                                style={{ backgroundColor: '#B8A98C' }}
                              >
                                +
                              </button>
                            ) : (
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={(e) => decreaseFromCart(e, item.productId)}
                                  className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-bold"
                                >
                                  −
                                </button>
                                <span className="text-sm font-bold text-gray-900 min-w-[20px] text-center">{qty}</span>
                                <button
                                  onClick={(e) => addToCart(e, item)}
                                  className="w-8 h-8 rounded-full hover:opacity-90 flex items-center justify-center text-white font-bold"
                                  style={{ backgroundColor: '#B8A98C' }}
                                >
                                  +
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Section per Kategori */}
                {Object.entries(productsByCategory).map(([category, items]) => (
                  items.length > 0 && (
                    <div key={category}>
                      <h2 className="text-lg font-bold text-gray-900 mb-3">{category}</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {items.map((item) => {
                          const qty = getItemQty(item.productId);
                          const outOfStock = !item.isAvailable;
                          return (
                            <div
                              key={item.productId}
                              onClick={() => !outOfStock && setSelectedProductId(item.productId)}
                              className={`flex gap-3 bg-white rounded-xl p-3 border border-gray-200 transition-all relative ${
                                outOfStock 
                                  ? 'opacity-60 cursor-not-allowed' 
                                  : 'hover:shadow-md active:scale-[0.98] cursor-pointer'
                              }`}
                            >
                              {/* Out of Stock Badge */}
                              {outOfStock && (
                                <div className="absolute top-2 left-2 z-10">
                                  <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg flex items-center gap-1">
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                    Stok Habis
                                  </span>
                                </div>
                              )}
                              <img
                                src={item.imageUrl || 'https://placehold.co/80x80/f5e6d3/a16207?text=Food'}
                                alt={item.productName}
                                className={`w-20 h-20 object-cover rounded-lg shrink-0 ${outOfStock ? 'grayscale' : ''}`}
                              />
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-sm text-gray-900 truncate">{item.productName}</h3>
                                <p className="text-xs text-gray-400 line-clamp-2 mt-0.5">{item.description}</p>
                                <p className={`text-sm font-bold mt-1 ${outOfStock ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                                  Rp {item.price.toLocaleString('id-ID')}
                                </p>
                              </div>
                              <div className="flex items-center" onClick={(e) => e.stopPropagation()}>
                                {outOfStock ? (
                                  <div className="text-[11px] font-bold text-red-500 text-center">
                                    Tidak<br/>Tersedia
                                  </div>
                                ) : qty === 0 ? (
                                  <button
                                    onClick={(e) => addToCart(e, item)}
                                    className="w-9 h-9 rounded-full hover:opacity-90 flex items-center justify-center text-white font-bold text-xl shadow-sm"
                                    style={{ backgroundColor: '#B8A98C' }}
                                  >
                                    +
                                  </button>
                                ) : (
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={(e) => decreaseFromCart(e, item.productId)}
                                      className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-bold"
                                    >
                                      −
                                    </button>
                                    <span className="text-sm font-bold text-gray-900 min-w-[20px] text-center">{qty}</span>
                                    <button
                                      onClick={(e) => addToCart(e, item)}
                                      className="w-8 h-8 rounded-full hover:opacity-90 flex items-center justify-center text-white font-bold"
                                      style={{ backgroundColor: '#B8A98C' }}
                                    >
                                      +
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )
                ))}
              </>
            )}

          </div>
        </main>

        {/* ── FLOATING CART BUTTON ── */}
        {cartCount > 0 && (
          <div className="fixed bottom-0 left-0 right-0 z-40 bg-white px-4 py-3 shadow-[0_-4px_12px_rgba(0,0,0,0.1)]">
            <div className="max-w-4xl mx-auto">
              <button
                onClick={() => navigate('/checkout')}
                className="w-full hover:opacity-90 text-white font-bold py-3.5 rounded-full flex items-center justify-between px-5 shadow-lg active:scale-[0.98] transition-all"
                style={{ background: 'linear-gradient(to right, #B8A98C, #A89578)' }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-white/30 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold">{cartCount}</span>
                  </div>
                  <span className="text-sm">Lihat Keranjang</span>
                </div>
                <span className="text-sm font-bold">Rp {cartTotal.toLocaleString('id-ID')}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── MODAL MENU DETAIL ── */}
      {selectedProductId !== null && (
        <MenuDetail
          id={selectedProductId}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
}
