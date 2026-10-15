-- =====================================================
-- MIGRATION: Add AdditionalNotes Column to Orders Table
-- Database: BarcodeRestoDB
-- Date: 2026-01-14
-- =====================================================

-- Connect to database
\c BarcodeRestoDB

-- Add AdditionalNotes column (nullable TEXT)
ALTER TABLE "Orders"
ADD COLUMN "AdditionalNotes" TEXT NULL;

-- Verify the column was added
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'Orders' 
AND column_name = 'AdditionalNotes';

-- =====================================================
-- NOTES:
-- - AdditionalNotes is nullable to support old orders without this field
-- - This stores general order notes from customer (different from item-specific notes)
-- =====================================================
