================================================================================
  MANNIS RESTAURANT APP - BUILD ARTIFACTS
  Developer: Nidhom
  Build Date: 8 Oktober 2026
================================================================================

DAFTAR FILE ZIP:
----------------

1. backend-build.zip (5.37 MB)
   ├─ Isi: Aplikasi backend .NET yang sudah di-compile
   ├─ Cara Deploy: 
   │  - Extract ke folder server
   │  - Edit appsettings.json (database connection string)
   │  - Run: be.exe (Windows) atau dotnet be.dll (Linux)
   └─ Test: http://localhost:5029/swagger

2. frontend-build.zip (0.1 MB)
   ├─ Isi: Website React yang sudah di-build
   ├─ Cara Deploy:
   │  - Extract ke web server folder
   │  - Edit config.js (API_BASE_URL)
   │  - Setup Nginx/IIS/Apache point ke folder ini
   └─ Test: http://localhost

3. database-and-docs.zip (0.01 MB)
   ├─ Isi: 
   │  - database-setup-postgresql.sql (Script create database)
   │  - DEPLOYMENT_GUIDE.md (Panduan lengkap deployment)
   │  - HASIL_BUILD.md (Penjelasan hasil build)
   └─ Run script di PostgreSQL untuk setup database

================================================================================

QUICK START:
------------

1. Setup Database:
   psql -U postgres -d BarcodeRestoDB -f database-setup-postgresql.sql

2. Deploy Backend:
   - Extract backend-build.zip
   - Edit appsettings.json
   - Run be.exe

3. Deploy Frontend:
   - Extract frontend-build.zip
   - Edit config.js (ganti API_BASE_URL)
   - Point web server ke folder ini

4. Test:
   - Frontend: http://[server-ip]
   - Backend API: http://[server-ip]:5029/swagger
   - Login Admin: username=admin, password=admin123

================================================================================

CARA SETTING API URL (PENTING!):
---------------------------------

File: frontend-build.zip -> config.js

Edit:
window.APP_CONFIG = {
  API_BASE_URL: 'http://192.168.x.x:5029'  // <- Ganti dengan IP server backend
};

Save -> Refresh browser -> DONE!

================================================================================

TECH STACK:
-----------
- Backend: .NET Core 10 + PostgreSQL
- Frontend: React + TypeScript
- Authentication: JWT Bearer Token
- Database: PostgreSQL

================================================================================

CONTACT:
--------
Developer: Nidhom
Repository: https://github.com/nidhommuzaky25-cell/mannis-restaurant-app

Jika ada pertanyaan saat deployment, silahkan hubungi developer.

================================================================================
