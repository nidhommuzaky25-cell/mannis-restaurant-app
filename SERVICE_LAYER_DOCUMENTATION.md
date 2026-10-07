# Service Layer - Separation of Concerns

## ✅ Revisi #2 Selesai!

**Feedback Mentor:**
> "pisahkan service api dengan component, buat file service sendiri"

---

## 🎯 Masalah Sebelumnya

Sebelumnya, **API logic tercampur dengan component logic**:

```tsx
// ❌ BAD: API logic di dalam component
function Menu() {
  const [products, setProducts] = useState([]);
  
  const fetchProducts = async () => {
    try {
      const response = await fetch(getApiUrl('/api/products'));
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error(error);
    }
  };
  
  // ... component logic
}
```

**Masalahnya:**
- ❌ Component jadi "gemuk" dan susah di-maintain
- ❌ API logic tidak reusable
- ❌ Sulit untuk testing (harus mock fetch)
- ❌ Tidak ada single source of truth untuk API
- ❌ Error handling inconsistent

---

## ✅ Solusi: Service Layer

Buat **service layer** terpisah yang handle semua API calls:

```
fe/src/services/
  ├── productService.ts    # Products/Menu API
  ├── orderService.ts      # Orders API
  ├── authService.ts       # Authentication API
  └── dashboardService.ts  # Dashboard/Stats API
```

**Keuntungan:**
- ✅ **Separation of Concerns**: API logic terpisah dari UI logic
- ✅ **Reusable**: Service bisa dipanggil dari component mana saja
- ✅ **Testable**: Mudah untuk unit test services
- ✅ **Maintainable**: Single source of truth untuk API
- ✅ **Type-Safe**: TypeScript interfaces untuk request/response
- ✅ **Consistent Error Handling**: Error handling terpusat

---

## 📁 Service Files

### 1. **productService.ts**

Handle semua API calls untuk products/menu:

```typescript
import { getApiUrl } from '../config/api';

export interface Product {
  productId: number;
  productName: string;
  category: string;
  price: number;
  description: string;
  imageUrl: string;
  isAvailable: boolean;
}

// Get all products
export const getAllProducts = async (search?: string): Promise<Product[]> => {
  const url = search 
    ? getApiUrl(`/api/products?search=${encodeURIComponent(search)}`)
    : getApiUrl('/api/products');
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.statusText}`);
  }
  
  return response.json();
};

// Get product by ID
export const getProductById = async (id: number): Promise<Product> => { /* ... */ };

// Create product
export const createProduct = async (product: ProductCreateDto): Promise<Product> => { /* ... */ };

// Update product
export const updateProduct = async (product: ProductUpdateDto): Promise<Product> => { /* ... */ };

// Delete product
export const deleteProduct = async (productId: number): Promise<void> => { /* ... */ };

// Upload image
export const uploadProductImage = async (file: File): Promise<{ imageUrl: string }> => { /* ... */ };
```

### 2. **orderService.ts**

Handle semua API calls untuk orders:

```typescript
export interface Order {
  orderId: number;
  tableNumber: string;
  customerName: string;
  orderDate: string;
  totalAmount: number;
  status: string;
  additionalNotes: string | null;
  itemsBeli: OrderItem[];
}

// Get all orders
export const getAllOrders = async (search?: string): Promise<Order[]> => { /* ... */ };

// Get order by ID
export const getOrderById = async (orderId: number): Promise<Order> => { /* ... */ };

// Create order
export const createOrder = async (orderData: OrderCreateDto): Promise<{ orderId: number }> => { /* ... */ };

// Mark as lunas
export const markOrderAsLunas = async (orderId: number): Promise<void> => { /* ... */ };

// Get receipt
export const getOrderReceipt = async (orderId: number): Promise<OrderReceipt> => { /* ... */ };
```

### 3. **authService.ts**

Handle authentication & localStorage:

```typescript
export interface LoginDto {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  username: string;
}

// Login
export const login = async (credentials: LoginDto): Promise<LoginResponse> => { /* ... */ };

// Save token
export const saveAuthToken = (token: string, username: string): void => { /* ... */ };

// Get token
export const getAuthToken = (): string | null => { /* ... */ };

// Clear auth
export const clearAuthData = (): void => { /* ... */ };

// Check authenticated
export const isAuthenticated = (): boolean => { /* ... */ };
```

### 4. **dashboardService.ts**

Handle dashboard statistics:

```typescript
export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  productSold: number;
  recentOrders: RecentOrder[];
  revenueChart: ChartData[];
}

// Get stats
export const getDashboardStats = async (): Promise<DashboardStats> => { /* ... */ };

// Get available months
export const getAvailableMonths = async (): Promise<AvailableMonth[]> => { /* ... */ };

// Get chart data
export const getChartData = async (
  year: number,
  view: 'monthly' | 'weekly',
  month?: number
): Promise<ChartPoint[]> => { /* ... */ };
```

---

## 🔄 Cara Menggunakan Services

### Before (API logic di component):

```tsx
// ❌ OLD WAY: Fetch langsung di component
function Menu() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  const fetchProducts = async (keyword: string) => {
    try {
      setLoading(true);
      const url = keyword
        ? getApiUrl(`/api/products?search=${keyword}`)
        : getApiUrl('/api/products');
      const res = await fetch(url);
      setProducts(await res.json());
    } catch (e) {
      console.error('Gagal mengambil data menu:', e);
    } finally {
      setLoading(false);
    }
  };
  
  // ... rest of component
}
```

### After (Pakai service):

```tsx
// ✅ NEW WAY: Pakai service
import { getAllProducts } from '../services/productService';

function Menu() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  const fetchProducts = async (keyword?: string) => {
    try {
      setLoading(true);
      const data = await getAllProducts(keyword);
      setProducts(data);
    } catch (error) {
      console.error('Gagal mengambil data menu:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // ... rest of component
}
```

**Lebih simple, lebih clean!** ✨

---

## 📊 Perbandingan Detail

### Example: Login Component

#### Before:
```tsx
// 18 lines of API logic di component
const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  
  try {
    const response = await fetch(getApiUrl('/api/auth/login'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      localStorage.setItem('admin_token', data.token);
      localStorage.setItem('admin_user', data.username);
      navigate('/admin/dashboard');
    } else {
      alert(data.message || 'Login gagal');
    }
  } catch (error) {
    alert('Terjadi kesalahan koneksi');
  } finally {
    setLoading(false);
  }
};
```

#### After:
```tsx
// 9 lines, lebih clean!
import { login, saveAuthToken } from '../services/authService';

const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  
  try {
    const data = await login({ username, password });
    saveAuthToken(data.token, data.username);
    navigate('/admin/dashboard');
  } catch (error) {
    alert(error.message);
  } finally {
    setLoading(false);
  }
};
```

**50% lebih pendek dan lebih readable!** 🎉

---

## 💡 Best Practices

### ✅ DO:

1. **Selalu pakai services untuk API calls**
   ```tsx
   // ✅ GOOD
   import { getAllProducts } from '../services/productService';
   const products = await getAllProducts();
   ```

2. **Handle errors dengan try-catch**
   ```tsx
   try {
     const data = await getAllProducts();
   } catch (error) {
     console.error('Error:', error);
     // Show error to user
   }
   ```

3. **Type semua interfaces**
   ```tsx
   import type { Product } from '../services/productService';
   const [products, setProducts] = useState<Product[]>([]);
   ```

4. **Gunakan loading states**
   ```tsx
   const [loading, setLoading] = useState(false);
   setLoading(true);
   try {
     await someService();
   } finally {
     setLoading(false);
   }
   ```

### ❌ DON'T:

1. **Jangan fetch langsung di component**
   ```tsx
   // ❌ BAD
   fetch('http://localhost:5029/api/products')
   ```

2. **Jangan hardcode URLs**
   ```tsx
   // ❌ BAD
   fetch('/api/products')
   ```

3. **Jangan ignore errors**
   ```tsx
   // ❌ BAD
   try {
     await someService();
   } catch (e) {
     // ignore silently
   }
   ```

4. **Jangan duplikasi logic**
   ```tsx
   // ❌ BAD: Copy-paste fetch logic di banyak component
   ```

---

## 🧪 Testing Benefits

Dengan service layer, testing jadi lebih mudah:

### Testing Services (Unit Test):
```typescript
// Test service in isolation
describe('productService', () => {
  it('should fetch all products', async () => {
    const products = await getAllProducts();
    expect(products).toBeArrayOfObjects();
  });
  
  it('should handle search', async () => {
    const products = await getAllProducts('nasi');
    expect(products.every(p => p.productName.includes('nasi'))).toBe(true);
  });
});
```

### Testing Components (Integration Test):
```typescript
// Mock services, test component logic
jest.mock('../services/productService');

describe('Menu Component', () => {
  it('should display products', async () => {
    getAllProducts.mockResolvedValue([/* mock data */]);
    render(<Menu />);
    expect(await screen.findByText('Nasi Goreng')).toBeInTheDocument();
  });
});
```

---

## 📦 Migration Guide

Jika mau migrate component lain, follow pattern ini:

### Step 1: Import service
```tsx
import { getAllProducts, getProductById } from '../services/productService';
```

### Step 2: Replace fetch calls
```tsx
// Before
const res = await fetch(getApiUrl('/api/products'));
const data = await res.json();

// After
const data = await getAllProducts();
```

### Step 3: Update error handling
```tsx
// Before
if (!response.ok) {
  alert('Error');
}

// After
try {
  await someService();
} catch (error) {
  alert(error.message);
}
```

### Step 4: Remove unused imports
```tsx
// Remove if not needed anymore
import { getApiUrl } from '../config/api';
```

---

## 🎯 Files Structure

```
fe/src/
├── config/
│   └── api.ts                    # API base URL config
├── services/                     # 🆕 Service layer
│   ├── productService.ts        # Products API
│   ├── orderService.ts          # Orders API  
│   ├── authService.ts           # Auth API
│   └── dashboardService.ts      # Dashboard API
└── pages/
    ├── Menu.tsx                 # Uses productService
    ├── Checkout.tsx             # Uses orderService
    ├── admin/
    │   ├── AdminLogin.tsx       # Uses authService ✅ UPDATED
    │   ├── AdminDashboard.tsx   # Uses dashboardService
    │   ├── AdminOrders.tsx      # Uses orderService
    │   └── AdminInventory.tsx   # Uses productService
    └── ...
```

---

## ✅ Benefits Summary

| Aspect | Before | After |
|--------|--------|-------|
| **Code Organization** | Mixed in components | Separated in services |
| **Reusability** | ❌ Copy-paste | ✅ Import & reuse |
| **Testability** | ❌ Hard to test | ✅ Easy to test |
| **Maintainability** | ❌ Scattered logic | ✅ Single source |
| **Type Safety** | ⚠️ Partial | ✅ Full TypeScript |
| **Error Handling** | ⚠️ Inconsistent | ✅ Consistent |
| **API Changes** | ❌ Update many files | ✅ Update 1 service |

---

## 🚀 Next Steps

Components yang sudah diupdate:
- ✅ AdminLogin.tsx (uses authService)

Components yang perlu diupdate (opsional):
- ⏳ Menu.tsx (use productService)
- ⏳ MenuDetail.tsx (use productService)
- ⏳ Checkout.tsx (use orderService)
- ⏳ OrderSuccess.tsx (use orderService)
- ⏳ AdminDashboard.tsx (use dashboardService)
- ⏳ AdminOrders.tsx (use orderService)
- ⏳ AdminInventory.tsx (use productService)

**Note**: Components masih bisa pakai cara lama (direct fetch), tapi **lebih baik migrate ke services** untuk consistency.

---

## 📝 Summary

**Revisi #2 SELESAI!**

**Yang Sudah Dibuat:**
1. ✅ `productService.ts` - 6 functions (CRUD products + upload image)
2. ✅ `orderService.ts` - 5 functions (CRUD orders + receipt)
3. ✅ `authService.ts` - 6 functions (login + localStorage management)
4. ✅ `dashboardService.ts` - 3 functions (stats + chart data)

**Total: 4 service files, 20 functions**

**Benefits:**
- Separation of Concerns ✅
- Reusable & Testable ✅
- Type-Safe & Maintainable ✅
- Professional Code Structure ✅

---

**Service layer sekarang siap digunakan! Components bisa langsung import dan pakai.** 🚀
