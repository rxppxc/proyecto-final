-- ============================================================
-- Marketplace de Tecnología — Proyecto Final
-- Temática A: Tienda en Línea
-- ============================================================

SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

CREATE DATABASE IF NOT EXISTS marketplace_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE marketplace_db;

CREATE TABLE categorias (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  nombre      VARCHAR(100) NOT NULL,
  descripcion TEXT,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE productos (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  nombre       VARCHAR(200) NOT NULL,
  descripcion  TEXT,
  precio       DECIMAL(10,2) NOT NULL CHECK (precio > 0),
  stock        INT NOT NULL DEFAULT 0 CHECK (stock >= 0),
  stock_minimo INT NOT NULL DEFAULT 5,
  categoria_id INT NOT NULL,
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (categoria_id) REFERENCES categorias(id)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE pedidos (
  id     INT AUTO_INCREMENT PRIMARY KEY,
  fecha  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  total  DECIMAL(10,2) NOT NULL DEFAULT 0,
  estado ENUM('pendiente','completado','cancelado') DEFAULT 'pendiente'
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE items_pedido (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  pedido_id       INT NOT NULL,
  producto_id     INT NOT NULL,
  cantidad        INT NOT NULL CHECK (cantidad > 0),
  precio_unitario DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (pedido_id)   REFERENCES pedidos(id),
  FOREIGN KEY (producto_id) REFERENCES productos(id)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

INSERT INTO categorias (nombre, descripcion) VALUES
  ('Laptops',     'Computadoras portátiles y ultrabooks'),
  ('Celulares',   'Smartphones y accesorios móviles'),
  ('Accesorios',  'Periféricos, cables y gadgets'),
  ('Componentes', 'Hardware para ensamblaje PC');

INSERT INTO productos (nombre, descripcion, precio, stock, stock_minimo, categoria_id) VALUES
  ('Laptop HP 15',         'Intel Core i5, 8GB RAM, 256GB SSD',  650.00, 10, 3, 1),
  ('Laptop Dell Inspiron', 'Intel Core i7, 16GB RAM, 512GB SSD', 950.00,  4, 3, 1),
  ('Samsung Galaxy A54',   '6GB RAM, 128GB almacenamiento',       380.00, 15, 5, 2),
  ('iPhone 14',            '128GB, Chip A15 Bionic',             899.00,  2, 3, 2),
  ('Mouse Logitech MX',    'Inalámbrico, ergonómico',             45.00,  30, 10, 3),
  ('Teclado Mecánico',     'Switch Blue, RGB retroiluminado',     85.00,   3,  5, 3),
  ('SSD Samsung 1TB',      'NVMe M.2, 7000MB/s lectura',         120.00,  8,  5, 4);
