-- =============================================================================
-- Datos iniciales para SGIK POS
-- Usuario admin por defecto: admin / admin123
-- =============================================================================

-- Usuario administrador por defecto
-- Password: admin123 (BCrypt encoded)
INSERT INTO users (username, password, role, active) VALUES
('admin', '$2a$10$N.ZO.8.8rHXKH9/I1F8bD.PZ8MFk8ZJHX8KqFQ8KXrEqGJe5LHNmu', 'ADMIN', 1)
ON DUPLICATE KEY UPDATE username = username;

-- Categorías de ejemplo
INSERT INTO categories (name, description) VALUES
('Bebidas', 'Gaseosas, jugos, agua y bebidas en general'),
('Golosinas', 'Caramelos, chocolates y dulces'),
('Almacén', 'Productos de almacén general'),
('Lácteos', 'Leche, yogurt, quesos'),
('Panadería', 'Pan, facturas y productos de panadería'),
('Limpieza', 'Productos de limpieza del hogar'),
('Higiene', 'Productos de higiene personal'),
('Cigarrillos', 'Cigarrillos y tabaco'),
('Fiambres', 'Jamón, queso, fiambres en general'),
('Congelados', 'Productos congelados')
ON DUPLICATE KEY UPDATE name = name;

-- Proveedor de ejemplo
INSERT INTO suppliers (name, phone, email, address) VALUES
('Distribuidor General', '11-5555-0001', 'ventas@distribuidor.com', 'Av. Principal 1234'),
('Bebidas del Sur', '11-5555-0002', 'pedidos@bebidasdelsur.com', 'Calle Secundaria 567')
ON DUPLICATE KEY UPDATE name = name;

