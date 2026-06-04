-- =============================================================================
-- Schema MySQL para SGIK POS
-- Este archivo se ejecuta automáticamente al iniciar el contenedor MySQL
-- =============================================================================

SET FOREIGN_KEY_CHECKS = 0;

-- Tabla: categories
CREATE TABLE IF NOT EXISTS categories (
  id BIGINT NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  description VARCHAR(500),
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla: users (para autenticación)
CREATE TABLE IF NOT EXISTS users (
  id BIGINT NOT NULL AUTO_INCREMENT,
  username VARCHAR(60) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL,
  active TINYINT(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (id),
  CONSTRAINT chk_user_role CHECK (role IN ('ADMIN','CASHIER'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insertar usuarios por defecto
INSERT INTO users (username, password, role, active) VALUES 
('admin', 'admin123', 'ADMIN', 1),
('cajero', 'cajero123', 'CASHIER', 1);

-- Tabla: customers
CREATE TABLE IF NOT EXISTS customers (
  id BIGINT NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(64),
  email VARCHAR(255),
  address VARCHAR(500),
  credit_limit DECIMAL(10,2),
  current_debt DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla: customer_payments (historial de cobros de clientes)
CREATE TABLE IF NOT EXISTS customer_payments (
  id BIGINT NOT NULL AUTO_INCREMENT,
  customer_id BIGINT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  note VARCHAR(500),
  paid_at DATETIME(6) NOT NULL,
  PRIMARY KEY (id),
  KEY idx_customer_payments_customer (customer_id),
  CONSTRAINT fk_customer_payments_customer FOREIGN KEY (customer_id) REFERENCES customers(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla: suppliers
CREATE TABLE IF NOT EXISTS suppliers (
  id BIGINT NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(64),
  email VARCHAR(255),
  address VARCHAR(500),
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla: products
CREATE TABLE IF NOT EXISTS products (
  id BIGINT NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  barcode VARCHAR(255) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock DECIMAL(10,2) NOT NULL,
  min_stock DECIMAL(10,2),
  expiry_date DATE,
  category_id BIGINT,
  active TINYINT(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (id),
  UNIQUE KEY uk_products_barcode (barcode),
  KEY idx_products_category (category_id),
  CONSTRAINT fk_products_category FOREIGN KEY (category_id) REFERENCES categories(id)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla: purchases
CREATE TABLE IF NOT EXISTS purchases (
  id BIGINT NOT NULL AUTO_INCREMENT,
  created_at DATETIME(6) NOT NULL,
  completed_at DATETIME(6),
  status VARCHAR(20) NOT NULL,
  supplier_id BIGINT,
  PRIMARY KEY (id),
  KEY idx_purchases_supplier (supplier_id),
  CONSTRAINT fk_purchases_supplier FOREIGN KEY (supplier_id) REFERENCES suppliers(id)
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT chk_purchase_status CHECK (status IN ('PENDING','COMPLETED','CANCELED'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla: purchase_items
CREATE TABLE IF NOT EXISTS purchase_items (
  id BIGINT NOT NULL AUTO_INCREMENT,
  purchase_id BIGINT NOT NULL,
  product_id BIGINT NOT NULL,
  quantity INT NOT NULL,
  cost DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (id),
  KEY idx_purchase_items_purchase (purchase_id),
  KEY idx_purchase_items_product (product_id),
  CONSTRAINT fk_purchase_items_purchase FOREIGN KEY (purchase_id) REFERENCES purchases(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_purchase_items_product FOREIGN KEY (product_id) REFERENCES products(id)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla: sales
CREATE TABLE IF NOT EXISTS sales (
  id BIGINT NOT NULL AUTO_INCREMENT,
  sale_date DATETIME(6) NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  payment_method VARCHAR(32) NOT NULL,
  customer_id BIGINT,
  is_credit TINYINT(1) DEFAULT 0,
  PRIMARY KEY (id),
  KEY idx_sales_customer (customer_id),
  CONSTRAINT fk_sales_customer FOREIGN KEY (customer_id) REFERENCES customers(id)
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT chk_payment_method CHECK (payment_method IN ('CASH','CARD_DEBIT','CARD_CREDIT','TRANSFER','FIADO'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla: sale_items
CREATE TABLE IF NOT EXISTS sale_items (
  id BIGINT NOT NULL AUTO_INCREMENT,
  sale_id BIGINT NOT NULL,
  product_id BIGINT NOT NULL,
  quantity INT NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  interest_rate DECIMAL(5,2) NULL,
  PRIMARY KEY (id),
  KEY idx_sale_items_sale (sale_id),
  KEY idx_sale_items_product (product_id),
  CONSTRAINT fk_sale_items_sale FOREIGN KEY (sale_id) REFERENCES sales(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_sale_items_product FOREIGN KEY (product_id) REFERENCES products(id)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

SET FOREIGN_KEY_CHECKS = 1;

