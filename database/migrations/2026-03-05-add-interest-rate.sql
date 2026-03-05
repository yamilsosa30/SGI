-- Migration: Add interest_rate column to sale_items
-- Date: 2026-03-05
-- Description: Adds the interest_rate column to track interest per sale item

ALTER TABLE sale_items ADD COLUMN interest_rate DECIMAL(5,2) NULL AFTER subtotal;
