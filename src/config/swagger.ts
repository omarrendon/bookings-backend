import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Reservas API",
      version: "1.0.0",
      description: "API REST para gestión de reservas, negocios, productos y horarios.",
    },
    servers: [{ url: "/api" }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        Error: {
          type: "object",
          properties: {
            message: { type: "string" },
            success: { type: "boolean", example: false },
          },
        },
        LoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", format: "email" },
            password: { type: "string", minLength: 6 },
          },
        },
        LoginResponse: {
          type: "object",
          properties: {
            message: { type: "string" },
            success: { type: "boolean" },
            data: {
              type: "object",
              properties: {
                token: { type: "string" },
                user: {
                  type: "object",
                  properties: {
                    id: { type: "integer" },
                    name: { type: "string" },
                    email: { type: "string" },
                    role: { type: "string", enum: ["admin", "owner", "user"] },
                  },
                },
              },
            },
          },
        },
        Reservation: {
          type: "object",
          properties: {
            id: { type: "integer" },
            business_id: { type: "integer" },
            customer_name: { type: "string" },
            customer_email: { type: "string" },
            start_time: { type: "string", format: "date-time" },
            end_time: { type: "string", format: "date-time" },
            status: { type: "string", enum: ["pending", "confirmed", "cancelled", "completed"] },
          },
        },
        Business: {
          type: "object",
          properties: {
            id: { type: "integer" },
            name: { type: "string" },
            description: { type: "string" },
            city: { type: "string" },
            state: { type: "string" },
            is_verified: { type: "boolean" },
          },
        },
      },
    },
    tags: [
      { name: "Auth", description: "Autenticacion y gestion de sesion" },
      { name: "Business", description: "Gestion de negocios" },
      { name: "Reservation", description: "Gestion de reservaciones" },
      { name: "Product", description: "Gestion de productos/servicios" },
      { name: "Schedule", description: "Gestion de horarios" },
      { name: "Category", description: "Gestion de categorias" },
    ],
    paths: {
      "/auth/login": {
        post: {
          tags: ["Auth"],
          summary: "Iniciar sesion",
          requestBody: {
            required: true,
            content: { "application/json": { schema: { $ref: "#/components/schemas/LoginRequest" } } },
          },
          responses: {
            200: { description: "Login exitoso", content: { "application/json": { schema: { $ref: "#/components/schemas/LoginResponse" } } } },
            400: { description: "Validacion fallida", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
            401: { description: "Credenciales invalidas", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          },
        },
      },
      "/auth/singup": {
        post: {
          tags: ["Auth"],
          summary: "Registrar nuevo usuario owner",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["name", "email", "password"],
                  properties: {
                    name: { type: "string" },
                    email: { type: "string", format: "email" },
                    password: { type: "string", minLength: 6 },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: "Usuario creado exitosamente" },
            400: { description: "Validacion fallida o usuario existente" },
          },
        },
      },
      "/auth/reset-password": {
        post: {
          tags: ["Auth"],
          summary: "Solicitar reset de contraseña",
          requestBody: {
            required: true,
            content: { "application/json": { schema: { type: "object", required: ["email"], properties: { email: { type: "string", format: "email" } } } } },
          },
          responses: { 200: { description: "Correo de recuperacion enviado" } },
        },
      },
      "/auth/password-update": {
        post: {
          tags: ["Auth"],
          summary: "Actualizar contraseña con token",
          requestBody: {
            required: true,
            content: { "application/json": { schema: { type: "object", required: ["token", "newPassword"], properties: { token: { type: "string" }, newPassword: { type: "string" } } } } },
          },
          responses: {
            200: { description: "Contraseña actualizada" },
            500: { description: "Token invalido o expirado", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          },
        },
      },
      "/auth/refresh": {
        post: {
          tags: ["Auth"],
          summary: "Renovar access token usando refresh token (cookie)",
          responses: {
            200: { description: "Nuevo access token generado" },
            401: { description: "Refresh token invalido o expirado" },
          },
        },
      },
      "/auth/logout": {
        post: {
          tags: ["Auth"],
          summary: "Cerrar sesion e invalidar refresh token",
          responses: { 200: { description: "Sesion cerrada exitosamente" } },
        },
      },
      "/business": {
        get: {
          tags: ["Business"],
          summary: "Obtener todos los negocios",
          responses: { 200: { description: "Lista de negocios" } },
        },
        post: {
          tags: ["Business"],
          summary: "Crear negocio",
          security: [{ bearerAuth: [] }],
          responses: { 201: { description: "Negocio creado" }, 400: { description: "Error de validacion" } },
        },
      },
      "/business/{id}": {
        get: {
          tags: ["Business"],
          summary: "Obtener negocio por ID",
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
          responses: { 200: { description: "Negocio encontrado", content: { "application/json": { schema: { $ref: "#/components/schemas/Business" } } } }, 404: { description: "No encontrado" } },
        },
        put: {
          tags: ["Business"],
          summary: "Actualizar negocio",
          security: [{ bearerAuth: [] }],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
          responses: { 200: { description: "Negocio actualizado" }, 404: { description: "No encontrado" } },
        },
        delete: {
          tags: ["Business"],
          summary: "Eliminar negocio",
          security: [{ bearerAuth: [] }],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
          responses: { 200: { description: "Negocio eliminado" } },
        },
      },
      "/reservation/{business_id}": {
        get: {
          tags: ["Reservation"],
          summary: "Obtener reservaciones de un negocio",
          security: [{ bearerAuth: [] }],
          parameters: [{ name: "business_id", in: "path", required: true, schema: { type: "integer" } }],
          responses: { 200: { description: "Lista de reservaciones" } },
        },
      },
      "/reservation": {
        post: {
          tags: ["Reservation"],
          summary: "Crear reservacion",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["business_id", "customer_name", "customer_email", "start_time", "products"],
                  properties: {
                    business_id: { type: "integer" },
                    customer_name: { type: "string" },
                    customer_email: { type: "string", format: "email" },
                    start_time: { type: "string", format: "date-time" },
                    products: { type: "array", items: { type: "object", properties: { product_id: { type: "string" }, quantity: { type: "integer" } } } },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: "Reservacion creada", content: { "application/json": { schema: { $ref: "#/components/schemas/Reservation" } } } },
            400: { description: "Datos invalidos" },
            409: { description: "Conflicto de horario" },
          },
        },
      },
      "/reservation/{id}/status": {
        patch: {
          tags: ["Reservation"],
          summary: "Actualizar estado de reservacion",
          security: [{ bearerAuth: [] }],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
          requestBody: {
            required: true,
            content: { "application/json": { schema: { type: "object", required: ["status"], properties: { status: { type: "string", enum: ["pending", "confirmed", "cancelled", "completed"] } } } } },
          },
          responses: { 200: { description: "Estado actualizado" }, 500: { description: "Error del servidor" } },
        },
      },
      "/schedule/{business_id}/slots/month": {
        get: {
          tags: ["Schedule"],
          summary: "Obtener slots disponibles del mes para un negocio",
          parameters: [
            { name: "business_id", in: "path", required: true, schema: { type: "integer" } },
            { name: "date", in: "query", required: true, schema: { type: "string", format: "date" }, description: "Cualquier fecha dentro del mes deseado (YYYY-MM-DD)" },
          ],
          responses: { 200: { description: "Slots del mes" }, 400: { description: "Fecha requerida" } },
        },
      },
    },
  },
  apis: [],
};

export const swaggerSpec = swaggerJsdoc(options);
