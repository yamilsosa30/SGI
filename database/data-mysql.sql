-- Datos iniciales para MySQL - Kiosk POS
USE sgik;
SET FOREIGN_KEY_CHECKS = 0;

-- Usuarios iniciales (ADMIN y CASHIER)
INSERT INTO users (username, password, role, active)
VALUES ('admin', 'admin123', 'ADMIN', 1)
ON DUPLICATE KEY UPDATE username = username;

INSERT INTO users (username, password, role, active)
VALUES ('cajero', 'cajero123', 'CASHIER', 1)
ON DUPLICATE KEY UPDATE username = username;

-- Limpiar datos
TRUNCATE TABLE sale_items;
TRUNCATE TABLE purchase_items;
TRUNCATE TABLE purchases;
TRUNCATE TABLE sales;
TRUNCATE TABLE products;
TRUNCATE TABLE categories;
TRUNCATE TABLE customers;
TRUNCATE TABLE suppliers;

-- Categorías
INSERT INTO categories (name, description) VALUES 
('Bebidas', 'Gaseosas, jugos y aguas'),
('Snacks', 'Papas fritas, galletitas y golosinas'),
('Cigarrillos', 'Productos de tabaco'),
('Limpieza', 'Productos de limpieza e higiene');

-- Productos
INSERT INTO products (name, barcode, price, stock, min_stock, category_id, active) VALUES 
('Coca Cola 500ml', '7790895001234', 350.00, 50, 10, 1, 1),
('Pepsi 500ml', '7790895001235', 320.00, 30, 10, 1, 1),
('Agua Mineral 500ml', '7790895001236', 180.00, 100, 20, 1, 1),
('Papas Lays Original', '7790895001237', 450.00, 25, 5, 2, 1),
('Oreo Original', '7790895001238', 280.00, 40, 8, 2, 1),
('Marlboro Box', '7790895001239', 1200.00, 15, 3, 3, 1),
('Detergente Ala', '7790895001240', 890.00, 12, 3, 4, 1);

-- Clientes
INSERT INTO customers (name, phone, email, address, credit_limit, current_debt) VALUES
('Juan Pérez', '3434123456', NULL, NULL, 5000.00, 0.00),
('María González', '3434654321', NULL, NULL, 3000.00, 850.00),
('Carlos López', '3434789012', NULL, NULL, 2000.00, 0.00);

-- Proveedores
INSERT INTO suppliers (name, phone, email, address) VALUES
('Distribuidora Centro', '3434000001', 'ventas@dcentro.com', 'Av. Principal 123'),
('Mayorista Norte', '3434000002', 'contacto@mnorte.com', 'Ruta 11 Km 10');

SET FOREIGN_KEY_CHECKS = 1;
