-- Migration: add purchases & purchase_items (non-destructive)
USE sgik;

-- purchases
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

-- purchase_items
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
