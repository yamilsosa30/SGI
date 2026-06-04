-- Script para borrar y recrear la base de datos
-- Uso: mysql -u root -p < database/reset-db.sql
-- Luego ejecutar: mysql -u root -p sgik < database/schema-mysql.sql

DROP DATABASE IF EXISTS sgik;
CREATE DATABASE sgik
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_0900_ai_ci;
