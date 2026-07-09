# Diagrama Entidad-Relación — Marketplace de Tecnología

Base de datos: `marketplace_db`

---

## Tablas

### categorias
| Campo       | Tipo           | Restricciones                  |
|-------------|----------------|-------------------------------|
| id          | INT            | PK, AUTO_INCREMENT             |
| nombre      | VARCHAR(100)   | NOT NULL                       |
| descripcion | TEXT           |                                |
| created_at  | TIMESTAMP      | DEFAULT CURRENT_TIMESTAMP      |

---

### productos
| Campo        | Tipo           | Restricciones                         |
|--------------|----------------|--------------------------------------|
| id           | INT            | PK, AUTO_INCREMENT                    |
| nombre       | VARCHAR(200)   | NOT NULL                              |
| descripcion  | TEXT           |                                       |
| precio       | DECIMAL(10,2)  | NOT NULL, CHECK (precio > 0)          |
| stock        | INT            | NOT NULL, DEFAULT 0, CHECK (stock >= 0) |
| stock_minimo | INT            | NOT NULL, DEFAULT 5                   |
| categoria_id | INT            | NOT NULL, FK → categorias(id)         |
| created_at   | TIMESTAMP      | DEFAULT CURRENT_TIMESTAMP             |
| updated_at   | TIMESTAMP      | DEFAULT CURRENT_TIMESTAMP ON UPDATE   |

---

### pedidos
| Campo  | Tipo                                      | Restricciones                    |
|--------|-------------------------------------------|----------------------------------|
| id     | INT                                       | PK, AUTO_INCREMENT               |
| fecha  | TIMESTAMP                                 | DEFAULT CURRENT_TIMESTAMP        |
| total  | DECIMAL(10,2)                             | NOT NULL, DEFAULT 0              |
| estado | ENUM('pendiente','completado','cancelado') | DEFAULT 'pendiente'              |

---

### items_pedido
| Campo           | Tipo          | Restricciones                      |
|-----------------|---------------|------------------------------------|
| id              | INT           | PK, AUTO_INCREMENT                 |
| pedido_id       | INT           | NOT NULL, FK → pedidos(id)         |
| producto_id     | INT           | NOT NULL, FK → productos(id)       |
| cantidad        | INT           | NOT NULL, CHECK (cantidad > 0)     |
| precio_unitario | DECIMAL(10,2) | NOT NULL                           |

---

## Relaciones

```
categorias ──────────────── productos
    1                           N
    (una categoría tiene muchos productos)
    categorias.id ← productos.categoria_id

productos ──────────────── items_pedido
    1                           N
    (un producto aparece en muchos items)
    productos.id ← items_pedido.producto_id

pedidos ─────────────────── items_pedido
    1                           N
    (un pedido contiene muchos items)
    pedidos.id ← items_pedido.pedido_id
```

---

## Resumen de cardinalidades

| Tabla origen | Relación | Tabla destino | Clave foránea                      |
|--------------|----------|---------------|------------------------------------|
| categorias   | 1 → N    | productos     | productos.categoria_id             |
| pedidos      | 1 → N    | items_pedido  | items_pedido.pedido_id             |
| productos    | 1 → N    | items_pedido  | items_pedido.producto_id           |

> Un producto pertenece a una sola categoría.  
> Un pedido puede tener muchos items, pero cada item pertenece a un solo pedido.  
> Un producto puede aparecer en múltiples items de distintos pedidos.
