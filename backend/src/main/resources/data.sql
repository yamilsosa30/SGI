-- Insert sample categories
INSERT INTO categories (name, description) VALUES 
('Bebidas', 'Gaseosas, jugos y aguas'),
('Snacks', 'Papas fritas, galletitas y golosinas'),
('Cigarrillos', 'Productos de tabaco'),
('Limpieza', 'Productos de limpieza e higiene');

-- Insert sample products
INSERT INTO products (name, barcode, price, stock, min_stock, category_id, active) VALUES 
('Coca Cola 500ml', '7790895001234', 350.00, 50, 10, 1, true),
('Pepsi 500ml', '7790895001235', 320.00, 30, 10, 1, true),
('Agua Mineral 500ml', '7790895001236', 180.00, 100, 20, 1, true),
('Papas Lays Original', '7790895001237', 450.00, 25, 5, 2, true),
('Oreo Original', '7790895001238', 280.00, 40, 8, 2, true),
('Marlboro Box', '7790895001239', 1200.00, 15, 3, 3, true),
('Detergente Ala', '7790895001240', 890.00, 12, 3, 4, true);

-- Insert sample customers
INSERT INTO customers (name, phone, credit_limit, current_debt) VALUES 
('Juan Pérez', '3434123456', 5000.00, 0.00),
('María González', '3434654321', 3000.00, 850.00),
('Carlos López', '3434789012', 2000.00, 0.00);
