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
- **SQL Server** - Database
- **RESTful API** - Arsitektur API

## 📁 Struktur Project

```
mannis-restaurant-app/
├── be/                          # Backend (.NET Core)
│   ├── Controllers/            # API Controllers
│   │   ├── AuthController.cs
│   │   ├── ProductsController.cs
│   │   ├── OrdersController.cs
│   │   └── DashboardController.cs
│   ├── Models/                 # Data Models
│   │   ├── Admin.cs
│   │   ├── Product.cs
│   │   ├── Order.cs
│   │   └── OrderDetail.cs
│   ├── Data/                   # Database Context
│   │   └── AppDbContext.cs
│   └── Program.cs              # Entry Point
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
- SQL Server (atau SQL Server Express)

### 1. Setup Database

```sql
-- Buat database
CREATE DATABASE BarcodeRestoDB;

-- Gunakan database
USE BarcodeRestoDB;

-- Buat tabel Admins
CREATE TABLE Admins (
    AdminId INT PRIMARY KEY IDENTITY(1,1),
    Username NVARCHAR(50) NOT NULL UNIQUE,
    Password NVARCHAR(255) NOT NULL
);

-- Buat tabel Products
CREATE TABLE Products (
    ProductId INT PRIMARY KEY IDENTITY(1,1),
    ProductName NVARCHAR(100) NOT NULL,
    Category NVARCHAR(50) NOT NULL,
    Price DECIMAL(18,2) NOT NULL,
    Description NVARCHAR(500),
    ImageUrl NVARCHAR(500),
    IsAvailable BIT NOT NULL DEFAULT 1
);

-- Buat tabel Orders
CREATE TABLE Orders (
    OrderId INT PRIMARY KEY IDENTITY(1,1),
    TableNumber NVARCHAR(10) NOT NULL,
    TotalAmount DECIMAL(18,2) NOT NULL,
    PaymentStatus NVARCHAR(20) NOT NULL,
    OrderDate DATETIME NOT NULL DEFAULT GETDATE()
);

-- Buat tabel OrderDetails
CREATE TABLE OrderDetails (
    OrderDetailId INT PRIMARY KEY IDENTITY(1,1),
    OrderId INT NOT NULL,
    ProductId INT NOT NULL,
    Quantity INT NOT NULL,
    Price DECIMAL(18,2) NOT NULL,
    FOREIGN KEY (OrderId) REFERENCES Orders(OrderId),
    FOREIGN KEY (ProductId) REFERENCES Products(ProductId)
);

-- Insert admin default (password: admin123)
INSERT INTO Admins (Username, Password) 
VALUES ('admin', 'admin123');
```

### 2. Setup Backend

```bash
# Masuk ke folder backend
cd be

# Update connection string di appsettings.json
# Sesuaikan dengan SQL Server kamu

# Restore dependencies
dotnet restore

# Jalankan aplikasi
dotnet run --urls "http://0.0.0.0:5029"
```

Backend akan berjalan di: **http://localhost:5029**

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
