import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MenuDetail from './MenuDetail';

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

  const fetchProducts = async (keyword: string) => {
    try {
      setLoading(true);
      const url = keyword
        ? `http://localhost:5029/api/products?search=${keyword}`
        : `http://localhost:5029/api/products`;
      const res = await fetch(url);
      setProducts(await res.json());
    } catch (e) {
      console.error('Gagal mengambil data menu:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(() => fetchProducts(search), 500);
    return () => clearTimeout(t);
  }, [search]);

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
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-gray-100 border-0 text-sm placeholder-gray-400 focus:bg-white transition focus:outline-none"
                style={{ boxShadow: 'none' }}
                onFocus={(e) => e.target.style.boxShadow = '0 0 0 2px #B8A98C'}
                onBlur={(e) => e.target.style.boxShadow = 'none'}
              />
            </div>

            {/* Category Dropdown */}
            <select
              value={activeCategory}
              onChange={(e) => setActiveCategory(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-700 bg-white focus:border-transparent focus:outline-none"
              style={{ boxShadow: 'none' }}
              onFocus={(e) => e.target.style.boxShadow = '0 0 0 2px #B8A98C'}
              onBlur={(e) => e.target.style.boxShadow = 'none'}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
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
                    return (
                      <div
                        key={item.productId}
                        onClick={() => setSelectedProductId(item.productId)}
                        className="flex gap-3 bg-white rounded-xl p-3 border border-gray-200 hover:shadow-md active:scale-[0.98] transition-all cursor-pointer"
                      >
                        <img
                          src={item.imageUrl || 'https://placehold.co/80x80/f5e6d3/a16207?text=Food'}
                          alt={item.productName}
                          className="w-20 h-20 object-cover rounded-lg shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm text-gray-900 truncate">{item.productName}</h3>
                          <p className="text-xs text-gray-400 line-clamp-2 mt-0.5">{item.description}</p>
                          <p className="text-sm font-bold text-gray-900 mt-1">Rp {item.price.toLocaleString('id-ID')}</p>
                        </div>
                        <div className="flex items-center" onClick={(e) => e.stopPropagation()}>
                          {qty === 0 ? (
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
                      return (
                        <div
                          key={item.productId}
                          onClick={() => setSelectedProductId(item.productId)}
                          className="flex gap-3 bg-white rounded-xl p-3 border border-gray-200 hover:shadow-md active:scale-[0.98] transition-all cursor-pointer"
                        >
                          <img
                            src={item.imageUrl || 'https://placehold.co/80x80/f5e6d3/a16207?text=Food'}
                            alt={item.productName}
                            className="w-20 h-20 object-cover rounded-lg shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-sm text-gray-900 truncate">{item.productName}</h3>
                            <p className="text-xs text-gray-400 line-clamp-2 mt-0.5">{item.description}</p>
                            <p className="text-sm font-bold text-gray-900 mt-1">Rp {item.price.toLocaleString('id-ID')}</p>
                          </div>
                          <div className="flex items-center" onClick={(e) => e.stopPropagation()}>
                            {qty === 0 ? (
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
                          return (
                            <div
                              key={item.productId}
                              onClick={() => setSelectedProductId(item.productId)}
                              className="flex gap-3 bg-white rounded-xl p-3 border border-gray-200 hover:shadow-md active:scale-[0.98] transition-all cursor-pointer"
                            >
                              <img
                                src={item.imageUrl || 'https://placehold.co/80x80/f5e6d3/a16207?text=Food'}
                                alt={item.productName}
                                className="w-20 h-20 object-cover rounded-lg shrink-0"
                              />
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-sm text-gray-900 truncate">{item.productName}</h3>
                                <p className="text-xs text-gray-400 line-clamp-2 mt-0.5">{item.description}</p>
                                <p className="text-sm font-bold text-gray-900 mt-1">Rp {item.price.toLocaleString('id-ID')}</p>
                              </div>
                              <div className="flex items-center" onClick={(e) => e.stopPropagation()}>
                                {qty === 0 ? (
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
