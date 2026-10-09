# 📦 Hasil Build - Mannis Restaurant App

## 📍 Lokasi File Build

### Backend (.NET API)
```
📁 be/publish/
```

### Frontend (React)
```
📁 fe/dist/
```

---

## 🔍 Isi Hasil Build

### 1️⃣ Backend (be/publish/)

**File Utama:**
- `be.exe` → Aplikasi backend (Windows)
- `be.dll` → Aplikasi backend (Linux/Mac)
- `appsettings.json` → **File konfigurasi (EDIT INI!)**

**File Pendukung:**
- `web.config` → Konfigurasi IIS
- `*.dll` files → Library dependencies (jangan diubah)

**Total Size:** ~15 MB

**Cara Jalankan:**
```bash
# Windows
cd be/publish
be.exe

# Linux/Mac  
cd be/publish
dotnet be.dll
```

**Cara Deploy:**
1. Copy seluruh folder `be/publish/` ke server
2. Edit `appsettings.json` (connection string database)
3. Jalankan `be.exe` atau setup dengan IIS/systemd

---

### 2️⃣ Frontend (fe/dist/)

**File Utama:**
- `index.html` → Halaman utama
- `config.js` → **⭐ KONFIGURASI API URL (EDIT INI!)**
- `favicon.svg` → Icon website
- `icons.svg` → Icon SVG

**Folder:**
- `assets/` → JavaScript & CSS yang sudah di-compile
  - `index-CIZ9mTc_.js` (331 KB) → All React code
  - `index-CTDIhNjL.css` (44 KB) → All styles
- `images/` → Gambar-gambar

**Total Size:** ~400 KB

**Cara Deploy:**
1. Copy seluruh folder `fe/dist/` ke web server
2. **Edit `config.js`** untuk set API URL
3. Point web server (Nginx/IIS/Apache) ke folder ini
4. Done!

---

## ⚙️ CARA SETTING API URL (Penting!)

### ✅ YA, API URL Bisa Disetting dari Hasil Build!

**File:** `fe/dist/config.js`

**Isi Default:**
```javascript
// Runtime Configuration
// File ini bisa diedit langsung di server setelah build
window.APP_CONFIG = {
  API_BASE_URL: 'http://localhost:5029'
};
```

### 🔧 Cara Edit (Super Mudah!)

**Step 1:** Buka file dengan Notepad
```
fe/dist/config.js
```

**Step 2:** Ganti `API_BASE_URL` sesuai server
```javascript
window.APP_CONFIG = {
  API_BASE_URL: 'http://192.168.1.100:5029'  // ← IP server backend
};
```

**Step 3:** Save file

**Step 4:** Refresh browser → **DONE!** ✅

### 📋 Contoh URL Production:

```javascript
// Contoh 1: IP Lokal Kantor
window.APP_CONFIG = {
  API_BASE_URL: 'http://192.168.10.50:5029'
};

// Contoh 2: Domain Internal
window.APP_CONFIG = {
  API_BASE_URL: 'http://api-internal.perusahaan.local'
};

// Contoh 3: HTTPS dengan domain
window.APP_CONFIG = {
  API_BASE_URL: 'https://api.mannis.com'
};
```

---

## 📦 Cara Kirim ke Mas Ilham

### Option 1: Zip Files (Recommended)

**Buat 2 file ZIP:**

1. **backend-build.zip**
   - Isi: Seluruh folder `be/publish/`
   - Size: ~15 MB

2. **frontend-build.zip**
   - Isi: Seluruh folder `fe/dist/`
   - Size: ~400 KB

3. **database.sql**
   - File: `database-setup-postgresql.sql`
   - Size: ~10 KB

**Cara Buat ZIP:**
```bash
# Windows (PowerShell)
Compress-Archive -Path "be\publish\*" -DestinationPath "backend-build.zip"
Compress-Archive -Path "fe\dist\*" -DestinationPath "frontend-build.zip"
```

### Option 2: Dari GitHub (Lebih Praktis)

Mas Ilham bisa langsung clone dari GitHub:
```bash
git clone https://github.com/nidhommuzaky25-cell/mannis-restaurant-app.git
cd mannis-restaurant-app
```

Folder build sudah ada di:
- `be/publish/`
- `fe/dist/`

---

## 🎯 Checklist untuk Mas Ilham

**Backend:**
- [ ] Copy folder `be/publish/` ke server
- [ ] Edit `appsettings.json` (database connection string)
- [ ] Jalankan `be.exe` atau setup IIS/systemd
- [ ] Test: Buka `http://server-ip:5029/swagger`

**Frontend:**
- [ ] Copy folder `fe/dist/` ke web server
- [ ] Edit `config.js` (ganti `API_BASE_URL`)
- [ ] Setup Nginx/IIS/Apache point ke folder dist
- [ ] Test: Buka `http://server-ip` di browser

**Database:**
- [ ] Create database `BarcodeRestoDB`
- [ ] Run script `database-setup-postgresql.sql`
- [ ] Verify: 15 products, 1 admin account

---

## 🆘 Troubleshooting

**Q: Frontend tidak bisa connect ke backend?**
**A:** Check `fe/dist/config.js`, pastikan `API_BASE_URL` benar

**Q: Backend error database connection?**
**A:** Check `be/publish/appsettings.json`, verify connection string

**Q: Folder mana yang perlu di-deploy?**
**A:** 
- Backend → `be/publish/` (SEMUA isi folder ini)
- Frontend → `fe/dist/` (SEMUA isi folder ini)

---

## 📞 Kontak

Developer: Nidhom  
Repository: https://github.com/nidhommuzaky25-cell/mannis-restaurant-app

---

**Build Date:** 8 Oktober 2026  
**Status:** ✅ Production Ready  
**API URL Editable:** ✅ YA (via config.js)
