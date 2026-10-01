-- ===================================
-- SETUP DATABASE MANNIS RESTAURANT
-- ===================================

-- Buat database
CREATE DATABASE BarcodeRestoDB;
GO

-- Gunakan database
USE BarcodeRestoDB;
GO

-- ===================================
-- 1. BUAT TABEL
-- ===================================

-- Tabel Admins
CREATE TABLE Admins (
    AdminId INT PRIMARY KEY IDENTITY(1,1),
    Username NVARCHAR(50) NOT NULL UNIQUE,
    Password NVARCHAR(255) NOT NULL
);

-- Tabel Products
CREATE TABLE Products (
    ProductId INT PRIMARY KEY IDENTITY(1,1),
    ProductName NVARCHAR(100) NOT NULL,
    Category NVARCHAR(50) NOT NULL,
    Price DECIMAL(18,2) NOT NULL,
    Description NVARCHAR(500),
    ImageUrl NVARCHAR(500),
    IsAvailable BIT NOT NULL DEFAULT 1
);

-- Tabel Orders
CREATE TABLE Orders (
    OrderId INT PRIMARY KEY IDENTITY(1,1),
    TableNumber NVARCHAR(10) NOT NULL,
    TotalAmount DECIMAL(18,2) NOT NULL,
    PaymentStatus NVARCHAR(20) NOT NULL,
    OrderDate DATETIME NOT NULL DEFAULT GETDATE()
);

-- Tabel OrderDetails
CREATE TABLE OrderDetails (
    OrderDetailId INT PRIMARY KEY IDENTITY(1,1),
    OrderId INT NOT NULL,
    ProductId INT NOT NULL,
    Quantity INT NOT NULL,
    Price DECIMAL(18,2) NOT NULL,
    FOREIGN KEY (OrderId) REFERENCES Orders(OrderId),
    FOREIGN KEY (ProductId) REFERENCES Products(ProductId)
);

-- ===================================
-- 2. INSERT DATA ADMIN
-- ===================================

INSERT INTO Admins (Username, Password) 
VALUES ('admin', 'admin123');

-- ===================================
-- 3. INSERT SAMPLE PRODUCTS
-- ===================================

-- MAKANAN BERAT (5 items)
INSERT INTO Products (ProductName, Category, Price, Description, ImageUrl, IsAvailable)
VALUES 
('Nasi Goreng Spesial', 'Makanan Berat', 25000, 'Nasi goreng dengan telur, ayam, dan sayuran segar', 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=400&fit=crop', 1),
('Mie Goreng Jawa', 'Makanan Berat', 22000, 'Mie goreng khas Jawa dengan bumbu rempah', 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&h=400&fit=crop', 1),
('Nasi Ayam Geprek', 'Makanan Berat', 28000, 'Ayam crispy geprek dengan sambal pedas level 1-5', 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=400&h=400&fit=crop', 1),
('Soto Ayam Lamongan', 'Makanan Berat', 23000, 'Soto ayam khas Lamongan dengan kuah bening segar', 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400&h=400&fit=crop', 1),
('Rawon Daging Sapi', 'Makanan Berat', 30000, 'Rawon khas Jawa Timur dengan daging empuk', 'https://images.unsplash.com/photo-1588137378633-dea1336ce1e2?w=400&h=400&fit=crop', 1);

-- MAKANAN RINGAN (5 items)
INSERT INTO Products (ProductName, Category, Price, Description, ImageUrl, IsAvailable)
VALUES 
('French Fries', 'Makanan Ringan', 15000, 'Kentang goreng crispy dengan saus sambal dan mayones', 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=400&fit=crop', 1),
('Chicken Nuggets', 'Makanan Ringan', 18000, 'Nugget ayam crispy isi 8 pcs dengan saus pilihan', 'https://images.unsplash.com/photo-1562967914-608f82629710?w=400&h=400&fit=crop', 1),
('Pisang Goreng Keju', 'Makanan Ringan', 12000, 'Pisang goreng crispy dengan topping keju meleleh', 'https://images.unsplash.com/photo-1625937286074-9ca519d5d9df?w=400&h=400&fit=crop', 1),
('Tahu Crispy', 'Makanan Ringan', 10000, 'Tahu goreng crispy dengan saus kacang pedas', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop', 1),
('Spring Roll', 'Makanan Ringan', 16000, 'Lumpia goreng isi sayuran dengan saus asam manis', 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=400&fit=crop', 1);

-- MINUMAN (5 items)
INSERT INTO Products (ProductName, Category, Price, Description, ImageUrl, IsAvailable)
VALUES 
('Es Teh Manis', 'Minuman', 5000, 'Teh manis dingin segar', 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=400&fit=crop', 1),
('Es Jeruk', 'Minuman', 8000, 'Jus jeruk segar dengan es batu', 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=400&fit=crop', 1),
('Kopi Susu Gula Aren', 'Minuman', 15000, 'Kopi susu dengan gula aren premium', 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=400&fit=crop', 1),
('Cappuccino', 'Minuman', 18000, 'Cappuccino dengan foam susu halus', 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=400&fit=crop', 1),
('Thai Tea', 'Minuman', 12000, 'Thai tea dingin dengan susu kental manis', 'https://images.unsplash.com/photo-1578899952107-9d9d6b8c6ac7?w=400&h=400&fit=crop', 1);

-- ===================================
-- 4. INSERT SAMPLE ORDERS
-- ===================================

-- Order 1: Meja 01 - Belum Bayar
INSERT INTO Orders (TableNumber, TotalAmount, PaymentStatus, OrderDate)
VALUES ('01', 53000, 'Belum Bayar', DATEADD(HOUR, -2, GETDATE()));

INSERT INTO OrderDetails (OrderId, ProductId, Quantity, Price)
VALUES 
(1, 1, 1, 25000),  -- Nasi Goreng Spesial
(1, 6, 1, 15000),  -- French Fries
(1, 11, 1, 5000),  -- Es Teh Manis
(1, 12, 1, 8000);  -- Es Jeruk

-- Order 2: Meja 03 - Lunas
INSERT INTO Orders (TableNumber, TotalAmount, PaymentStatus, OrderDate)
VALUES ('03', 76000, 'Lunas', DATEADD(HOUR, -5, GETDATE()));

INSERT INTO OrderDetails (OrderId, ProductId, Quantity, Price)
VALUES 
(2, 3, 2, 28000),  -- Nasi Ayam Geprek x2
(2, 13, 2, 15000); -- Kopi Susu Gula Aren x2

-- Order 3: Meja 05 - Lunas
INSERT INTO Orders (TableNumber, TotalAmount, PaymentStatus, OrderDate)
VALUES ('05', 91000, 'Lunas', DATEADD(HOUR, -8, GETDATE()));

INSERT INTO OrderDetails (OrderId, ProductId, Quantity, Price)
VALUES 
(3, 5, 2, 30000),  -- Rawon Daging Sapi x2
(3, 7, 1, 18000),  -- Chicken Nuggets
(3, 11, 3, 5000);  -- Es Teh Manis x3

-- Order 4: Meja 02 - Belum Bayar
INSERT INTO Orders (TableNumber, TotalAmount, PaymentStatus, OrderDate)
VALUES ('02', 45000, 'Belum Bayar', DATEADD(HOUR, -1, GETDATE()));

INSERT INTO OrderDetails (OrderId, ProductId, Quantity, Price)
VALUES 
(4, 2, 1, 22000),  -- Mie Goreng Jawa
(4, 8, 1, 12000),  -- Pisang Goreng Keju
(4, 11, 1, 5000),  -- Es Teh Manis
(4, 12, 1, 8000);  -- Es Jeruk

-- Order 5: Meja 07 - Lunas
INSERT INTO Orders (TableNumber, TotalAmount, PaymentStatus, OrderDate)
VALUES ('07', 64000, 'Lunas', DATEADD(DAY, -1, GETDATE()));

INSERT INTO OrderDetails (OrderId, ProductId, Quantity, Price)
VALUES 
(5, 1, 1, 25000),  -- Nasi Goreng Spesial
(5, 4, 1, 23000),  -- Soto Ayam Lamongan
(5, 10, 1, 16000); -- Spring Roll

-- Order 6: Meja 04 - Lunas
INSERT INTO Orders (TableNumber, TotalAmount, PaymentStatus, OrderDate)
VALUES ('04', 82000, 'Lunas', DATEADD(DAY, -2, GETDATE()));

INSERT INTO OrderDetails (OrderId, ProductId, Quantity, Price)
VALUES 
(6, 3, 2, 28000),  -- Nasi Ayam Geprek x2
(6, 14, 1, 18000), -- Cappuccino
(6, 12, 1, 8000);  -- Es Jeruk

-- Order 7: Meja 08 - Lunas
INSERT INTO Orders (TableNumber, TotalAmount, PaymentStatus, OrderDate)
VALUES ('08', 55000, 'Lunas', DATEADD(DAY, -3, GETDATE()));

INSERT INTO OrderDetails (OrderId, ProductId, Quantity, Price)
VALUES 
(7, 5, 1, 30000),  -- Rawon Daging Sapi
(7, 15, 2, 12000), -- Thai Tea x2
(7, 11, 1, 5000);  -- Es Teh Manis

-- Order 8: Meja 06 - Lunas
INSERT INTO Orders (TableNumber, TotalAmount, PaymentStatus, OrderDate)
VALUES ('06', 98000, 'Lunas', DATEADD(DAY, -4, GETDATE()));

INSERT INTO OrderDetails (OrderId, ProductId, Quantity, Price)
VALUES 
(8, 1, 2, 25000),  -- Nasi Goreng Spesial x2
(8, 3, 1, 28000),  -- Nasi Ayam Geprek
(8, 13, 2, 15000); -- Kopi Susu Gula Aren x2

-- Order 9: Meja 09 - Lunas
INSERT INTO Orders (TableNumber, TotalAmount, PaymentStatus, OrderDate)
VALUES ('09', 71000, 'Lunas', DATEADD(DAY, -5, GETDATE()));

INSERT INTO OrderDetails (OrderId, ProductId, Quantity, Price)
VALUES 
(9, 4, 2, 23000),  -- Soto Ayam Lamongan x2
(9, 6, 1, 15000),  -- French Fries
(9, 11, 2, 5000);  -- Es Teh Manis x2

-- Order 10: Meja 10 - Lunas
INSERT INTO Orders (TableNumber, TotalAmount, PaymentStatus, OrderDate)
VALUES ('10', 89000, 'Lunas', DATEADD(DAY, -6, GETDATE()));

INSERT INTO OrderDetails (OrderId, ProductId, Quantity, Price)
VALUES 
(10, 2, 2, 22000),  -- Mie Goreng Jawa x2
(10, 5, 1, 30000),  -- Rawon Daging Sapi
(10, 14, 1, 18000), -- Cappuccino
(10, 11, 1, 5000);  -- Es Teh Manis

-- ===================================
-- 5. VERIFIKASI DATA
-- ===================================

-- Cek total data
SELECT 'Admins' AS TableName, COUNT(*) AS TotalRecords FROM Admins
UNION ALL
SELECT 'Products', COUNT(*) FROM Products
UNION ALL
SELECT 'Orders', COUNT(*) FROM Orders
UNION ALL
SELECT 'OrderDetails', COUNT(*) FROM OrderDetails;

-- ===================================
-- SELESAI
-- ===================================
PRINT 'Database setup completed successfully!';
PRINT 'Total Admins: 1';
PRINT 'Total Products: 15 (5 Makanan Berat, 5 Makanan Ringan, 5 Minuman)';
PRINT 'Total Orders: 10';
PRINT 'Total Order Details: Multiple items';
GO
