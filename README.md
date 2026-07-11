# Marketplace de Tecnología — Proyecto Final

**Asignatura:** Desarrollo de Aplicaciones Web  
**Universidad de Panamá**  
**Modalidad:** Trabajo en equipo — 3 integrantes  
**Temática:** A — Tienda en Línea (Marketplace de Tecnología)

---

## Equipo

| Integrante | Usuario GitHub | Área |
|---|---|---|
| Victor Perez | rxppxc | Domain + Use Cases + SQL |
| Juan Pineda | - | API REST (Infrastructure + Presentation) |
| Jhony Zarco | jotta | Django Frontend completo |

---

## Descripción

Sistema de marketplace para emprendimientos tecnológicos donde los usuarios pueden publicar productos tech organizados por categorías, gestionar inventario y registrar pedidos.

---

## Stack Tecnológico

| Capa | Tecnología |
|---|---|
| API | Node.js + TypeScript |
| Arquitectura | Clean Architecture |
| Frontend | Django + HTML Templates |
| Base de datos | MySQL |
| Orquestación | Docker Compose |

---

## Entidades

- `Categoría` — Clasificación de productos
- `Producto` — Artículos tech publicados
- `Pedido` — Registro de compras
- `ItemPedido` — Detalle de productos por pedido

---

## Levantar el proyecto

> **Importante:** usar el comando completo para garantizar un arranque limpio (especialmente si ya corrieron otros proyectos con los mismos puertos).

```bash
docker compose down -v && docker compose up --build
```

| Servicio | URL |
|---|---|
| Frontend (Django) | http://localhost:8000 |
| API REST (Node.js) | http://localhost:3000 |
| Correos (MailHog) | http://localhost:8025 |

El comando `down -v` detiene contenedores previos y limpia los volúmenes antes de reconstruir, evitando conflictos de puertos o datos residuales de otros proyectos.

---

## Ramas

| Rama | Propósito |
|---|---|
| `main` | Producción — solo merge por PR aprobado |
| `develop` | Integración del equipo |
| `feature/001-domain-entities-sql` | Victor — Domain + SQL |
| `feature/002-api-infra-presentation` | Juan — API |
| `feature/003-frontend-components` | Jhony — Frontend completo |
