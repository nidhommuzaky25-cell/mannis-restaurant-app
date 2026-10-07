-- ===================================
-- SETUP DATABASE MANNIS RESTAURANT
-- PostgreSQL Version
-- ===================================

-- Buat database (jalankan command ini terpisah di psql atau pgAdmin)
-- CREATE DATABASE "BarcodeRestoDB";

-- Gunakan database BarcodeRestoDB
-- \c BarcodeRestoDB

-- ===================================
-- 1. BUAT TABEL
-- ===================================

-- Tabel Admins
CREATE TABLE IF NOT EXISTS "Admins" (
    "AdminId" SERIAL PRIMARY KEY,
    "Username" VARCHAR(50) NOT NULL UNIQUE,
    "Password" VARCHAR(255) NOT NULL
);

-- Tabel Products
CREATE TABLE IF NOT EXISTS "Products" (
    "ProductId" SERIAL PRIMARY KEY,
    "ProductName" VARCHAR(100) NOT NULL,
    "Category" VARCHAR(50) NOT NULL,
    "Price" DECIMAL(18,2) NOT NULL,
    "Description" VARCHAR(500),
    "ImageUrl" VARCHAR(500),
    "IsAvailable" BOOLEAN NOT NULL DEFAULT true
);

-- Tabel Orders
CREATE TABLE IF NOT EXISTS "Orders" (
    "OrderId" SERIAL PRIMARY KEY,
    "TableNumber" VARCHAR(10) NOT NULL,
    "TotalAmount" DECIMAL(18,2) NOT NULL,
    "PaymentStatus" VARCHAR(20) NOT NULL,
    "OrderDate" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tabel OrderDetails
CREATE TABLE IF NOT EXISTS "OrderDetails" (
    "OrderDetailId" SERIAL PRIMARY KEY,
    "OrderId" INT NOT NULL,
    "ProductId" INT NOT NULL,
    "Quantity" INT NOT NULL,
    "Price" DECIMAL(18,2) NOT NULL,
    FOREIGN KEY ("OrderId") REFERENCES "Orders"("OrderId") ON DELETE CASCADE,
    FOREIGN KEY ("ProductId") REFERENCES "Products"("ProductId") ON DELETE CASCADE
);

-- ===================================
-- 2. INSERT DATA ADMIN
-- ===================================

INSERT INTO "Admins" ("Username", "Password") 
VALUES ('admin', 'admin123')
ON CONFLICT ("Username") DO NOTHING;

-- ===================================
-- 3. INSERT SAMPLE PRODUCTS
-- ===================================

-- MAKANAN BERAT (5 items)
INSERT INTO "Products" ("ProductName", "Category", "Price", "Description", "ImageUrl", "IsAvailable")
VALUES 
('Nasi Goreng Spesial', 'Makanan Berat', 25000, 'Nasi goreng dengan telur, ayam, dan sayuran segar', 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=400&fit=crop', true),
('Mie Goreng Jawa', 'Makanan Berat', 22000, 'Mie goreng khas Jawa dengan bumbu rempah', 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&h=400&fit=crop', true),
('Nasi Ayam Geprek', 'Makanan Berat', 28000, 'Ayam crispy geprek dengan sambal pedas level 1-5', 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=400&h=400&fit=crop', true),
('Soto Ayam Lamongan', 'Makanan Berat', 23000, 'Soto ayam khas Lamongan dengan kuah bening segar', 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400&h=400&fit=crop', true),
('Rawon Daging Sapi', 'Makanan Berat', 30000, 'Rawon khas Jawa Timur dengan daging empuk', 'https://images.unsplash.com/photo-1588137378633-dea1336ce1e2?w=400&h=400&fit=crop', true)
ON CONFLICT DO NOTHING;

-- MAKANAN RINGAN (5 items)
INSERT INTO "Products" ("ProductName", "Category", "Price", "Description", "ImageUrl", "IsAvailable")
VALUES 
('French Fries', 'Makanan Ringan', 15000, 'Kentang goreng crispy dengan saus sambal dan mayones', 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=400&fit=crop', true),
('Chicken Nuggets', 'Makanan Ringan', 18000, 'Nugget ayam crispy isi 8 pcs dengan saus pilihan', 'https://images.unsplash.com/photo-1562967914-608f82629710?w=400&h=400&fit=crop', true),
('Pisang Goreng Keju', 'Makanan Ringan', 12000, 'Pisang goreng crispy dengan topping keju meleleh', 'https://images.unsplash.com/photo-1625937286074-9ca519d5d9df?w=400&h=400&fit=crop', true),
('Tahu Crispy', 'Makanan Ringan', 10000, 'Tahu goreng crispy dengan saus kacang pedas', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop', true),
('Spring Roll', 'Makanan Ringan', 16000, 'Lumpia goreng isi sayuran dengan saus asam manis', 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=400&fit=crop', true)
ON CONFLICT DO NOTHING;

-- MINUMAN (5 items)
INSERT INTO "Products" ("ProductName", "Category", "Price", "Description", "ImageUrl", "IsAvailable")
VALUES 
('Es Teh Manis', 'Minuman', 5000, 'Teh manis dingin segar', 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=400&fit=crop', true),
('Es Jeruk', 'Minuman', 8000, 'Jus jeruk segar dengan es batu', 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=400&fit=crop', true),
('Kopi Susu Gula Aren', 'Minuman', 15000, 'Kopi susu dengan gula aren premium', 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=400&fit=crop', true),
('Cappuccino', 'Minuman', 18000, 'Cappuccino dengan foam susu halus', 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=400&fit=crop', true),
('Thai Tea', 'Minuman', 12000, 'Thai tea dingin dengan susu kental manis', 'https://images.unsplash.com/photo-1578899952107-9d9d6b8c6ac7?w=400&h=400&fit=crop', true)
ON CONFLICT DO NOTHING;

-- ===================================
-- 4. INSERT SAMPLE ORDERS
-- ===================================

-- Order 1: Meja 01 - Belum Bayar
INSERT INTO "Orders" ("TableNumber", "TotalAmount", "PaymentStatus", "OrderDate")
VALUES ('01', 53000, 'Belum Bayar', CURRENT_TIMESTAMP - INTERVAL '2 hours')
ON CONFLICT DO NOTHING;

INSERT INTO "OrderDetails" ("OrderId", "ProductId", "Quantity", "Price")
SELECT 1, 1, 1, 25000 WHERE NOT EXISTS (SELECT 1 FROM "OrderDetails" WHERE "OrderId" = 1 AND "ProductId" = 1)
UNION ALL
SELECT 1, 6, 1, 15000 WHERE NOT EXISTS (SELECT 1 FROM "OrderDetails" WHERE "OrderId" = 1 AND "ProductId" = 6)
UNION ALL
SELECT 1, 11, 1, 5000 WHERE NOT EXISTS (SELECT 1 FROM "OrderDetails" WHERE "OrderId" = 1 AND "ProductId" = 11)
UNION ALL
SELECT 1, 12, 1, 8000 WHERE NOT EXISTS (SELECT 1 FROM "OrderDetails" WHERE "OrderId" = 1 AND "ProductId" = 12);

-- Order 2: Meja 03 - Lunas
INSERT INTO "Orders" ("TableNumber", "TotalAmount", "PaymentStatus", "OrderDate")
VALUES ('03', 76000, 'Lunas', CURRENT_TIMESTAMP - INTERVAL '5 hours')
ON CONFLICT DO NOTHING;

INSERT INTO "OrderDetails" ("OrderId", "ProductId", "Quantity", "Price")
SELECT 2, 3, 2, 28000 WHERE NOT EXISTS (SELECT 1 FROM "OrderDetails" WHERE "OrderId" = 2 AND "ProductId" = 3)
UNION ALL
SELECT 2, 13, 2, 15000 WHERE NOT EXISTS (SELECT 1 FROM "OrderDetails" WHERE "OrderId" = 2 AND "ProductId" = 13);

-- Order 3: Meja 05 - Lunas
INSERT INTO "Orders" ("TableNumber", "TotalAmount", "PaymentStatus", "OrderDate")
VALUES ('05', 91000, 'Lunas', CURRENT_TIMESTAMP - INTERVAL '8 hours')
ON CONFLICT DO NOTHING;

INSERT INTO "OrderDetails" ("OrderId", "ProductId", "Quantity", "Price")
SELECT 3, 5, 2, 30000 WHERE NOT EXISTS (SELECT 1 FROM "OrderDetails" WHERE "OrderId" = 3 AND "ProductId" = 5)
UNION ALL
SELECT 3, 7, 1, 18000 WHERE NOT EXISTS (SELECT 1 FROM "OrderDetails" WHERE "OrderId" = 3 AND "ProductId" = 7)
UNION ALL
SELECT 3, 11, 3, 5000 WHERE NOT EXISTS (SELECT 1 FROM "OrderDetails" WHERE "OrderId" = 3 AND "ProductId" = 11);

-- Order 4: Meja 02 - Belum Bayar
INSERT INTO "Orders" ("TableNumber", "TotalAmount", "PaymentStatus", "OrderDate")
VALUES ('02', 45000, 'Belum Bayar', CURRENT_TIMESTAMP - INTERVAL '1 hour')
ON CONFLICT DO NOTHING;

INSERT INTO "OrderDetails" ("OrderId", "ProductId", "Quantity", "Price")
SELECT 4, 2, 1, 22000 WHERE NOT EXISTS (SELECT 1 FROM "OrderDetails" WHERE "OrderId" = 4 AND "ProductId" = 2)
UNION ALL
SELECT 4, 8, 1, 12000 WHERE NOT EXISTS (SELECT 1 FROM "OrderDetails" WHERE "OrderId" = 4 AND "ProductId" = 8)
UNION ALL
SELECT 4, 11, 1, 5000 WHERE NOT EXISTS (SELECT 1 FROM "OrderDetails" WHERE "OrderId" = 4 AND "ProductId" = 11)
UNION ALL
SELECT 4, 12, 1, 8000 WHERE NOT EXISTS (SELECT 1 FROM "OrderDetails" WHERE "OrderId" = 4 AND "ProductId" = 12);

-- Order 5: Meja 07 - Lunas
INSERT INTO "Orders" ("TableNumber", "TotalAmount", "PaymentStatus", "OrderDate")
VALUES ('07', 64000, 'Lunas', CURRENT_TIMESTAMP - INTERVAL '1 day')
ON CONFLICT DO NOTHING;

INSERT INTO "OrderDetails" ("OrderId", "ProductId", "Quantity", "Price")
SELECT 5, 1, 1, 25000 WHERE NOT EXISTS (SELECT 1 FROM "OrderDetails" WHERE "OrderId" = 5 AND "ProductId" = 1)
UNION ALL
SELECT 5, 4, 1, 23000 WHERE NOT EXISTS (SELECT 1 FROM "OrderDetails" WHERE "OrderId" = 5 AND "ProductId" = 4)
UNION ALL
SELECT 5, 10, 1, 16000 WHERE NOT EXISTS (SELECT 1 FROM "OrderDetails" WHERE "OrderId" = 5 AND "ProductId" = 10);

-- Order 6: Meja 04 - Lunas
INSERT INTO "Orders" ("TableNumber", "TotalAmount", "PaymentStatus", "OrderDate")
VALUES ('04', 82000, 'Lunas', CURRENT_TIMESTAMP - INTERVAL '2 days')
ON CONFLICT DO NOTHING;

INSERT INTO "OrderDetails" ("OrderId", "ProductId", "Quantity", "Price")
SELECT 6, 3, 2, 28000 WHERE NOT EXISTS (SELECT 1 FROM "OrderDetails" WHERE "OrderId" = 6 AND "ProductId" = 3)
UNION ALL
SELECT 6, 14, 1, 18000 WHERE NOT EXISTS (SELECT 1 FROM "OrderDetails" WHERE "OrderId" = 6 AND "ProductId" = 14)
UNION ALL
SELECT 6, 12, 1, 8000 WHERE NOT EXISTS (SELECT 1 FROM "OrderDetails" WHERE "OrderId" = 6 AND "ProductId" = 12);

-- Order 7: Meja 08 - Lunas
INSERT INTO "Orders" ("TableNumber", "TotalAmount", "PaymentStatus", "OrderDate")
VALUES ('08', 55000, 'Lunas', CURRENT_TIMESTAMP - INTERVAL '3 days')
ON CONFLICT DO NOTHING;

INSERT INTO "OrderDetails" ("OrderId", "ProductId", "Quantity", "Price")
SELECT 7, 5, 1, 30000 WHERE NOT EXISTS (SELECT 1 FROM "OrderDetails" WHERE "OrderId" = 7 AND "ProductId" = 5)
UNION ALL
SELECT 7, 15, 2, 12000 WHERE NOT EXISTS (SELECT 1 FROM "OrderDetails" WHERE "OrderId" = 7 AND "ProductId" = 15)
UNION ALL
SELECT 7, 11, 1, 5000 WHERE NOT EXISTS (SELECT 1 FROM "OrderDetails" WHERE "OrderId" = 7 AND "ProductId" = 11);

-- Order 8: Meja 06 - Lunas
INSERT INTO "Orders" ("TableNumber", "TotalAmount", "PaymentStatus", "OrderDate")
VALUES ('06', 98000, 'Lunas', CURRENT_TIMESTAMP - INTERVAL '4 days')
ON CONFLICT DO NOTHING;

INSERT INTO "OrderDetails" ("OrderId", "ProductId", "Quantity", "Price")
SELECT 8, 1, 2, 25000 WHERE NOT EXISTS (SELECT 1 FROM "OrderDetails" WHERE "OrderId" = 8 AND "ProductId" = 1)
UNION ALL
SELECT 8, 3, 1, 28000 WHERE NOT EXISTS (SELECT 1 FROM "OrderDetails" WHERE "OrderId" = 8 AND "ProductId" = 3)
UNION ALL
SELECT 8, 13, 2, 15000 WHERE NOT EXISTS (SELECT 1 FROM "OrderDetails" WHERE "OrderId" = 8 AND "ProductId" = 13);

-- Order 9: Meja 09 - Lunas
INSERT INTO "Orders" ("TableNumber", "TotalAmount", "PaymentStatus", "OrderDate")
VALUES ('09', 71000, 'Lunas', CURRENT_TIMESTAMP - INTERVAL '5 days')
ON CONFLICT DO NOTHING;

INSERT INTO "OrderDetails" ("OrderId", "ProductId", "Quantity", "Price")
SELECT 9, 4, 2, 23000 WHERE NOT EXISTS (SELECT 1 FROM "OrderDetails" WHERE "OrderId" = 9 AND "ProductId" = 4)
UNION ALL
SELECT 9, 6, 1, 15000 WHERE NOT EXISTS (SELECT 1 FROM "OrderDetails" WHERE "OrderId" = 9 AND "ProductId" = 6)
UNION ALL
SELECT 9, 11, 2, 5000 WHERE NOT EXISTS (SELECT 1 FROM "OrderDetails" WHERE "OrderId" = 9 AND "ProductId" = 11);

-- Order 10: Meja 10 - Lunas
INSERT INTO "Orders" ("TableNumber", "TotalAmount", "PaymentStatus", "OrderDate")
VALUES ('10', 89000, 'Lunas', CURRENT_TIMESTAMP - INTERVAL '6 days')
ON CONFLICT DO NOTHING;

INSERT INTO "OrderDetails" ("OrderId", "ProductId", "Quantity", "Price")
SELECT 10, 2, 2, 22000 WHERE NOT EXISTS (SELECT 1 FROM "OrderDetails" WHERE "OrderId" = 10 AND "ProductId" = 2)
UNION ALL
SELECT 10, 5, 1, 30000 WHERE NOT EXISTS (SELECT 1 FROM "OrderDetails" WHERE "OrderId" = 10 AND "ProductId" = 5)
UNION ALL
SELECT 10, 14, 1, 18000 WHERE NOT EXISTS (SELECT 1 FROM "OrderDetails" WHERE "OrderId" = 10 AND "ProductId" = 14)
UNION ALL
SELECT 10, 11, 1, 5000 WHERE NOT EXISTS (SELECT 1 FROM "OrderDetails" WHERE "OrderId" = 10 AND "ProductId" = 11);

-- ===================================
-- 5. VERIFIKASI DATA
-- ===================================

-- Cek total data
SELECT 'Admins' AS "TableName", COUNT(*) AS "TotalRecords" FROM "Admins"
UNION ALL
SELECT 'Products', COUNT(*) FROM "Products"
UNION ALL
SELECT 'Orders', COUNT(*) FROM "Orders"
UNION ALL
SELECT 'OrderDetails', COUNT(*) FROM "OrderDetails";

-- ===================================
-- SELESAI
-- ===================================
-- Database setup completed successfully!
-- Total Admins: 1
-- Total Products: 15 (5 Makanan Berat, 5 Makanan Ringan, 5 Minuman)
-- Total Orders: 10
-- Total Order Details: Multiple items
