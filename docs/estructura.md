# Estructura del Proyecto — Clean Architecture

## Árbol de directorios

```
api/src/
├── domain/
│   ├── entities/
│   │   ├── Product.ts
│   │   ├── Category.ts
│   │   ├── Order.ts
│   │   └── OrderItem.ts
│   └── repositories/
│       ├── IProductRepository.ts
│       ├── ICategoryRepository.ts
│       ├── IOrderRepository.ts
│       └── IOrderItemRepository.ts
├── usecases/
│   ├── GetAvailableProductsUseCase.ts
│   ├── GetProductByIdUseCase.ts
│   ├── CreateProductUseCase.ts
│   ├── UpdateProductUseCase.ts
│   ├── DeleteProductUseCase.ts
│   ├── GetLowStockProductsUseCase.ts
│   ├── GetSalesByCategoryUseCase.ts
│   └── CreateOrderUseCase.ts
├── infra/
│   ├── database/
│   │   └── mysqlConnection.ts
│   └── repositories/
│       ├── ProductRepository.ts
│       ├── CategoryRepository.ts
│       ├── OrderRepository.ts
│       └── OrderItemRepository.ts
├── presentation/
│   ├── controllers/
│   │   ├── ProductoController.ts
│   │   ├── CategoriaController.ts
│   │   └── PedidoController.ts
│   └── routes/
│       ├── productoRoutes.ts
│       ├── categoriaRoutes.ts
│       └── pedidoRoutes.ts
└── app.ts
```

---

## Capas de Clean Architecture

### 1. Domain (Dominio)
**Ruta:** `api/src/domain/`

Es el núcleo de la aplicación. No depende de ninguna otra capa ni de frameworks externos.

- **Entities:** Definen la estructura de los datos del negocio (`Product`, `Category`, `Order`, `OrderItem`). Son interfaces TypeScript que representan exactamente lo que existe en la base de datos.
- **Repositories (interfaces):** Contratos (`IProductRepository`, `IOrderRepository`, etc.) que definen qué operaciones de datos existen, sin decir cómo se implementan. Esto permite cambiar la base de datos sin tocar la lógica de negocio.

---

### 2. Use Cases (Casos de Uso)
**Ruta:** `api/src/usecases/`

Contiene la lógica de negocio de la aplicación. Cada archivo representa una acción concreta que el sistema puede realizar.

- Reciben las interfaces de repositorio por constructor (inyección de dependencias).
- Aplican validaciones y reglas de negocio antes de persistir datos.
- No saben nada de HTTP, Express ni MySQL — solo trabajan con las entidades y los contratos del dominio.

Ejemplos:
- `CreateProductUseCase` — valida nombre, precio y stock antes de crear
- `CreateOrderUseCase` — valida items, calcula el total y crea pedido + items
- `GetLowStockProductsUseCase` — delega al repositorio el filtrado por stock mínimo
- `GetSalesByCategoryUseCase` — obtiene reporte de ventas agrupado por categoría

---

### 3. Infrastructure (Infraestructura)
**Ruta:** `api/src/infra/`

Implementa los contratos definidos en el dominio. Aquí vive todo el código que depende de tecnologías concretas.

- **database/mysqlConnection.ts:** Crea y gestiona la conexión a MySQL usando `mysql2`. Incluye reintentos automáticos al iniciar.
- **repositories/:** Implementaciones concretas de las interfaces del dominio. Cada repositorio ejecuta las queries SQL reales contra `marketplace_db`.

---

### 4. Presentation (Presentación)
**Ruta:** `api/src/presentation/`

Expone la aplicación al mundo exterior a través de HTTP.

- **Controllers:** Reciben la `Request` de Express, extraen los datos, llaman al use case correspondiente y devuelven la `Response` con el formato estándar `{ data, message, error }`.
- **Routes:** Registran las rutas de Express y las conectan con su controller. No contienen lógica de negocio.

---

## Flujo de una petición

```
Cliente HTTP
    │
    ▼
[ Routes ]  →  define la URL y el método HTTP (GET /api/productos)
    │
    ▼
[ Controller ]  →  extrae parámetros del request, llama al use case
    │
    ▼
[ Use Case ]  →  aplica validaciones y reglas de negocio
    │
    ▼
[ Repository Interface ]  →  contrato definido en el dominio
    │
    ▼
[ Repository Implementation ]  →  ejecuta la query SQL con mysql2
    │
    ▼
[ MySQL — marketplace_db ]  →  devuelve los datos
    │
    ▼  (sube por las mismas capas)
[ Controller ]  →  formatea la respuesta { data, message, error }
    │
    ▼
Cliente HTTP  ←  JSON con status HTTP correspondiente
```

---

## ¿Por qué Clean Architecture?

**Separación de responsabilidades:** Cada capa tiene una única razón para cambiar. Si MySQL se reemplaza por PostgreSQL, solo cambia la capa de infraestructura. Si cambia una regla de negocio, solo cambia el use case.

**Testabilidad:** Los use cases se pueden probar unitariamente sin base de datos, inyectando un repositorio falso (mock) que implemente la misma interfaz.

**Independencia de frameworks:** Express podría reemplazarse por Fastify o cualquier otro framework sin tocar el dominio ni los use cases.

**Escalabilidad del equipo:** Al estar el trabajo dividido por capas, cada integrante puede trabajar en su capa sin pisar el código del otro. En este proyecto: dominio y use cases (Victor), infraestructura y presentación (Juan), frontend (Jhony).
