-- Migration: add customer_payments table
USE sgik;

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
