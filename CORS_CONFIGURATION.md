# CORS Configuration Guide

## ✅ Update: CORS sekarang pakai `appsettings.json`

CORS configuration sudah dipindahkan ke `appsettings.json` menggunakan array string, sehingga bisa diubah tanpa recompile code.

---

## 📝 Cara Konfigurasi

### 1️⃣ **Development (`appsettings.Development.json`)**

```json
{
  "Cors": {
    "AllowedOrigins": [
      "http://localhost:5173",
      "http://localhost:3000",
      "http://127.0.0.1:5173",
      "http://192.168.1.100:5173"
    ]
  }
}
```

### 2️⃣ **Production (`appsettings.json`)**

```json
{
  "Cors": {
    "AllowedOrigins": [
      "http://localhost:5173",
      "http://localhost:3000",
      "https://your-production-domain.com"
    ]
  }
}
```

---

## 🔧 Cara Tambah Origin Baru

Tinggal tambahkan URL ke array `AllowedOrigins`:

```json
{
  "Cors": {
    "AllowedOrigins": [
      "http://localhost:5173",
      "http://localhost:3000",
      "https://production-frontend.com",
      "https://staging-frontend.com",
      "http://192.168.1.50:8080"
    ]
  }
}
```

**Tidak perlu rebuild aplikasi!** Tinggal restart service saja.

---

## ⚙️ Implementation Details

### Code di `Program.cs`:

```csharp
// CORS configuration dibaca dari appsettings.json
var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() 
                     ?? new[] { "http://localhost:5173" }; // Fallback jika tidak ada di config

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy =>
        {
            policy.WithOrigins(allowedOrigins)
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials();
        });
});
```

### Fitur:
- ✅ Flexible: Bisa tambah/hapus origin tanpa recompile
- ✅ Environment-specific: Development & Production punya config berbeda
- ✅ Fallback safe: Kalau config tidak ada, default ke `localhost:5173`
- ✅ Credentials support: Cookie & JWT authentication tetap jalan

---

## 🚀 Deployment Checklist

Saat deploy ke production:

1. ✅ Update `AllowedOrigins` di `appsettings.json` sesuai domain production
2. ✅ Hapus localhost URLs dari production config (security best practice)
3. ✅ Restart service setelah ubah config
4. ✅ Test CORS dengan browser DevTools (cek Console untuk CORS errors)

---

## ❌ Common Issues

### Issue 1: CORS error di browser
**Solusi:** Pastikan URL frontend ada di `AllowedOrigins` dengan protokol yang benar (`http://` atau `https://`)

### Issue 2: Config tidak berubah setelah edit
**Solusi:** Restart backend service

### Issue 3: Cookie tidak terkirim
**Solusi:** Pastikan `.AllowCredentials()` tetap aktif di `Program.cs`

---

**Updated:** October 9, 2026
**By:** Nidhom
