# Setup PostgreSQL Lokal - Sudah Selesai! ✅

## 🎉 Status: Database Berhasil Dibuat!

Database PostgreSQL sudah berhasil dibuat dan semua data sudah dimasukkan.

### ✅ Yang Sudah Dilakukan:

1. **Database Created**: `BarcodeRestoDB`
2. **Tables Created**: 
   - `Admins` (1 record)
   - `Products` (15 records)
   - `Orders` (10 records)
   - `OrderDetails` (32 records)
3. **Sample Data**: Semua data sudah ada
4. **Connection String**: Sudah configured di `appsettings.Development.json`

## 📊 Data yang Sudah Ada:

- ✅ **1 Admin**: username `admin`, password `admin123`
- ✅ **15 Products**:
  - 5 Makanan Berat (Nasi Goreng, Mie Goreng, dll)
  - 5 Makanan Ringan (French Fries, Nuggets, dll)
  - 5 Minuman (Es Teh, Kopi, dll)
- ✅ **10 Orders** dengan berbagai status
- ✅ **32 Order Details**

## 🚀 Cara Menjalankan

### Backend:
```bash
cd be
dotnet run
```
Backend akan berjalan di: **http://localhost:5029/swagger**

### Frontend:
```bash
cd fe
npm run dev
```
Frontend akan berjalan di: **http://localhost:5173**

## 🔐 Connection String

File: `be/appsettings.Development.json` (tidak di-commit ke Git untuk keamanan)

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=BarcodeRestoDB;Username=postgres;Password=nidhom25"
  }
}
```

**PENTING**: File ini tidak akan di-commit ke GitHub karena sudah ada di `.gitignore`.

## 🧪 Testing

### 1. Test Backend API
Buka Swagger: http://localhost:5029/swagger

Test endpoints:
- **GET /api/products** → Harus return 15 products
- **GET /api/orders** → Harus return 10 orders
- **POST /api/auth/login** → Login dengan:
  ```json
  {
    "username": "admin",
    "password": "admin123"
  }
  ```

### 2. Test Frontend
1. Buka: http://localhost:5173
2. Klik "Menu" → Harus muncul 15 products
3. Coba order beberapa items
4. Login ke admin: http://localhost:5173/admin/login
   - Username: `admin`
   - Password: `admin123`

## 🔧 Troubleshooting

### Error: "Connection refused"
Pastikan PostgreSQL service running:
```bash
# Check service
services.msc

# Cari "postgresql-x64-18" dan pastikan statusnya "Running"
```

### Error: "Password authentication failed"
Password PostgreSQL kamu adalah: `nidhom25`

Jika lupa atau berubah, update di:
```
be/appsettings.Development.json
```

### Reset Database (jika diperlukan)
```bash
# Login ke PostgreSQL
psql -U postgres

# Drop database
DROP DATABASE "BarcodeRestoDB";

# Buat ulang
CREATE DATABASE "BarcodeRestoDB";
\q

# Run script lagi
psql -U postgres -d BarcodeRestoDB -f database-setup-postgresql.sql
```

## 📝 Untuk Developer Lain

Jika ada developer lain yang clone project ini:

1. Install PostgreSQL
2. Copy `be/appsettings.Development.example.json` ke `be/appsettings.Development.json`
3. Update password di `appsettings.Development.json`
4. Run database script:
   ```bash
   psql -U postgres -c "CREATE DATABASE \"BarcodeRestoDB\";"
   psql -U postgres -d BarcodeRestoDB -f database-setup-postgresql.sql
   ```
5. Run backend: `dotnet run`

## 🌐 Cloud Deployment (Opsional)

Jika mau deploy ke cloud (Supabase/Neon):
1. Baca dokumentasi: `POSTGRESQL_MIGRATION.md`
2. Buat database di Supabase (gratis)
3. Update connection string di `appsettings.json` (untuk production)

## ✅ Checklist

- [x] PostgreSQL installed (version 18)
- [x] Database `BarcodeRestoDB` created
- [x] All tables created
- [x] Sample data inserted
- [x] Connection string configured
- [x] Backend tested successfully
- [ ] Frontend tested (silahkan test sendiri)
- [ ] Admin login tested (silahkan test sendiri)

---

**Setup selesai! Database PostgreSQL siap digunakan.** 🚀

Jika ada masalah, cek dokumentasi lengkap di `POSTGRESQL_MIGRATION.md`.
