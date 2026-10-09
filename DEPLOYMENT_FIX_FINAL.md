# 🔧 Deployment Fix - Complete Solution

**Tanggal:** 9 Oktober 2026  
**Status:** Ready for Production

---

## 🐛 **2 Bug yang Ditemukan & Diperbaiki:**

### **Bug #1: Login Admin Error 500** ✅ FIXED
**Root Cause:** Database schema mismatch
- Database kolom: `"Password"`
- C# Model property: `PasswordHash`
- Entity Framework tidak bisa mapping → Error 500

**Fix:** Tambah `[Column("Password")]` attribute di Model

### **Bug #2: CORS Policy Error** ✅ FIXED
**Root Cause:** Backend belum allow origin production
- Frontend: `http://149.28.155.78:1008`
- Backend CORS: Hanya allow `localhost`

**Fix:** Update `appsettings.json` untuk include production origin

---

## 📦 **File untuk Deploy:**

### 1. Backend (WAJIB UPDATE!)
**File:** `backend-production-build-FINAL.zip` (5.37 MB)

**Apa yang diperbaiki:**
- ✅ Admin model fix (login admin akan jalan)
- ✅ CORS config production (`http://149.28.155.78:1008`)
- ✅ Ready for database PostgreSQL

### 2. Frontend (WAJIB UPDATE!)
**File:** `frontend-production-build-fixed.zip` (0.10 MB)

**Apa yang diperbaiki:**
- ✅ API URL production (`http://149.28.155.78:5007`)
- ✅ Config.js sudah benar

---

## 🚀 **Deployment Steps (Untuk Mas Ilham):**

### **Step 1: Backup Current Deployment**
```bash
# Backup backend
cd /path/to/backend
tar -czf backup-backend-$(date +%Y%m%d).tar.gz *

# Backup frontend
cd /path/to/frontend
tar -czf backup-frontend-$(date +%Y%m%d).tar.gz *
```

### **Step 2: Stop Services**
```bash
# Stop backend service
sudo systemctl stop backend-service
# atau
pkill -f be.dll

# Stop frontend service (jika ada)
sudo systemctl stop nginx
```

### **Step 3: Deploy Backend**
```bash
# Extract backend baru
cd /path/to/backend
unzip backend-production-build-FINAL.zip

# PENTING: Edit appsettings.json untuk database connection
nano appsettings.json
# Update:
# "ConnectionStrings": {
#   "DefaultConnection": "Host=localhost;Port=5432;Database=BarcodeRestoDB;Username=postgres;Password=REAL_PASSWORD"
# }

# Set permissions
chmod +x be.exe
```

### **Step 4: Deploy Frontend**
```bash
# Extract frontend baru
cd /path/to/frontend
unzip frontend-production-build-fixed.zip -d dist/

# Verify config
cat dist/config.js
# Harus: API_BASE_URL: 'http://149.28.155.78:5007'
```

### **Step 5: Start Services**
```bash
# Start backend
cd /path/to/backend
nohup ./be.exe &
# atau
sudo systemctl start backend-service

# Start frontend
sudo systemctl start nginx
```

### **Step 6: Verify**
```bash
# Test backend
curl http://149.28.155.78:5007/api/products

# Test frontend
curl http://149.28.155.78:1008
```

---

## ✅ **Verification Checklist:**

Setelah deploy, test semua fitur:

### **Customer Flow:**
- [ ] Menu page load: `http://149.28.155.78:1008`
- [ ] Bisa lihat produk (API call ke backend)
- [ ] Bisa tambah ke cart
- [ ] Bisa checkout
- [ ] Order success page muncul

### **Admin Flow:**
- [ ] Login page: `http://149.28.155.78:1008/admin/login`
- [ ] Bisa login dengan `admin` / `admin123`
- [ ] Dashboard load (no CORS error)
- [ ] Order management page load
- [ ] Inventory page load
- [ ] Bisa CRUD products

### **Browser Console:**
- [ ] No CORS errors
- [ ] No 500 errors
- [ ] API calls success (status 200)

---

## 🔍 **Technical Details:**

### **Backend Changes:**

**File: `Models/Admin.cs`**
```csharp
// BEFORE
public string PasswordHash { get; set; }

// AFTER
[Column("Password")]  // Map ke kolom database
public string PasswordHash { get; set; }
```

**File: `appsettings.json`**
```json
{
  "Cors": {
    "AllowedOrigins": [
      "http://localhost:5173",
      "http://localhost:3000",
      "http://149.28.155.78:1008",    // ← ADDED!
      "https://your-production-domain.com"
    ]
  }
}
```

### **Frontend Changes:**

**File: `config.js`**
```javascript
// BEFORE
API_BASE_URL: 'http://localhost:5029'

// AFTER
API_BASE_URL: 'http://149.28.155.78:5007'  // ← Production API
```

---

## 🆘 **Troubleshooting:**

### **Issue: Login masih error 500**
**Kemungkinan:**
1. Database belum di-setup
2. Table `Admins` belum ada
3. Connection string salah

**Fix:**
```bash
# Run database setup script
psql -U postgres -d BarcodeRestoDB -f database-setup-postgresql.sql

# Verify table exists
psql -U postgres -d BarcodeRestoDB -c "SELECT * FROM \"Admins\";"
```

### **Issue: CORS error masih muncul**
**Kemungkinan:**
1. Backend belum restart setelah update config
2. appsettings.json tidak ter-update

**Fix:**
```bash
# Restart backend
sudo systemctl restart backend-service

# Verify config
cat /path/to/backend/appsettings.json | grep -A 5 "Cors"
```

### **Issue: API tidak respond**
**Kemungkinan:**
1. Backend tidak jalan
2. Port 5007 tidak accessible

**Fix:**
```bash
# Check backend process
ps aux | grep be

# Check port
netstat -tulpn | grep 5007

# Check logs
journalctl -u backend-service -f
```

---

## 📋 **Database Setup (Jika Belum):**

Jika database belum di-setup di server production:

```bash
# 1. Install PostgreSQL (jika belum)
sudo apt update
sudo apt install postgresql postgresql-contrib

# 2. Create database
sudo -u postgres psql
CREATE DATABASE "BarcodeRestoDB";
\q

# 3. Run setup script
sudo -u postgres psql -d BarcodeRestoDB -f database-setup-postgresql.sql

# 4. Verify
sudo -u postgres psql -d BarcodeRestoDB -c "SELECT 'Admins' AS \"Table\", COUNT(*) FROM \"Admins\" UNION ALL SELECT 'Products', COUNT(*) FROM \"Products\";"
```

Expected output:
```
  Table   | count 
----------+-------
 Admins   |     1
 Products |    15
```

---

## 🔐 **Security Checklist (Post-Deployment):**

- [ ] Ganti password admin default (`admin123`)
- [ ] Update JWT secret key di `appsettings.json`
- [ ] Remove localhost origins dari CORS production
- [ ] Setup HTTPS (SSL certificate)
- [ ] Firewall rules untuk port 5007 & 1008
- [ ] Database backup schedule
- [ ] Monitor logs untuk unauthorized access

---

## 📞 **Contact:**

Jika ada issue saat deployment:
- Developer: Nidhom
- Created: 9 Oktober 2026

---

**Summary:**
✅ 2 bugs fixed  
✅ Production ready  
✅ Tested & verified  
✅ Documentation complete
