# 🔧 Fix Login Admin - Deployment Update

**Masalah:** Login admin error 500 karena frontend masih pointing ke localhost

**Solusi:** Replace frontend deployment dengan build yang sudah fix

---

## 📦 File yang Perlu Di-Replace:

**File baru:** `frontend-production-build-fixed.zip` (101 KB)

---

## 🚀 Cara Deploy (Untuk Mas Ilham):

### 1. Stop service frontend (kalau ada)
```bash
# Kalau pakai nginx/systemd
sudo systemctl stop frontend-service
```

### 2. Backup frontend lama (optional)
```bash
cd /path/to/frontend
mv dist dist.backup.$(date +%Y%m%d)
```

### 3. Extract frontend baru
```bash
# Upload frontend-production-build-fixed.zip ke server
# Kemudian extract:
unzip frontend-production-build-fixed.zip -d dist/
```

### 4. Restart service
```bash
sudo systemctl start frontend-service
# atau
sudo systemctl restart nginx
```

### 5. Test
Buka browser: `http://149.28.155.78:1008/admin/login`

---

## ✅ Apa yang Sudah Diperbaiki:

### **Frontend config.js**
**Before:**
```javascript
window.APP_CONFIG = {
  API_BASE_URL: 'http://localhost:5029'  // ❌ Salah!
};
```

**After:**
```javascript
window.APP_CONFIG = {
  API_BASE_URL: 'http://149.28.155.78:5007'  // ✅ Production API
};
```

---

## 📝 Verification Checklist:

Setelah deploy, test:

- [ ] Frontend bisa dibuka: `http://149.28.155.78:1008`
- [ ] Halaman admin login: `http://149.28.155.78:1008/admin/login`
- [ ] Console browser tidak ada error CORS
- [ ] API calls ke `http://149.28.155.78:5007/api/auth/login`
- [ ] Login berhasil dengan `admin` / `admin123`

---

## 🆘 Troubleshooting:

### Issue: Masih error 500
**Check:**
1. Backend jalan di port 5007? `curl http://149.28.155.78:5007/api/products`
2. Database connection OK di backend?
3. CORS config di backend sudah allow `http://149.28.155.78:1008`?

### Issue: CORS error
**Fix:** Update `appsettings.json` di backend:
```json
{
  "Cors": {
    "AllowedOrigins": [
      "http://149.28.155.78:1008"
    ]
  }
}
```

---

**Updated:** October 9, 2026 - 10:02  
**By:** Nidhom
