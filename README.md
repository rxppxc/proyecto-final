# Web AVG App - Enterprise Architecture

## Visión general

Este repositorio implementa una solución full-stack con:
- Backend API en Node.js / TypeScript
- Frontend Django en Python
- Base de datos MySQL
- Orquestación completa con Docker Compose

## Arquitectura principal
- `api/`: servicio backend con dominio, casos de uso, infraestructura y presentación separados.
- `web/`: aplicación Django con servicio HTTP que consume la API.
- `docker-compose.yml`: orquesta servicios `db`, `api` y `web`.
- `run.sh`: script de arranque completo para Docker.

## Entregables
1. API REST funcional: `GET /api/catalogo`.
2. Base de datos MySQL con datos iniciales y arranque automático.
3. Frontend Django que consume la API y renderiza el catálogo.
4. Orquestación con Docker Compose y script de arranque `run.sh`.
5. Documentación técnica clara en `README.md` y `docs/entregables.md`.

## Ejecutar la solución

```bash
chmod +x run.sh
./run.sh
```

Luego accede a:
- `http://localhost:3000`: API REST
- `http://localhost:8000`: aplicación web

## Inicializar la base de datos

El script `api/db/init.sql` se monta en `docker-compose.yml` y se ejecuta automáticamente en el primer arranque de MySQL.

## Archivos clave
- `api/src/app.ts`: configuración del servidor Express.
- `api/src/infra/database/mysqlConnection.ts`: conexión MySQL con reintentos.
- `web/core/views.py`: vista Django que consume la API.
- `web/core/templates/index.html`: plantilla HTML del catálogo.
- `docs/entregables.md`: descripción de los 5 entregables.

## Notas de implementación
- El backend se despliega en `http://api:3000` dentro de Docker.
- El frontend usa `API_BASE_URL` desde las variables de entorno.
- La aplicación es modular: backend, frontend y base de datos están desacoplados.
