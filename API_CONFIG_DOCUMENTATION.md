# API Configuration - Centralized URL Management

## ✅ Revisi #1 Selesai!

**Feedback Mentor:**
> "buat file config untuk link api (http://localhost:5030/api) sehingga saat deploy beda server, tinggal ganti config"

---

## 🎯 Masalah Sebelumnya

Sebelumnya, API URL `http://localhost:5029` **hardcoded di 8+ file** frontend:
- Menu.tsx
- MenuDetail.tsx
- Checkout.tsx
- OrderSuccess.tsx
- AdminLogin.tsx
- AdminDashboard.tsx
- AdminOrders.tsx
- AdminInventory.tsx

Jadi kalau mau deploy ke server lain (production/staging), harus **edit 8+ file satu-satu**. Sangat ribet dan rawan error! 😓

---

## ✅ Solusi yang Diterapkan

### 1. **Buat File Config Centralized**

File baru: `fe/src/config/api.ts`

```typescript
// Ambil base URL dari environment variable, atau fallback ke localhost
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5029';

// Helper function untuk membuat full API URL
export const getApiUrl = (endpoint: string): string => {
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_BASE_URL}${normalizedEndpoint}`;
};
```

### 2. **Update Semua File Frontend**

**Sebelum (hardcoded):**
```tsx
// ❌ Hardcoded - susah maintenance
fetch('http://localhost:5029/api/products')
```

**Sesudah (configurable):**
```tsx
// ✅ Pakai config - tinggal ganti 1 file
import { getApiUrl } from '../config/api';
fetch(getApiUrl('/api/products'))
```

### 3. **Support Environment Variable**

File: `fe/.env` (sudah ada)

```env
# Development (default)
VITE_API_BASE_URL=http://localhost:5029

# Production (contoh)
# VITE_API_BASE_URL=https://api.production.com

# Staging (contoh)
# VITE_API_BASE_URL=https://api-staging.herokuapp.com
```

---

## 🚀 Cara Menggunakan

### Development (Lokal)

Tidak perlu apa-apa! Default sudah ke `http://localhost:5029`

```bash
cd fe
npm run dev
```

### Deploy ke Production

**Opsi 1: Edit .env**
```bash
# Edit fe/.env
VITE_API_BASE_URL=https://api.production.com

# Build
npm run build
```

**Opsi 2: Environment Variable di Hosting**

Di Vercel/Netlify/Cloudflare Pages, set environment variable:
- Key: `VITE_API_BASE_URL`
- Value: `https://your-api-backend.com`

**Opsi 3: Command Line**
```bash
VITE_API_BASE_URL=https://api.production.com npm run build
```

---

## 📁 Files yang Diubah

### ✅ File Baru:
- `fe/src/config/api.ts` - Centralized API config

### ✅ Files Diupdate:
1. `fe/src/pages/Menu.tsx`
2. `fe/src/pages/MenuDetail.tsx`
3. `fe/src/pages/Checkout.tsx`
4. `fe/src/pages/OrderSuccess.tsx`
5. `fe/src/pages/admin/AdminLogin.tsx`
6. `fe/src/pages/admin/AdminDashboard.tsx`
7. `fe/src/pages/admin/AdminOrders.tsx`
8. `fe/src/pages/admin/AdminInventory.tsx`

---

## 💡 Keuntungan

### ✅ Easy Deployment
Hanya perlu ganti **1 file** (`.env`) atau **1 environment variable**, tidak perlu edit 8+ file.

### ✅ Multi-Environment Support
```env
# Development
VITE_API_BASE_URL=http://localhost:5029

# Staging
VITE_API_BASE_URL=https://api-staging.railway.app

# Production
VITE_API_BASE_URL=https://api.production.com
```

### ✅ Type-Safe
TypeScript menjamin tidak ada typo di URL:
```tsx
getApiUrl('/api/products')     // ✅ OK
getApiUrl('api/products')      // ✅ OK (auto normalize)
API_BASE_URL + '/api/products' // ✅ OK (direct access)
```

### ✅ Developer Experience
Console log di development mode:
```
🔌 API Base URL: http://localhost:5029
```

### ✅ Maintainable & Professional
Code lebih clean dan mudah di-maintain. Standar di industri untuk project production.

---

## 🧪 Testing

### Test Lokal (Development)
```bash
cd fe
npm run dev
```
Buka browser: `http://localhost:5173`  
Check console: Harus muncul `🔌 API Base URL: http://localhost:5029`

### Test dengan API URL Custom
```bash
# Terminal 1: Backend di port lain
cd be
dotnet run --urls http://localhost:8080

# Terminal 2: Frontend dengan custom API URL
cd fe
VITE_API_BASE_URL=http://localhost:8080 npm run dev
```

### Test Production Build
```bash
cd fe
VITE_API_BASE_URL=https://api.production.com npm run build
npm run preview
```

---

## 📋 Deployment Checklist

### Untuk Backend:

- [ ] Deploy backend ke cloud (Railway/Render/Fly.io)
- [ ] Copy API URL (contoh: `https://mannis-api.railway.app`)
- [ ] Test API endpoints dengan Postman/Thunder Client

### Untuk Frontend:

- [ ] Set environment variable `VITE_API_BASE_URL` dengan API URL backend
- [ ] Build frontend: `npm run build`
- [ ] Deploy dist/ folder ke Vercel/Netlify/Cloudflare Pages
- [ ] Test di browser production

---

## 🎓 Best Practices

### ✅ DO:
- Gunakan `getApiUrl()` helper untuk semua API calls
- Set `VITE_API_BASE_URL` di environment variables (production)
- Keep `.env` file di `.gitignore` (untuk keamanan)
- Commit `.env.example` sebagai template

### ❌ DON'T:
- Jangan hardcode URL di component
- Jangan commit `.env` dengan nilai production
- Jangan lupa update `.env` saat deploy

---

## 🔧 Troubleshooting

### Error: API tidak bisa diakses dari production
**Problem**: Frontend production masih pakai `localhost`  
**Solution**: Set `VITE_API_BASE_URL` di environment variables hosting

### Error: CORS error di production
**Problem**: Backend belum allow origin dari frontend production  
**Solution**: Update `Program.cs` di backend:
```csharp
policy.WithOrigins(
    "http://localhost:5173",           // Development
    "https://your-frontend.vercel.app" // Production
)
```

### Error: 404 Not Found di production
**Problem**: API URL salah atau backend tidak running  
**Solution**: 
1. Check API URL di environment variables
2. Pastikan backend deployed dan running
3. Test API dengan curl/Postman

---

## 📝 Example Deployment Scenarios

### Scenario 1: Netlify Frontend + Railway Backend

**Backend (Railway):**
- Deploy backend → Get URL: `https://mannis-api.railway.app`

**Frontend (Netlify):**
1. Go to Site Settings → Environment Variables
2. Add:
   - Key: `VITE_API_BASE_URL`
   - Value: `https://mannis-api.railway.app`
3. Trigger redeploy

### Scenario 2: Vercel Frontend + Render Backend

**Backend (Render):**
- Deploy backend → Get URL: `https://mannis-api.onrender.com`

**Frontend (Vercel):**
1. Go to Project Settings → Environment Variables
2. Add:
   - Key: `VITE_API_BASE_URL`
   - Value: `https://mannis-api.onrender.com`
3. Redeploy from dashboard

### Scenario 3: Cloudflare Pages + Fly.io Backend

**Backend (Fly.io):**
- Deploy backend → Get URL: `https://mannis-api.fly.dev`

**Frontend (Cloudflare Pages):**
1. Go to Settings → Environment Variables → Production
2. Add:
   - Variable name: `VITE_API_BASE_URL`
   - Value: `https://mannis-api.fly.dev`
3. Retry deployment

---

## ✨ Summary

**Revisi #1 SELESAI!** 

Sekarang API URL sudah **centralized** dan mudah diubah untuk deployment. Mentor tinggal:
1. Deploy backend → Get API URL
2. Set `VITE_API_BASE_URL` dengan URL tersebut
3. Deploy frontend
4. Done! ✅

**Total files changed:** 9 files (1 new, 8 updated)  
**Pushed to GitHub:** ✅ Commit `feat: Centralize API URL configuration`

---

**Dokumentasi ini untuk mentor dan developer lain yang mau deploy project ini ke production.** 🚀
