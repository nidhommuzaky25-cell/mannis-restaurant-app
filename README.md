# 🍽️ Mannis Restaurant App

Aplikasi pemesanan makanan digital untuk restoran dengan sistem barcode QR untuk kemudahan pemesanan di meja. Dibangun dengan teknologi modern untuk memberikan pengalaman pemesanan yang cepat, efisien, dan user-friendly.

## ✨ Fitur Utama

### 👥 Customer Portal
- **Scan & Order**: Pelanggan dapat scan QR code di meja untuk langsung masuk ke menu
- **Menu Digital**: Tampilan menu yang menarik dengan gambar dan deskripsi lengkap
- **Real-time Cart**: Keranjang belanja interaktif dengan live update
- **Detail Menu**: Modal detail untuk setiap item dengan opsi catatan khusus
- **Checkout**: Proses checkout yang simple dan intuitif
- **Order Confirmation**: Halaman konfirmasi pesanan dengan struk digital

### 🔧 Admin Dashboard
- **Dashboard Analytics**: Overview statistik penjualan dan pesanan
- **Order Management**: Kelola status pesanan secara real-time
- **Inventory Management**: CRUD produk dengan upload gambar
- **Authentication**: Sistem login admin yang aman

## 🛠️ Tech Stack

### Frontend
- **React 18** + **TypeScript**
- **Vite** - Build tool yang super cepat
- **React Router** - Routing dan navigasi
- **Tailwind CSS** - Styling modern dan responsive
- **Axios** - HTTP client

### Backend
- **ASP.NET Core 10** (C#)
- **Entity Framework Core** - ORM
- **PostgreSQL** - Database (Cloud-ready)
- **RESTful API** - Arsitektur API
- **Clean Architecture** - Repository Pattern & Service Layer

## 📁 Struktur Project

```
mannis-restaurant-app/
├── be/                          # Backend (.NET Core)
│   ├── Controllers/            # API Controllers (HTTP Layer)
│   │   ├── AuthController.cs
│   │   ├── ProductsController.cs
│   │   ├── OrdersController.cs
│   │   └── DashboardController.cs
│   ├── Services/               # Business Logic Layer
│   │   ├── AuthService.cs
│   │   ├── ProductService.cs
│   │   ├── OrderService.cs
│   │   └── DashboardService.cs
│   ├── Repositories/           # Data Access Layer
│   │   ├── AdminRepository.cs
│   │   ├── ProductRepository.cs
│   │   └── OrderRepository.cs
│   ├── Models/                 # Data Models
│   │   ├── Admin.cs
│   │   ├── Product.cs
│   │   ├── Order.cs
│   │   └── OrderDetail.cs
│   ├── DTOs/                   # Data Transfer Objects
│   ├── Data/                   # Database Context
│   │   └── AppDbContext.cs
│   ├── ARCHITECTURE.md         # Dokumentasi Arsitektur
│   └── Program.cs              # Entry Point & DI Configuration
│
└── fe/                          # Frontend (React + Vite)
    ├── src/
    │   ├── pages/              # React Pages
    │   │   ├── Menu.tsx        # Halaman menu customer
    │   │   ├── MenuDetail.tsx  # Modal detail menu
    │   │   ├── Checkout.tsx    # Halaman checkout
    │   │   ├── OrderSuccess.tsx # Konfirmasi pesanan
    │   │   └── admin/          # Admin pages
    │   │       ├── AdminLogin.tsx
    │   │       ├── AdminDashboard.tsx
    │   │       ├── AdminOrders.tsx
    │   │       └── AdminInventory.tsx
    │   ├── App.tsx
    │   └── main.tsx
    └── public/
```

## 🚀 Cara Menjalankan

### Prerequisites
- Node.js (v18 atau lebih tinggi)
- .NET SDK 10.0
- PostgreSQL 14+ (atau gunakan cloud: Supabase, Neon, Railway)

### 1. Setup Database

**Opsi A: PostgreSQL Lokal (Development)**

Install PostgreSQL dari https://www.postgresql.org/download/ atau gunakan Docker:
```bash
docker run --name postgres-mannis -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:16
```

Jalankan setup script:
```bash
psql -U postgres -d BarcodeRestoDB -f database-setup-postgresql.sql
```

**Opsi B: Cloud PostgreSQL (Recommended untuk Production)**

1. Buat database gratis di [Supabase](https://supabase.com) atau [Neon](https://neon.tech)
2. Copy connection string
3. Update `be/appsettings.json`

Lihat panduan lengkap di: **[POSTGRESQL_MIGRATION.md](POSTGRESQL_MIGRATION.md)**

### 2. Setup Backend

```bash
# Masuk ke folder backend
cd be

# Update connection string di appsettings.json
# Format PostgreSQL:
# "Host=localhost;Port=5432;Database=BarcodeRestoDB;Username=postgres;Password=your_password"

# Restore dependencies
dotnet restore

# Jalankan aplikasi
dotnet run
```

Backend akan berjalan di: **http://localhost:5029/swagger**

### 3. Setup Frontend

```bash
# Masuk ke folder frontend
cd fe

# Install dependencies
npm install

# Jalankan development server
npm run dev
```

Frontend akan berjalan di: **http://localhost:5173**

## 🏗️ Backend Architecture

Project ini menggunakan **Clean Architecture** dengan 3 layer utama:

### 1. Controllers (Presentation Layer)
- Handle HTTP requests/responses
- Input validation
- Delegate logic ke Services

### 2. Services (Business Logic Layer)  
- Business rules dan validasi kompleks
- Koordinasi antar repositories
- Transform data untuk kebutuhan bisnis

### 3. Repositories (Data Access Layer)
- Database operations (CRUD)
- Query building
- Data persistence

**Keuntungan:**
- ✅ Separation of Concerns
- ✅ Easy to Test (mockable dependencies)
- ✅ Maintainable & Scalable
- ✅ Reusable components

📖 **Lihat detail lengkap di [be/ARCHITECTURE.md](be/ARCHITECTURE.md)**

## 🎨 Design System

### Color Palette
- **Primary**: `#B8A98C` (Tan/Beige) - Warna utama untuk button dan accent
- **Secondary**: `#F5F1EC` (Light Beige) - Background untuk card dan section
- **Background**: `#FFFFFF` (White) - Background utama
- **Text**: `#2E2520` (Dark Brown) - Warna teks utama

### Typography
- **Logo**: Serif font untuk kesan elegan
- **Body**: Sans-serif untuk readability

## 📱 Screenshots

### Customer View
- Menu dengan kategori (Makanan Berat, Makanan Ringan, Minuman)
- Responsive design untuk mobile dan desktop
- Shopping cart dengan live update
- Struk digital setelah order

### Admin Panel
- Dashboard dengan statistik real-time
- Manajemen pesanan dengan filter status
- CRUD inventory produk
- Responsive sidebar navigation

## 🔐 Default Credentials

**Admin Login:**
- Username: `admin`
- Password: `admin123`

⚠️ **Penting**: Ganti password default setelah deployment!

## 📝 API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/{id}` - Get product by ID
- `GET /api/products?search={keyword}` - Search products
- `POST /api/products` - Create new product (Admin)
- `PUT /api/products/{id}` - Update product (Admin)
- `DELETE /api/products/{id}` - Delete product (Admin)

### Orders
- `GET /api/orders` - Get all orders (Admin)
- `GET /api/orders?search={orderId}` - Get order by ID
- `POST /api/orders` - Create new order
- `PUT /api/orders/{id}` - Update order status (Admin)

### Dashboard
- `GET /api/dashboard/summary` - Get dashboard summary (Admin)
- `GET /api/dashboard/recent-orders` - Get recent orders (Admin)

### Auth
- `POST /api/auth/login` - Admin login

## 🚧 Roadmap

- [ ] Integrasi payment gateway
- [ ] Notifikasi real-time dengan SignalR
- [ ] Export laporan ke PDF/Excel
- [ ] Multi-language support
- [ ] Dark mode theme
- [ ] Mobile app (React Native)

## 👨‍💻 Developer

**Nidhom Muzaky**
- GitHub: [@nidhommuzaky25-cell](https://github.com/nidhommuzaky25-cell)

## 📄 License

MIT License - silahkan gunakan untuk keperluan komersial atau personal.

## 🙏 Acknowledgments

- Design inspiration dari modern restaurant apps
- Icons dari Heroicons
- Images dari Unsplash

---

⭐ **Jika project ini membantu, jangan lupa kasih star ya!** ⭐
