# Documentación de la API — Marketplace de Tecnología

Base URL: `http://localhost:3000/api`

---

## Productos

### GET /api/productos
**Descripción:** Retorna todos los productos disponibles en el marketplace (stock > 0).

**Response 200:**
```json
{
  "data": [
    {
      "id": 1,
      "nombre": "Laptop Dell XPS 15",
      "descripcion": "Laptop de alto rendimiento",
      "precio": 1500.00,
      "stock": 10,
      "stock_minimo": 2,
      "categoria_id": 1,
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z"
    }
  ],
  "message": "Productos obtenidos correctamente",
  "error": null
}
```

---

### GET /api/productos/:id
**Descripción:** Retorna un producto específico por su ID.

**Parámetros de ruta:**
| Parámetro | Tipo   | Descripción         |
|-----------|--------|---------------------|
| id        | number | ID del producto     |

**Response 200:**
```json
{
  "data": {
    "id": 1,
    "nombre": "Laptop Dell XPS 15",
    "descripcion": "Laptop de alto rendimiento",
    "precio": 1500.00,
    "stock": 10,
    "stock_minimo": 2,
    "categoria_id": 1,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  },
  "message": "Producto obtenido correctamente",
  "error": null
}
```

**Response 404:**
```json
{
  "data": null,
  "message": null,
  "error": "Producto no encontrado"
}
```

---

### POST /api/productos
**Descripción:** Crea un nuevo producto en el marketplace.

**Body (application/json):**
```json
{
  "nombre": "Monitor LG 27\"",
  "descripcion": "Monitor 4K IPS 27 pulgadas",
  "precio": 450.00,
  "stock": 15,
  "stock_minimo": 3,
  "categoria_id": 2
}
```

**Validaciones:**
- `nombre` requerido
- `precio` requerido y mayor a 0
- `stock` no puede ser negativo

**Response 201:**
```json
{
  "data": {
    "id": 5,
    "nombre": "Monitor LG 27\"",
    "descripcion": "Monitor 4K IPS 27 pulgadas",
    "precio": 450.00,
    "stock": 15,
    "stock_minimo": 3,
    "categoria_id": 2
  },
  "message": "Producto creado correctamente",
  "error": null
}
```

**Response 400:**
```json
{
  "data": null,
  "message": null,
  "error": "Nombre y precio válido son requeridos"
}
```

---

### PUT /api/productos/:id
**Descripción:** Actualiza los datos de un producto existente. Solo se actualizan los campos enviados.

**Parámetros de ruta:**
| Parámetro | Tipo   | Descripción         |
|-----------|--------|---------------------|
| id        | number | ID del producto     |

**Body (application/json):**
```json
{
  "precio": 420.00,
  "stock": 12
}
```

**Response 200:**
```json
{
  "data": {
    "id": 5,
    "nombre": "Monitor LG 27\"",
    "descripcion": "Monitor 4K IPS 27 pulgadas",
    "precio": 420.00,
    "stock": 12,
    "stock_minimo": 3,
    "categoria_id": 2
  },
  "message": "Producto actualizado correctamente",
  "error": null
}
```

**Response 404:**
```json
{
  "data": null,
  "message": null,
  "error": "Producto con id 5 no encontrado"
}
```

---

### DELETE /api/productos/:id
**Descripción:** Elimina un producto del marketplace por su ID.

**Parámetros de ruta:**
| Parámetro | Tipo   | Descripción         |
|-----------|--------|---------------------|
| id        | number | ID del producto     |

**Response 200:**
```json
{
  "data": null,
  "message": "Producto eliminado correctamente",
  "error": null
}
```

**Response 404:**
```json
{
  "data": null,
  "message": null,
  "error": "Producto con id 5 no encontrado"
}
```

---

### GET /api/productos/low-stock
**Descripción:** Retorna los productos cuyo stock actual es menor o igual al stock mínimo configurado. Útil para alertas de reabastecimiento.

**Response 200:**
```json
{
  "data": [
    {
      "id": 3,
      "nombre": "Teclado Mecánico RGB",
      "descripcion": "Teclado mecánico con switches blue",
      "precio": 85.00,
      "stock": 1,
      "stock_minimo": 3,
      "categoria_id": 3
    }
  ],
  "message": "Productos con bajo stock obtenidos correctamente",
  "error": null
}
```

---

## Categorías

### GET /api/categorias
**Descripción:** Retorna todas las categorías registradas en el sistema.

**Response 200:**
```json
{
  "data": [
    {
      "id": 1,
      "nombre": "Laptops",
      "descripcion": "Computadoras portátiles",
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ],
  "message": "Categorías obtenidas correctamente",
  "error": null
}
```

---

### POST /api/categorias
**Descripción:** Crea una nueva categoría de productos.

**Body (application/json):**
```json
{
  "nombre": "Accesorios",
  "descripcion": "Accesorios para computadoras y dispositivos"
}
```

**Validaciones:**
- `nombre` requerido

**Response 201:**
```json
{
  "data": {
    "id": 5,
    "nombre": "Accesorios",
    "descripcion": "Accesorios para computadoras y dispositivos"
  },
  "message": "Categoría creada correctamente",
  "error": null
}
```

**Response 400:**
```json
{
  "data": null,
  "message": null,
  "error": "El nombre de la categoría es requerido"
}
```

---

## Pedidos

### GET /api/pedidos
**Descripción:** Retorna todos los pedidos registrados en el sistema.

**Response 200:**
```json
{
  "data": [
    {
      "id": 1,
      "fecha": "2024-01-15T10:30:00.000Z",
      "total": 1585.00,
      "estado": "completado",
      "items": [
        {
          "id": 1,
          "pedido_id": 1,
          "producto_id": 1,
          "cantidad": 1,
          "precio_unitario": 1500.00
        }
      ]
    }
  ],
  "message": "Pedidos obtenidos correctamente",
  "error": null
}
```

---

### POST /api/pedidos
**Descripción:** Crea un nuevo pedido. Calcula el total automáticamente a partir de los items enviados. El pedido se crea con estado `pendiente`.

**Body (application/json):**
```json
{
  "items": [
    {
      "producto_id": 1,
      "cantidad": 1,
      "precio_unitario": 1500.00
    },
    {
      "producto_id": 3,
      "cantidad": 2,
      "precio_unitario": 85.00
    }
  ]
}
```

**Validaciones:**
- `items` no puede estar vacío
- Cada item debe tener `producto_id` válido
- `cantidad` debe ser mayor a 0
- `precio_unitario` debe ser mayor a 0

**Response 201:**
```json
{
  "data": {
    "id": 4,
    "fecha": "2024-01-20T14:00:00.000Z",
    "total": 1670.00,
    "estado": "pendiente",
    "items": [
      {
        "id": 7,
        "pedido_id": 4,
        "producto_id": 1,
        "cantidad": 1,
        "precio_unitario": 1500.00
      },
      {
        "id": 8,
        "pedido_id": 4,
        "producto_id": 3,
        "cantidad": 2,
        "precio_unitario": 85.00
      }
    ]
  },
  "message": "Pedido creado correctamente",
  "error": null
}
```

**Response 400:**
```json
{
  "data": null,
  "message": null,
  "error": "El pedido debe contener al menos un item"
}
```

---

### GET /api/pedidos/ventas-categoria
**Descripción:** Retorna un resumen del total de ventas agrupado por categoría de producto. Útil para reportes y análisis de negocio.

**Response 200:**
```json
{
  "data": [
    {
      "categoria": "Laptops",
      "total_ventas": 4500.00
    },
    {
      "categoria": "Monitores",
      "total_ventas": 900.00
    }
  ],
  "message": "Ventas por categoría obtenidas correctamente",
  "error": null
}
```
