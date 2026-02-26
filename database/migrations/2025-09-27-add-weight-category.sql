-- Agregar categoría especial para productos que se venden por peso
INSERT INTO categories (name, description) 
VALUES ('Por peso', 'Productos que se venden por peso (precio por kilo)') 
ON DUPLICATE KEY UPDATE description = 'Productos que se venden por peso (precio por kilo)';
