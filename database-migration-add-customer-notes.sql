-- ===================================
-- DATABASE MIGRATION: Add CustomerName & Notes
-- Date: 2026-10-12
-- Purpose: Store customer name and order item notes
-- ===================================

-- 1. Add CustomerName column to Orders table
ALTER TABLE "Orders" 
ADD COLUMN IF NOT EXISTS "CustomerName" VARCHAR(100);

-- 2. Add Notes column to OrderDetails table
ALTER TABLE "OrderDetails" 
ADD COLUMN IF NOT EXISTS "Notes" TEXT;

-- 3. Verify columns added
SELECT column_name, data_type, character_maximum_length
FROM information_schema.columns
WHERE table_name IN ('Orders', 'OrderDetails')
ORDER BY table_name, ordinal_position;

-- Migration completed successfully!
