# Reservas Backend — Guía de instalación y ejecución

## Requisitos previos

Asegúrate de tener instalado lo siguiente antes de comenzar:

- [Node.js](https://nodejs.org/) v18 o superior
- [npm](https://www.npmjs.com/) (incluido con Node.js)
- [Docker](https://www.docker.com/) y Docker Compose

---

## 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd reservas-backend
```

---

## 2. Configurar variables de entorno

Copia el archivo de ejemplo y completa los valores:

```bash
cp .env.example .env
```

Abre `.env` y llena cada campo:

```env
# Base de datos
DB_USER=postgres           # usuario de PostgreSQL
DB_NAME=reservas_db        # nombre de la base de datos
DB_PASSWORD=tu_password    # contraseña de PostgreSQL
DB_HOST=localhost          # host (localhost cuando corres fuera de Docker)
DB_PORT=5432               # puerto de PostgreSQL
DB_TIMEZONE=00:00          # zona horaria UTC

# Servidor
PORT=3000                  # puerto en que corre el backend

# Servicio de emails (Resend)
RESEND_API_KEY=re_xxxxxxxx # API key de https://resend.com
EMAIL_FROM=no-reply@tudominio.com
EMAIL_PROVIDER=resend

# URL base del backend
HOST=http://localhost:3000
```

> **Nota:** El campo `HOST` se usa para construir enlaces dentro de los correos electrónicos (ej. confirmación, recuperación de contraseña).

---

## 3. Levantar la base de datos con Docker

```bash
docker-compose up -d
```

Esto crea un contenedor llamado `reservas-database` con PostgreSQL 15.
Los datos se persisten localmente en la carpeta `./postgres/`.

Para verificar que el contenedor está corriendo:

```bash
docker ps
```

Deberías ver `reservas-database` con estado `Up`.

---

## 4. Instalar dependencias

```bash
npm install
```

---

## 5. Ejecutar migraciones

Las migraciones crean todas las tablas en la base de datos:

```bash
npm run migrate
```

Las tablas que se crean son:
- `users`
- `businesses`
- `categories`
- `products`
- `reservations`
- `reservation_products`
- `schedules`

> Si necesitas deshacer las migraciones:
> ```bash
> npm run rollback:migrate
> ```

---

## 6. Ejecutar seeders (datos iniciales) — opcional

```bash
npm run seed
```

> Si necesitas deshacer los seeders:
> ```bash
> npm run rollback:seed
> ```

---

## 7. Iniciar el servidor

### Modo desarrollo (con hot-reload)

```bash
npm run dev
```

El servidor se reinicia automáticamente al guardar cambios.

### Modo producción

```bash
npm run build   # compila TypeScript a JavaScript
npm run start   # ejecuta el servidor compilado
```

---

## Verificar que funciona

Una vez iniciado el servidor, abre tu navegador o usa curl:

```bash
curl http://localhost:3000/
```

Deberías recibir:

```
API WORKING ✅
```

---

## Endpoints disponibles

| Módulo        | Base URL                    |
|---------------|-----------------------------|
| Auth          | `/api/auth`                 |
| Negocios      | `/api/business`             |
| Categorías    | `/api/category`             |
| Productos     | `/api/product`              |
| Reservaciones | `/api/reservation`          |
| Horarios      | `/api/schedule`             |

---

## Resumen rápido

```bash
cp .env.example .env       # 1. Configura variables de entorno
docker-compose up -d       # 2. Levanta la base de datos
npm install                # 3. Instala dependencias
npm run migrate            # 4. Crea las tablas
npm run seed               # 5. (Opcional) Inserta datos iniciales
npm run dev                # 6. Inicia el servidor
```
