-- Migration: refactor payment methods enum values
USE sgik;

-- Drop old CHECK and add new CHECK for payment_method
ALTER TABLE sales DROP CHECK chk_payment_method;

-- Migrate existing values
UPDATE sales SET payment_method = 'FIADO', is_credit = 1 WHERE payment_method = 'CREDIT';
UPDATE sales SET payment_method = 'CARD_CREDIT' WHERE payment_method = 'CARD';

-- Recreate CHECK with new values
ALTER TABLE sales
  ADD CONSTRAINT chk_payment_method CHECK (payment_method IN ('CASH','CARD_DEBIT','CARD_CREDIT','TRANSFER','FIADO'));
