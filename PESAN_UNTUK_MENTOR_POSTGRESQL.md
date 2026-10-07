# Pesan untuk Mentor - Migrasi PostgreSQL

Selamat pagi Kak,

Saya telah menyelesaikan migrasi database dari **SQL Server ke PostgreSQL** sesuai feedback yang diberikan.

## Feedback yang Diterima
> **"Ini databasenya pakai SQL Server? Mungkin bisa diubah pakai ke PostgreSQL biar bisa ditaruh di cloud nanti"**

## ✅ Yang Sudah Dilakukan

### 1. **Backend Migration**
- ✅ Replace package `Microsoft.EntityFrameworkCore.SqlServer` dengan `Npgsql.EntityFrameworkCore.PostgreSQL`
- ✅ Update `Program.cs`: `UseSqlServer()` → `UseNpgsql()`
- ✅ Update connection string di `appsettings.json` ke format PostgreSQL
- ✅ Test build berhasil tanpa error

### 2. **Database Script**
- ✅ Create `database-setup-postgresql.sql` dengan syntax PostgreSQL
- ✅ Semua sample data (15 products, 10 orders) sudah included
- ✅ Support ON CONFLICT untuk idempotent execution

### 3. **Dokumentasi Lengkap**
- ✅ `POSTGRESQL_MIGRATION.md` - Panduan lengkap migrasi & deployment
- ✅ `README.md` - Updated dengan instruksi PostgreSQL
- ✅ Perbandingan SQL Server vs PostgreSQL
- ✅ Panduan cloud deployment (Supabase, Neon, Railway)

## 🚀 Keuntungan PostgreSQL untuk Cloud Deployment

| Aspek | SQL Server | PostgreSQL |
|-------|------------|------------|
| **Hosting Gratis** | ❌ Tidak ada | ✅ Banyak (Supabase, Neon, Railway) |
| **Biaya** | Mahal (Azure) | Gratis untuk tier dasar |
| **Setup Cloud** | Kompleks | Mudah (1-2 menit) |
| **Cross-Platform** | Windows only | Windows, Linux, macOS |
| **Open Source** | ❌ Proprietary | ✅ Fully open source |

## 📋 Cara Setup (Pilih Salah Satu)

### Opsi 1: **PostgreSQL Lokal** (Development)

1. Install PostgreSQL: https://www.postgresql.org/download/
2. Atau pakai Docker:
   ```bash
   docker run --name postgres-mannis -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:16
   ```
3. Run setup script:
   ```bash
   psql -U postgres -d BarcodeRestoDB -f database-setup-postgresql.sql
   ```

### Opsi 2: **Supabase** (Cloud - Rekomendasi) ⭐

**Paling mudah dan GRATIS selamanya:**

1. Buka https://supabase.com dan sign up
2. Click "New Project"
3. Isi:
   - Project name: `mannis-restaurant`
   - Database password: (buat strong password)
   - Region: Southeast Asia (Singapore)
4. Wait ~2 menit sampai database ready
5. Go to Settings → Database
6. Copy connection string (pilih format: .NET)
7. Paste ke `be/appsettings.json`

**Format connection string Supabase:**
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=db.xxxxxxxxxxxxx.supabase.co;Port=5432;Database=postgres;Username=postgres;Password=your-password;SSL Mode=Require"
  }
}
```

8. Run script SQL di Supabase SQL Editor (copy-paste `database-setup-postgresql.sql`)

**Free Tier Supabase:**
- ✅ 500 MB database
- ✅ Unlimited API requests
- ✅ 1 GB file storage
- ✅ 2 GB bandwidth/month
- ✅ SSL/TLS encryption
- ✅ Auto backups

### Opsi 3: **Neon** (Serverless PostgreSQL)

1. Buka https://neon.tech
2. Sign up & create project
3. Copy connection string
4. Free tier: 0.5 GB storage, 1 project

### Opsi 4: **Railway** (All-in-One)

1. Buka https://railway.app
2. Deploy PostgreSQL + Backend sekaligus
3. Free tier: $5 credit per month

## 🔧 Cara Menjalankan

### 1. Clone & Install
```bash
git clone https://github.com/nidhommuzaky25-cell/mannis-restaurant-app.git
cd mannis-restaurant-app/be
dotnet restore
```

### 2. Setup Connection String

Edit `be/appsettings.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=BarcodeRestoDB;Username=postgres;Password=your_password"
  }
}
```

### 3. Run Backend
```bash
dotnet run
```

Backend: http://localhost:5029/swagger

### 4. Run Frontend
```bash
cd fe
npm install
npm run dev
```

Frontend: http://localhost:5173

## 📊 Perubahan Code

### `be/be.csproj`
```diff
- <PackageReference Include="Microsoft.EntityFrameworkCore.SqlServer" Version="10.0.0" />
+ <PackageReference Include="Npgsql.EntityFrameworkCore.PostgreSQL" Version="10.0.0" />
```

### `be/Program.cs`
```diff
- options.UseSqlServer(...)
+ options.UseNpgsql(...)
```

### `be/appsettings.json`
```diff
- "DefaultConnection": "Data Source=.;Initial Catalog=BarcodeRestoDB;..."
+ "DefaultConnection": "Host=localhost;Port=5432;Database=BarcodeRestoDB;..."
```

## 🌐 Roadmap Cloud Deployment

Setelah PostgreSQL ready, full-stack bisa di-deploy:

1. **Database**: Supabase ✅ (sudah siap)
2. **Backend**: Railway / Render / Fly.io (gratis)
3. **Frontend**: Vercel / Netlify / Cloudflare Pages (gratis)

**Total cost: GRATIS untuk tier dasar!**

## 📝 Files yang Diupdate

- `be/be.csproj` - PostgreSQL package
- `be/Program.cs` - UseNpgsql
- `be/appsettings.json` - PostgreSQL connection string
- `database-setup-postgresql.sql` - New script
- `POSTGRESQL_MIGRATION.md` - Full documentation
- `README.md` - Updated instructions

## 🔗 Link Repository

**GitHub**: https://github.com/nidhommuzaky25-cell/mannis-restaurant-app

Semua changes sudah di-push dengan commit message:
```
feat: Migrate from SQL Server to PostgreSQL for cloud deployment
```

## 📖 Dokumentasi Lengkap

Untuk panduan detail, lihat file:
- **`POSTGRESQL_MIGRATION.md`** - Migrasi lengkap & troubleshooting
- **`README.md`** - Quick start guide
- **`database-setup-postgresql.sql`** - Database script

## ❓ FAQ untuk Mentor

**Q: Apakah data lama bisa dimigrasikan?**  
A: Ya, bisa export dari SQL Server dan import ke PostgreSQL. Atau cukup run script baru karena data masih sample.

**Q: Apakah perlu ubah code aplikasi?**  
A: Tidak! Hanya ganti package & connection string. Entity Framework Core handle sisanya.

**Q: Performance PostgreSQL vs SQL Server?**  
A: PostgreSQL lebih cepat untuk read-heavy operations dan better untuk concurrent connections.

**Q: Apakah bisa rollback ke SQL Server?**  
A: Bisa! Tinggal ganti package & connection string kembali. Code tidak berubah.

**Q: Recommended untuk production?**  
A: **Supabase** - Paling mudah, gratis, dan feature-rich. Bisa langsung production.

## 🙏 Next Steps

1. Review perubahan di GitHub
2. Pilih opsi setup (Lokal / Supabase / Neon / Railway)
3. Test backend dengan database baru
4. Jika OK, bisa lanjut ke cloud deployment

Jika ada pertanyaan atau feedback, saya siap untuk diskusi lebih lanjut!

---

**Nidhom Muzaky**  
**GitHub**: [@nidhommuzaky25-cell](https://github.com/nidhommuzaky25-cell)  
**Repository**: [mannis-restaurant-app](https://github.com/nidhommuzaky25-cell/mannis-restaurant-app)
