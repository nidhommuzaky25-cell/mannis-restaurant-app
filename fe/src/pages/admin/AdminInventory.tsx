import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getApiUrl } from '../../config/api';

interface Product {
  productId: number;
  productName: string;
  category: string;
  price: number;
  description: string;
  imageUrl: string;
  isAvailable: boolean;
}

// ── Shared Sidebar ─────────────────────────────────────
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

// ── Product Form Modal ─────────────────────────────────
interface ProductFormProps {
  isEditing: boolean;
  initial: Partial<Product>;
  onSave: (payload: Omit<Product, 'productId'> & { productId: number }) => void;
  onCancel: () => void;
}

function ProductFormModal({ isEditing, initial, onSave, onCancel }: ProductFormProps) {
  const [productName, setProductName] = useState(initial.productName ?? '');
  const [category, setCategory] = useState(initial.category ?? 'Main Course');
  const [price, setPrice] = useState(initial.price ?? 0);
  const [description, setDescription] = useState(initial.description ?? '');
  const [imagePreview, setImagePreview] = useState(initial.imageUrl ?? '');
  const [isAvailable, setIsAvailable] = useState(initial.isAvailable ?? true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Simpan file asli untuk diupload nanti, preview pakai object URL
    setSelectedFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUploading(true);

    let finalImageUrl = initial.imageUrl ?? '';

    // Jika ada file baru dipilih, upload dulu ke backend
    if (selectedFile) {
      try {
        const formData = new FormData();
        formData.append('file', selectedFile);
        const token = localStorage.getItem('admin_token');
        const res = await fetch(getApiUrl('/api/products/upload-image'), {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData,
        });
        if (!res.ok) {
          alert('Gagal mengupload foto. Coba lagi.');
          setUploading(false);
          return;
        }
        const data = await res.json();
        finalImageUrl = data.imageUrl;
      } catch {
        alert('Terjadi kesalahan saat upload foto.');
        setUploading(false);
        return;
      }
    }

    setUploading(false);
    onSave({ productId: initial.productId ?? 0, productName, category, price: Number(price), description, imageUrl: finalImageUrl, isAvailable });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4" onClick={onCancel}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
          <h3 className="text-[16px] font-bold text-stone-800">{isEditing ? 'Edit Product' : 'Add New Product'}</h3>
          <button onClick={onCancel} className="w-8 h-8 flex items-center justify-center rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 transition">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-[12px] font-semibold text-stone-600 mb-1.5 uppercase tracking-wide">Nama Produk *</label>
              <input required type="text" value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="Contoh: Mie Goreng Spesial" className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-[14px] text-stone-800 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 focus:bg-white transition" />
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-stone-600 mb-1.5 uppercase tracking-wide">Kategori *</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-[14px] text-stone-800 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition">
                <option value="Makanan Berat">Makanan Berat</option>
                <option value="Makanan Ringan">Makanan Ringan</option>
                <option value="Minuman">Minuman</option>
              </select>
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-stone-600 mb-1.5 uppercase tracking-wide">Harga (Rp) *</label>
              <input required type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-[14px] text-stone-800 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition" />
            </div>
            <div className="col-span-2">
              <label className="block text-[12px] font-semibold text-stone-600 mb-1.5 uppercase tracking-wide">Foto Produk</label>
              <label className="flex flex-col items-center justify-center w-full border-2 border-dashed border-stone-200 rounded-xl bg-stone-50 hover:bg-stone-100 hover:border-amber-300 transition cursor-pointer overflow-hidden">
                {imagePreview ? (
                  <div className="relative w-full">
                    <img src={imagePreview} alt="preview" className="w-full h-36 object-cover" />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition">
                      <span className="text-white text-[12px] font-semibold">Klik untuk ganti foto</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-6 gap-2">
                    <svg className="w-8 h-8 text-stone-300" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M13.5 12h.008M3.75 19.5h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5z" />
                    </svg>
                    <p className="text-[13px] font-semibold text-stone-400">Klik untuk upload foto</p>
                    <p className="text-[11px] text-stone-300">PNG, JPG, WEBP (maks. 5MB)</p>
                  </div>
                )}
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              </label>
            </div>
            <div className="col-span-2">
              <label className="block text-[12px] font-semibold text-stone-600 mb-1.5 uppercase tracking-wide">Deskripsi</label>
              <textarea rows={2} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-[14px] text-stone-800 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition resize-none" />
            </div>
            <div className="col-span-2 flex items-center gap-3">
              <button type="button" onClick={() => setIsAvailable(!isAvailable)} className={`relative w-11 h-6 rounded-full transition-colors ${isAvailable ? 'bg-emerald-500' : 'bg-stone-300'}`}>
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${isAvailable ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
              <span className="text-[13px] font-semibold text-stone-600">{isAvailable ? 'In Stock' : 'Out of Stock'}</span>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onCancel} className="flex-1 py-3 rounded-xl border border-stone-200 text-stone-600 font-semibold text-[14px] hover:bg-stone-50 transition">Batal</button>
            <button type="submit" disabled={uploading} className="flex-1 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white font-bold text-[14px] transition shadow-sm">
              {uploading ? 'Mengupload...' : isEditing ? 'Simpan Perubahan' : 'Tambah Produk'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Main Inventory Page ────────────────────────────────
const PAGE_SIZE = 8;

export default function AdminInventory() {
  const [products, setProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]); // Store all products
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Load all products once on mount
  const fetchAllProducts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('admin_token');
      const response = await fetch(getApiUrl('/api/products'), {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setAllProducts(data);
      setProducts(data);
    } catch (error) {
      console.error('Gagal memuat inventori produk:', error);
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
    if (search.trim()) {
      const keyword = search.toLowerCase();
      const filtered = allProducts.filter(product =>
        product.productName.toLowerCase().includes(keyword) ||
        product.category.toLowerCase().includes(keyword) ||
        product.description.toLowerCase().includes(keyword) ||
        `FB-${String(product.productId).padStart(3, '0')}`.toLowerCase().includes(keyword)
      );
      setProducts(filtered);
    } else {
      setProducts(allProducts);
    }
    setCurrentPage(1);
  }, [search, allProducts]);

  const handleSaveProduct = async (payload: Omit<Product, 'productId'> & { productId: number }) => {
    const isEditing = payload.productId !== 0;
    const url = isEditing
      ? getApiUrl(`/api/products/${payload.productId}`)
      : getApiUrl('/api/products');

    // Untuk POST (tambah baru), hapus productId dari body agar tidak bentrok dengan backend
    const body = isEditing
      ? payload
      : { productName: payload.productName, category: payload.category, price: payload.price, description: payload.description, imageUrl: payload.imageUrl, isAvailable: payload.isAvailable };

    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        setShowModal(false);
        setEditingProduct(null);
        fetchAllProducts();
      } else {
        // Tampilkan pesan error dari backend
        let errMsg = `Gagal ${isEditing ? 'memperbarui' : 'menambahkan'} produk.`;
        try {
          const errData = await response.json();
          errMsg = errData.message || errData.title || JSON.stringify(errData);
        } catch { /* ignore parse error */ }
        alert(`Error ${response.status}: ${errMsg}`);
      }
    } catch (error) {
      console.error('Gagal memproses produk:', error);
      alert('Terjadi kesalahan koneksi ke server.');
    }
  };

  const handleDeleteClick = async (productId: number) => {
    if (!window.confirm('Yakin ingin menghapus produk ini?')) return;
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(getApiUrl(`/api/products/${productId}`), { 
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) fetchAllProducts();
    } catch (error) { console.error('Gagal menghapus produk:', error); }
  };

  const openEdit = (product: Product) => { setEditingProduct(product); setShowModal(true); };
  const openAdd = () => { setEditingProduct(null); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setEditingProduct(null); };

  // Pagination
  const totalPages = Math.ceil(products.length / PAGE_SIZE);
  const paginated = products.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div className="min-h-screen bg-stone-50 font-sans">
      <Sidebar />
      <div className="ml-52 min-h-screen">
        {/* Header */}
        <header className="bg-white border-b border-stone-200 px-8 py-4 sticky top-0 z-10">
          <h2 className="text-[20px] font-black text-stone-800 tracking-tight">Product Management</h2>
        </header>

        <main className="px-8 py-6 space-y-5">
          {/* Search + New Product */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" strokeLinecap="round" />
              </svg>
              <input type="text" placeholder="Search product name, SKU..." value={search} onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-stone-200 bg-white text-[14px] text-stone-700 placeholder-stone-400 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition shadow-sm" />
            </div>
            <button onClick={openAdd} className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-[14px] px-5 py-2.5 rounded-xl transition shadow-sm whitespace-nowrap">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
              New Product
            </button>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
            {loading ? (
              <div className="p-8 space-y-3">{[1,2,3].map((n) => <div key={n} className="h-16 bg-stone-100 rounded-xl animate-pulse" />)}</div>
            ) : (
              <>
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-stone-50 border-b border-stone-100">
                      {['Product', 'Category', 'Price', 'Status', 'Actions'].map((h) => (
                        <th key={h} className="px-5 py-3 text-[11px] font-bold text-stone-400 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {paginated.length === 0 ? (
                      <tr><td colSpan={5} className="px-5 py-10 text-center text-stone-400 text-sm">Tidak ada produk ditemukan.</td></tr>
                    ) : paginated.map((item) => (
                      <tr key={item.productId} className="hover:bg-stone-50/60 transition">
                        {/* Product */}
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <img src={item.imageUrl || 'https://placehold.co/48x48/f5e6d3/a16207?text=F'} alt={item.productName}
                              className="w-12 h-12 rounded-xl object-cover shrink-0 border border-stone-100" />
                            <div>
                              <p className="text-[13px] font-bold text-stone-800 leading-tight">{item.productName}</p>
                              <p className="text-[11px] text-stone-400 mt-0.5">SKU: FB-{String(item.productId).padStart(3, '0')}</p>
                            </div>
                          </div>
                        </td>
                        {/* Category */}
                        <td className="px-5 py-3.5 text-[13px] text-stone-600">{item.category}</td>
                        {/* Price */}
                        <td className="px-5 py-3.5 text-[13px] font-bold text-stone-800">Rp {item.price.toLocaleString('id-ID')}</td>
                        {/* Status */}
                        <td className="px-5 py-3.5">
                          {item.isAvailable ? (
                            <span className="inline-flex items-center bg-emerald-50 border border-emerald-200 text-emerald-700 text-[12px] font-semibold px-3 py-1 rounded-full">In Stock</span>
                          ) : (
                            <span className="inline-flex items-center bg-red-50 border border-red-200 text-red-600 text-[12px] font-semibold px-3 py-1 rounded-full">Out of Stock</span>
                          )}
                        </td>
                        {/* Actions */}
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2">
                            <button onClick={() => openEdit(item)} className="w-8 h-8 flex items-center justify-center rounded-lg border border-stone-200 text-stone-500 hover:bg-stone-100 hover:text-stone-700 transition">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 3.487a2.25 2.25 0 113.182 3.182L7.5 19.213l-4.5 1.5 1.5-4.5L16.862 3.487z" /></svg>
                            </button>
                            <button onClick={() => handleDeleteClick(item.productId)} className="w-8 h-8 flex items-center justify-center rounded-lg border border-stone-200 text-stone-500 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Pagination */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-stone-100">
                  <p className="text-[12px] text-stone-400">
                    Showing {Math.min((currentPage - 1) * PAGE_SIZE + 1, products.length)} to {Math.min(currentPage * PAGE_SIZE, products.length)} of {products.length} products
                  </p>
                  <div className="flex items-center gap-1">
                    <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}
                      className="w-8 h-8 flex items-center justify-center rounded-lg border border-stone-200 text-stone-500 hover:bg-stone-50 disabled:opacity-30 disabled:cursor-not-allowed transition">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
                    </button>
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <button key={i} onClick={() => setCurrentPage(i + 1)}
                        className={`w-8 h-8 flex items-center justify-center rounded-lg text-[13px] font-semibold transition ${currentPage === i + 1 ? 'bg-stone-800 text-white' : 'border border-stone-200 text-stone-500 hover:bg-stone-50'}`}>
                        {i + 1}
                      </button>
                    ))}
                    <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages || totalPages === 0}
                      className="w-8 h-8 flex items-center justify-center rounded-lg border border-stone-200 text-stone-500 hover:bg-stone-50 disabled:opacity-30 disabled:cursor-not-allowed transition">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </main>
      </div>

      {/* Modal Add/Edit */}
      {showModal && (
        <ProductFormModal
          isEditing={editingProduct !== null}
          initial={editingProduct ?? {}}
          onSave={handleSaveProduct}
          onCancel={closeModal}
        />
      )}
    </div>
  );
}
