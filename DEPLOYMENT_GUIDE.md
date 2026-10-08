# 🚀 Deployment Guide - Mannis Restaurant App

## 📦 Build Results

Build sudah selesai! File-file yang perlu di-deploy:

### Backend (.NET API)
📁 **Location:** `be/publish/`
- **Main executable:** `be.exe` (Windows) atau `be.dll` (Linux)
- **Dependencies:** Semua DLL files di folder publish
- **Configuration:** `appsettings.json`

### Frontend (React SPA)
📁 **Location:** `fe/dist/`
- **Entry point:** `index.html`
- **Static assets:** `assets/` folder
- **Runtime config:** `config.js` ⭐ (Bisa diedit setelah deploy!)

### Database
📁 **SQL Script:** `database-setup-postgresql.sql`
- Database name: `BarcodeRestoDB`
- Default admin: username `admin`, password `admin123`

---

## ⚙️ Configuration

### 🔧 Backend Configuration

**File:** `be/publish/appsettings.json`

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=BarcodeRestoDB;Username=postgres;Password=your_password"
  },
  "Jwt": {
    "Key": "MannisSuperSecretKeyForJwtTokenGeneration12345",
    "Issuer": "MannisRestaurantApp",
    "Audience": "MannisRestaurantApp",
    "ExpiryInHours": 24
  }
}
```

**Yang perlu diganti:**
- `ConnectionStrings:DefaultConnection` → Sesuaikan dengan PostgreSQL server
- `Jwt:Key` → Ganti dengan secret key production (minimal 32 karakter)

---

### 🎨 Frontend Configuration

**File:** `fe/dist/config.js` ⭐

```javascript
// Runtime Configuration
// File ini bisa diedit langsung di server setelah deploy
window.APP_CONFIG = {
  API_BASE_URL: 'http://localhost:5029'
};
```

**✅ Cara Setting API URL Setelah Deploy:**

1. Buka file `fe/dist/config.js`
2. Edit `API_BASE_URL` sesuai URL backend production:
   ```javascript
   window.APP_CONFIG = {
     API_BASE_URL: 'https://api-server.com'  // ← Ganti ini
   };
   ```
3. Save file
4. Refresh browser (tidak perlu rebuild!)

**Keuntungan:** API URL bisa diganti kapan saja tanpa rebuild frontend! 🎉

---

## 🖥️ Deployment Steps

### 1️⃣ Deploy Database

```bash
# Login ke PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE "BarcodeRestoDB";

# Run setup script
\c BarcodeRestoDB
\i database-setup-postgresql.sql
```

### 2️⃣ Deploy Backend

**Windows Server (IIS):**
1. Copy folder `be/publish/` ke server
2. Edit `appsettings.json` (connection string & JWT key)
3. Buat IIS Application Pool (.NET 10)
4. Setup IIS Site pointing ke publish folder

**Linux Server:**
1. Copy folder `be/publish/` ke server
2. Edit `appsettings.json`
3. Run dengan systemd:
   ```bash
   dotnet be.dll --urls http://0.0.0.0:5029
   ```

### 3️⃣ Deploy Frontend

**Copy folder `fe/dist/` ke web server:**

**Nginx:**
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    root /path/to/fe/dist;
    index index.html;
    
    # React Router support
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

**IIS:**
1. Copy `fe/dist/` ke `C:\inetpub\wwwroot\mannis`
2. Create new IIS Site
3. Install URL Rewrite module
4. Add web.config untuk React Router

**Apache:**
```apache
<VirtualHost *:80>
    DocumentRoot /path/to/fe/dist
    
    <Directory /path/to/fe/dist>
        RewriteEngine On
        RewriteBase /
        RewriteRule ^index\.html$ - [L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /index.html [L]
    </Directory>
</VirtualHost>
```

### 4️⃣ Configure API URL

**Setelah backend deployed, update frontend config:**

```bash
# Edit file di server
nano /path/to/fe/dist/config.js

# Change API URL
window.APP_CONFIG = {
  API_BASE_URL: 'http://backend-server-ip:5029'
};
```

---

## 🔒 Security Checklist

- [ ] Ganti JWT secret key di `appsettings.json`
- [ ] Ganti default admin password (`admin123`)
- [ ] Setup HTTPS/SSL certificate
- [ ] Configure CORS untuk production domain
- [ ] Secure PostgreSQL dengan firewall rules
- [ ] Set proper file permissions (644 untuk files, 755 untuk folders)

---

## 📋 Environment Requirements

**Backend:**
- .NET 10 Runtime
- PostgreSQL 14+
- Port 5029 (atau custom)

**Frontend:**
- Web server (Nginx/IIS/Apache)
- Port 80/443

---

## 🧪 Testing After Deploy

1. **Database:** Connect dengan psql dan check tables exist
2. **Backend:** Hit `http://api-url/swagger` → Should show API docs
3. **Frontend:** Open `http://frontend-url` → Should load menu
4. **Login:** Try login at `/admin/login` → Should redirect to dashboard
5. **JWT:** Check Network tab → Should see `Authorization: Bearer ...` header

---

## 🆘 Troubleshooting

**Problem:** Frontend can't connect to backend
- **Solution:** Check `config.js` API URL, check CORS settings in backend

**Problem:** 401 Unauthorized on admin pages
- **Solution:** Clear localStorage, login again

**Problem:** Database connection error
- **Solution:** Check connection string in `appsettings.json`, verify PostgreSQL running

**Problem:** Static files not loading
- **Solution:** Check web server mime types, verify file permissions

---

## 📞 Contact

Jika ada pertanyaan saat deployment:
- Developer: Nidhom
- Repository: [GitHub URL]

---

**Deployment Date:** [Fill after deployed]  
**Deployed By:** [Name]  
**Production URLs:**
- Frontend: [URL]
- Backend API: [URL]
