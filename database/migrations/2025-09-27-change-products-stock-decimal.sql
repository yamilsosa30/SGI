-- 2025-09-27: Cambiar stock y min_stock a DECIMAL(10,2)
USE sgik;

ALTER TABLE products
  MODIFY COLUMN stock DECIMAL(10,2) NOT NULL,
  MODIFY COLUMN min_stock DECIMAL(10,2);
