# ✅ Update: CORS Configuration via appsettings.json

**Date:** October 9, 2026  
**Updated by:** Nidhom

---

## 📋 Apa yang Diupdate?

CORS configuration sekarang menggunakan **array string dari `appsettings.json`** sesuai arahan mentor. Ini membuat konfigurasi lebih flexible dan mudah untuk deployment production tanpa harus recompile code.

---

## 🔄 Perubahan

### **Before** (Hard-coded di `Program.cs`)
```csharp
policy.SetIsOriginAllowed(origin =>
{
    if (origin.StartsWith("http://localhost:")) return true;
    if (origin.StartsWith("http://192.168.")) return true;
    // ... dll
})
```

**❌ Problem:**
- Tidak flexible
- Harus recompile setiap ubah origin
- Sulit maintain untuk production

---

### **After** (Config-based)

**1. `Program.cs` (be/Program.cs)**
```csharp
// CORS configuration dibaca dari appsettings.json
var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() 
                     ?? new[] { "http://localhost:5173" }; // Fallback

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

**2. `appsettings.json` (Production)**
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

**3. `appsettings.Development.json` (Development)**
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

**✅ Benefits:**
- Flexible: Tinggal edit JSON, tidak perlu recompile
- Environment-specific: Development & Production punya config berbeda
- Safe fallback: Default ke `localhost:5173` kalau config tidak ada
- Production-ready: Mudah tambah domain production

---

## 📝 Cara Pakai

### Development
Kalau butuh tambah IP/port baru untuk testing:
1. Edit `be/appsettings.Development.json`
2. Tambah URL ke array `Cors.AllowedOrigins`
3. Restart backend (`dotnet run`)

### Production
Saat deploy ke server production:
1. Edit `be/appsettings.json`
2. Update `Cors.AllowedOrigins` dengan domain production
3. Hapus localhost URLs (security best practice)
4. Restart service

**Contoh Production:**
```json
{
  "Cors": {
    "AllowedOrigins": [
      "https://mannis-app.vercel.app",
      "https://mannis-restaurant.com"
    ]
  }
}
```

---

## ✅ Testing

Build backend sudah di-test dan berhasil:

```bash
$ dotnet build -c Release

Build succeeded in 2.5s ✅
```

---

## 📚 Dokumentasi

- **Detail lengkap:** Lihat `CORS_CONFIGURATION.md`
- **README updated:** Section "CORS Configuration" sudah diupdate
- **Architecture docs:** `be/ARCHITECTURE.md` masih sama (no breaking changes)

---

## 🚀 Next Steps

1. ✅ CORS configuration sudah selesai
2. ⏭️ Test deployment di server production (koordinasi dengan mentor)
3. ⏭️ Update production domain di `appsettings.json` setelah deploy

---

**Status:** ✅ Ready for Production
