# Migrasi dari SQL Server ke PostgreSQL

## 🎯 Alasan Migrasi

Feedback dari mentor:
> "Ini databasenya pakai SQL Server? Mungkin bisa diubah pakai ke PostgreSQL biar bisa ditaruh di cloud nanti"

**Keuntungan PostgreSQL:**
- ✅ **Gratis & Open Source** - Tidak ada biaya lisensi
- ✅ **Cloud-Ready** - Mudah deploy ke berbagai platform cloud
- ✅ **Free Tier Hosting** - Tersedia di Supabase, Neon, Railway, Render, dll
- ✅ **Cross-Platform** - Berjalan di Windows, Linux, macOS
- ✅ **Production-Ready** - Digunakan oleh perusahaan besar

## 📋 Perubahan yang Dilakukan

### 1. **Backend Dependencies** (`be/be.csproj`)
```xml
<!-- SEBELUM -->
<PackageReference Include="Microsoft.EntityFrameworkCore.SqlServer" Version="10.0.0" />

<!-- SESUDAH -->
<PackageReference Include="Npgsql.EntityFrameworkCore.PostgreSQL" Version="10.0.0" />
```

### 2. **Database Provider** (`be/Program.cs`)
```csharp
// SEBELUM
options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"))

// SESUDAH
options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"))
```

### 3. **Connection String** (`be/appsettings.json`)
```json
// SEBELUM (SQL Server)
"DefaultConnection": "Data Source=.;Initial Catalog=BarcodeRestoDB;Integrated Security=SSPI;TrustServerCertificate=True;Encrypt=False;"

// SESUDAH (PostgreSQL)
"DefaultConnection": "Host=localhost;Port=5432;Database=BarcodeRestoDB;Username=postgres;Password=postgres"
```

### 4. **Database Script**
- **SQL Server**: `database-setup-complete.sql` (tetap ada untuk referensi)
- **PostgreSQL**: `database-setup-postgresql.sql` (script baru)

**Perbedaan sintaks:**
- `IDENTITY(1,1)` → `SERIAL`
- `NVARCHAR` → `VARCHAR`
- `BIT` → `BOOLEAN`
- `GETDATE()` → `CURRENT_TIMESTAMP`
- `DATEADD()` → `INTERVAL`
- Table names menggunakan double quotes: `"Admins"`, `"Products"`, dll

## 🚀 Cara Setup PostgreSQL

### Opsi 1: Install PostgreSQL Lokal (Development)

#### Windows:
1. Download PostgreSQL: https://www.postgresql.org/download/windows/
2. Install dengan pengaturan default
3. Ingat password untuk user `postgres`
4. PostgreSQL akan berjalan di port **5432**

#### Atau menggunakan Docker:
```bash
docker run --name postgres-mannis -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:16
```

### Opsi 2: Cloud PostgreSQL (Production)

#### **Supabase** (Rekomendasi - Paling Mudah)
1. Buat akun di https://supabase.com (Gratis)
2. Create new project
3. Tunggu database provisioning (~2 menit)
4. Copy connection string dari Settings → Database
5. Paste ke `appsettings.json`

**Connection String Format Supabase:**
```
Host=db.xxxxxxxxxxxxx.supabase.co;Port=5432;Database=postgres;Username=postgres;Password=your-password;SSL Mode=Require
```

#### **Neon** (Serverless PostgreSQL)
1. Buat akun di https://neon.tech (Gratis)
2. Create project
3. Copy connection string
4. Free tier: 0.5 GB storage, 1 project

#### **Railway** (Deploy Full-Stack)
1. Buat akun di https://railway.app
2. Deploy PostgreSQL database + backend sekaligus
3. Free tier: $5 credit per bulan

#### **Render**
1. Buat akun di https://render.com
2. Create PostgreSQL database
3. Free tier: 90 days, lalu $7/month

## 🔧 Cara Menjalankan

### 1. Install Dependencies Baru
```bash
cd be
dotnet restore
```

### 2. Setup Database

#### Jika pakai PostgreSQL Lokal:
```bash
# Login ke PostgreSQL
psql -U postgres

# Buat database
CREATE DATABASE "BarcodeRestoDB";

# Keluar dari psql
\q

# Jalankan script setup
psql -U postgres -d BarcodeRestoDB -f database-setup-postgresql.sql
```

#### Jika pakai pgAdmin (GUI):
1. Buka pgAdmin
2. Buat database baru: `BarcodeRestoDB`
3. Klik kanan database → Query Tool
4. Load file `database-setup-postgresql.sql`
5. Execute (F5)

### 3. Update Connection String

Edit `be/appsettings.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=BarcodeRestoDB;Username=postgres;Password=your_password"
  }
}
```

**Ganti `your_password`** dengan password PostgreSQL kamu!

### 4. Jalankan Backend
```bash
cd be
dotnet run
```

Backend akan berjalan di: `http://localhost:5029/swagger`

## 🧪 Testing

Setelah setup, test endpoints berikut di Swagger:

1. **GET** `/api/products` - Harus return 15 products
2. **GET** `/api/orders` - Harus return 10 orders
3. **POST** `/api/auth/login` - Login dengan `admin` / `admin123`
4. **POST** `/api/orders` - Create order baru

## 📊 Perbandingan SQL Server vs PostgreSQL

| Fitur | SQL Server | PostgreSQL |
|-------|------------|------------|
| **Lisensi** | Komersial (bayar) | Open Source (gratis) |
| **Cloud Hosting** | Azure (mahal) | Banyak opsi gratis |
| **Free Tier** | Tidak ada | Supabase, Neon, Railway |
| **Cross-Platform** | Windows only (Express) | Windows, Linux, macOS |
| **Enterprise Features** | Paywall | Gratis semua |
| **Community** | Microsoft-driven | Community-driven |

## 🌐 Deployment Options

### **Untuk Cloud Deployment:**

1. **Frontend (React)**: 
   - Vercel (Gratis)
   - Netlify (Gratis)
   - Cloudflare Pages (Gratis)

2. **Backend (.NET)**: 
   - Railway (Free tier)
   - Render (Free tier 90 days)
   - Fly.io (Free tier)
   - Azure App Service (Student free credit)

3. **Database (PostgreSQL)**:
   - Supabase (Free tier) ⭐ **Rekomendasi**
   - Neon (Free tier)
   - Railway (Free tier)

### **Setup untuk Cloud:**

1. Deploy database dulu di Supabase
2. Copy connection string dari Supabase
3. Update `appsettings.json` dengan connection string cloud
4. Deploy backend ke Railway/Render
5. Update frontend `.env` dengan URL backend cloud
6. Deploy frontend ke Vercel

## 🔐 Security Notes

### Development (Local):
```json
"DefaultConnection": "Host=localhost;Port=5432;Database=BarcodeRestoDB;Username=postgres;Password=postgres"
```

### Production (Cloud):
```json
"DefaultConnection": "Host=db.xxx.supabase.co;Port=5432;Database=postgres;Username=postgres;Password=secure-password;SSL Mode=Require"
```

**⚠️ PENTING:**
- ❌ **JANGAN** commit password ke Git
- ✅ Gunakan Environment Variables untuk production
- ✅ Enable SSL Mode untuk koneksi cloud
- ✅ Gunakan strong password

## 📝 Troubleshooting

### Error: "Npgsql not found"
```bash
cd be
dotnet restore
dotnet build
```

### Error: "Connection refused"
- Pastikan PostgreSQL service running
- Check port 5432 tidak dipakai aplikasi lain
- Verify username & password benar

### Error: "Database does not exist"
```bash
psql -U postgres
CREATE DATABASE "BarcodeRestoDB";
\q
```

### Error: "Password authentication failed"
- Cek password di connection string
- Reset password PostgreSQL jika perlu

## 🎓 Resources

- **PostgreSQL Official**: https://www.postgresql.org/docs/
- **Npgsql (EF Core Provider)**: https://www.npgsql.org/efcore/
- **Supabase Docs**: https://supabase.com/docs
- **Neon Docs**: https://neon.tech/docs
- **Railway Docs**: https://docs.railway.app/

## ✅ Checklist Migration

- [x] Update `be.csproj` dengan Npgsql package
- [x] Update `Program.cs` dari UseSqlServer ke UseNpgsql
- [x] Update connection string di `appsettings.json`
- [x] Create PostgreSQL database script
- [x] Test lokal dengan PostgreSQL
- [ ] Deploy database ke cloud (Supabase/Neon)
- [ ] Update connection string untuk production
- [ ] Deploy backend ke cloud
- [ ] Deploy frontend ke cloud
- [ ] Test end-to-end di cloud

## 🙋 FAQ

**Q: Apakah data SQL Server bisa dimigrasikan?**  
A: Ya, bisa export data dari SQL Server dan import ke PostgreSQL. Atau re-run script `database-setup-postgresql.sql`.

**Q: Apakah perlu ubah code C#?**  
A: Tidak! Entity Framework Core abstrak database operations. Code tetap sama.

**Q: Free tier cukup untuk production?**  
A: Untuk aplikasi kecil-menengah, sangat cukup. Supabase free tier bisa handle ribuan requests.

**Q: Apakah bisa pakai keduanya?**  
A: Bisa! Entity Framework Core bisa switch provider dengan ganti connection string saja.

---

**Migrasi selesai!** Database sekarang siap untuk cloud deployment 🚀
