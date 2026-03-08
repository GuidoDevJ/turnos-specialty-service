import swaggerJSDoc from "swagger-jsdoc";

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: "3.0.3",
    info: {
      title: "Turnos Specialty Service",
      version: "1.0.0",
      description: "Microservicio de ABM de especialidades",
    },
    servers: [{ url: "http://localhost:3000" }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        Specialty: {
          type: "object",
          properties: {
            id: { type: "integer" },
            name: { type: "string" },
            description: { type: "string", nullable: true },
            isActive: { type: "boolean" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
          required: ["id", "name", "isActive", "createdAt", "updatedAt"],
        },
        PaginatedSpecialtyResult: {
          type: "object",
          properties: {
            data: {
              type: "array",
              items: { $ref: "#/components/schemas/Specialty" },
            },
            total: { type: "integer" },
            page: { type: "integer" },
            limit: { type: "integer" },
            totalPages: { type: "integer" },
          },
          required: ["data", "total", "page", "limit", "totalPages"],
        },
      },
    },
  },
  // vamos a documentar con JSDoc en routes/controllers
  apis: ["src/infrastructure/http/routes/*.ts"],
});