# Reservas Backend

REST API para gestión de reservas de negocios. Construida con Node.js, Express, TypeScript y PostgreSQL.

## Stack

- **Runtime:** Node.js 22 + TypeScript
- **Framework:** Express 5
- **Base de datos:** PostgreSQL + Sequelize ORM
- **Autenticación:** JWT (access token) + Refresh token (HttpOnly cookie)
- **Email:** Resend
- **Migraciones:** Umzug
- **Documentación:** Swagger UI en `/api/docs`
- **Tests:** Jest + ts-jest

---

## Requisitos previos

- [Node.js 22+](https://nodejs.org)
- [Docker](https://www.docker.com) y Docker Compose

---

## Instalación y configuración local

```bash
# 1. Clonar el repositorio
git clone <url-del-repositorio>
cd reservas-backend

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus valores

# 4. Levantar solo la base de datos con Docker
docker compose up db -d

# 5. Crear tablas y cargar datos de prueba
npm run db:fresh

# 6. Iniciar el servidor en modo desarrollo
npm run dev
```

El servidor estará disponible en `http://localhost:3000`.
La documentación Swagger en `http://localhost:3000/api/docs`.

---

## Scripts disponibles

| Script | Descripción |
|---|---|
| `npm run dev` | Servidor en desarrollo con hot-reload |
| `npm run build` | Compila TypeScript → `dist/` |
| `npm start` | Inicia el servidor compilado (requiere `build` previo) |
| `npm test` | Corre los tests |
| `npm run test:coverage` | Tests con reporte de cobertura |
| `npm run migrate` | Aplica migraciones pendientes |
| `npm run rollback:migrate` | Revierte la última migración |
| `npm run seed` | Ejecuta los seeders |
| `npm run rollback:seed` | Revierte los seeders |
| `npm run db:reset` | Revierte y re-aplica todas las migraciones (base de datos limpia) |
| `npm run db:fresh` | `db:reset` + `seed` (tablas limpias con datos demo) |

---

## Docker

### Solo base de datos (recomendado para desarrollo local)

```bash
docker compose up db -d      # levantar Postgres en background
docker compose down          # detener
docker compose down -v       # detener y borrar todos los datos
```

### Stack completo — backend + base de datos

```bash
docker compose up --build    # construir y levantar todo
docker compose up --build -d # en background

# Correr seeders dentro del contenedor
docker compose exec app node dist/database/utils/run-seeders.js

docker compose down
docker compose down -v       # borra también los datos de Postgres
```

> **Nota:** En el stack completo, el backend corre el código compilado de `dist/`. Para desarrollo activo con hot-reload usa solo `docker compose up db -d` y el servidor con `npm run dev`.

---

## Variables de entorno

Copia `.env.example` a `.env` y completa los valores.

| Variable | Requerida | Descripción |
|---|---|---|
| `DB_USER` | ✅ | Usuario de PostgreSQL |
| `DB_NAME` | ✅ | Nombre de la base de datos |
| `DB_PASSWORD` | ✅ | Contraseña de PostgreSQL |
| `DB_HOST` | ✅ | Host de la DB (`localhost` en local, `db` en Docker completo) |
| `DB_PORT` | ✅ | Puerto de PostgreSQL (default: `5432`) |
| `PORT` | — | Puerto del servidor (default: `3000`) |
| `NODE_ENV` | — | Entorno: `development` o `production` |
| `JWT_SECRET` | ✅ | Clave secreta para firmar tokens JWT |
| `RESEND_API_KEY` | ✅ | API key de [Resend](https://resend.com) |
| `EMAIL_FROM` | ✅ | Dirección remitente verificada en Resend |
| `EMAIL_PROVIDER` | — | Proveedor de email (default: `resend`) |
| `HOST` | ✅ | URL base del backend, usada en links de emails |
| `CORS_ORIGIN` | ✅ | Origen permitido para CORS (URL del frontend) |
| `TIMEZONE` | — | Zona horaria para cálculo de slots (default: `America/Mexico_City`) |
| `DB_TIMEZONE` | — | Zona horaria para Sequelize (default: `00:00`) |
| `DEVELOPMENT_FRONTEND_URL` | — | URL del frontend en desarrollo |

Para generar un `JWT_SECRET` seguro:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## Endpoints

### Auth — `/api/auth`

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| POST | `/signup` | — | Registro de negocio y owner |
| POST | `/login` | — | Login, retorna access token |
| POST | `/refresh` | — | Renueva el access token via refresh token (cookie) |
| POST | `/logout` | — | Revoca el refresh token |
| POST | `/reset-password` | — | Solicita email de reset de contraseña |
| POST | `/password-update` | — | Actualiza contraseña con token de reset |

### Negocios — `/api/business`

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/` | admin | Lista todos los negocios |
| GET | `/:id` | — | Detalle de un negocio |
| POST | `/` | admin, owner | Crear negocio |
| PUT | `/:id` | admin, owner | Actualizar negocio |
| DELETE | `/:id` | admin | Eliminar negocio |

### Categorías — `/api/category`

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| POST | `/` | bearer | Crear categoría |

### Productos — `/api/product`

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/:businessId` | — | Productos de un negocio |
| POST | `/` | admin, owner | Crear producto |
| PUT | `/:id` | admin, owner | Actualizar producto |
| DELETE | `/:id` | admin, owner | Eliminar producto |

### Reservaciones — `/api/reservation`

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| POST | `/` | — | Crear reservación |
| GET | `/:business_id` | admin, owner | Reservaciones de un negocio |
| PUT | `/:id` | admin, owner | Actualizar estado de reservación |

### Horarios — `/api/schedule`

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/:business_id/slots/month` | — | Slots disponibles del mes |
| POST | `/` | admin, owner | Crear horario |
| PUT | `/:id` | admin, owner | Actualizar horario |

---

## Estructura del proyecto

```
src/
├── controllers/       # Manejo de requests y responses
├── services/          # Lógica de negocio
├── models/            # Modelos Sequelize
├── routes/            # Definición de rutas
├── middlewares/       # Autenticación y validación
├── schemas/           # Esquemas Joi
├── utils/             # JWT, rate limiting, cache, fechas
├── config/            # Swagger, configuración de DB
├── modules/
│   └── notifications/ # Servicio de email y templates
├── database/
│   ├── migrations/    # Migraciones Umzug
│   ├── seeders/       # Datos de prueba
│   └── utils/         # Scripts de migración y reset
└── __tests__/         # Tests unitarios
```

---

## Datos demo

Los seeders crean los siguientes usuarios de prueba con contraseña `123456`:

| Email | Rol |
|---|---|
| `admin@example.com` | admin |
| `owner@example.com` | owner |

Y un negocio demo asociado al owner: **Demo Business**.

---

## Resumen rápido

```bash
cp .env.example .env          # 1. Configura variables de entorno
docker compose up db -d       # 2. Levanta la base de datos
npm install                   # 3. Instala dependencias
npm run db:fresh              # 4. Crea tablas y carga datos demo
npm run dev                   # 5. Inicia el servidor
```
