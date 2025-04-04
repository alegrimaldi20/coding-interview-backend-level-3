import { Server } from "@hapi/hapi";
import { ItemService } from "./services/itemServices";
import { verificationItem } from "./verification/itenVerification";
import Joi from "joi";

/**
 * @title API de Gestión de Ítems
 * @description Define todas las rutas relacionadas con la gestión de ítems
 * @notice Incluye operaciones CRUD para ítems y un endpoint de health check
 * @dev Utiliza Hapi.js como framework y Joi para validaciones
 */
export const defineRoutes = (server: Server) => {
  const itemService = new ItemService();

  /**
   * @title Endpoint de Health Check
   * @description Verifica que el servidor esté en funcionamiento
   * @response {object} 200 - Objeto de estado {ok: boolean}
   */
  server.route({
    method: "GET",
    path: "/ping",
    options: {
      tags: ["api"],
      description: "Health check endpoint",
      response: {
        schema: Joi.object({
          ok: Joi.boolean().required(),
        }),
      },
    },
    handler: async (request, h) => {
      return { ok: true };
    },
  });

  /**
   * @title Obtener todos los ítems
   * @description Retorna una lista completa de todos los ítems disponibles
   * @response {Item[]} 200 - Array de ítems
   */
  server.route({
    method: "GET",
    path: "/items",
    options: {
      tags: ["api", "items"],
      description: "Get all items",
      response: {
        schema: Joi.array().items(
          Joi.object({
            id: Joi.number().required(),
            name: Joi.string().required(),
            price: Joi.number().required(),
          })
        ),
      },
    },
    handler: async (request, h) => {
      return await itemService.getAllItems();
    },
  });

  /**
   * @title Obtener ítem por ID
   * @description Retorna un ítem específico basado en su ID
   * @param {number} id - ID del ítem (en URL path)
   * @response {Item} 200 - Detalles del ítem
   * @response 404 - Ítem no encontrado
   */
  server.route({
    method: "GET",
    path: "/items/{id}",
    options: {
      tags: ["api", "items"],
      description: "Get item by ID",
      validate: {
        params: Joi.object({
          id: Joi.number().required().description("Item ID"),
        }),
      },
      response: {
        schema: Joi.object({
          id: Joi.number().required(),
          name: Joi.string().required(),
          price: Joi.number().required(),
        }).description("Item details"),
        failAction: "log",
      },
    },
    handler: async (request, h) => {
      const id = parseInt(request.params.id);
      const item = await itemService.getItemById(id);

      if (!item) {
        return h.response().code(404);
      }

      return item;
    },
  });

  /**
   * @title Crear nuevo ítem
   * @description Crea un nuevo ítem en el sistema
   * @param {string} name - Nombre del ítem (en body payload)
   * @param {number} price - Precio del ítem (en body payload)
   * @response {Item} 201 - Ítem creado
   * @response {ValidationError[]} 400 - Errores de validación
   */
  server.route({
    method: "POST",
    path: "/items",
    options: {
      tags: ["api", "items"],
      description: "Create a new item",
      validate: {
        payload: Joi.object({
          name: Joi.string().required().description("Item name"),
          price: Joi.number().description("Item price (must be non-negative)"),
        }),
        failAction: (request, h, err) => {
          return h.continue;
        },
      },
      response: {
        schema: Joi.object({
          id: Joi.number().required(),
          name: Joi.string().required(),
          price: Joi.number().required(),
        }).description("Created item"),
        failAction: "log",
        status: {
          400: Joi.object({
            errors: Joi.array()
              .items(
                Joi.object({
                  field: Joi.string().required(),
                  message: Joi.string().required(),
                })
              )
              .required(),
          }).description("Validation Error Response"),
        },
      },
    },
    handler: async (request, h) => {
      const payload = request.payload as any;
      const validationErrors = verificationItem(payload);

      if (validationErrors.length > 0) {
        return h.response({ errors: validationErrors }).code(400);
      }

      const item = await itemService.createItem(payload);
      return h.response(item).code(201);
    },
  });

  /**
   * @title Actualizar ítem
   * @description Actualiza un ítem existente
   * @param {number} id - ID del ítem (en URL path)
   * @param {string} name - Nuevo nombre del ítem (en body payload)
   * @param {number} price - Nuevo precio del ítem (en body payload)
   * @response {Item} 200 - Ítem actualizado
   * @response {ValidationError[]} 400 - Errores de validación
   * @response 404 - Ítem no encontrado
   */
  server.route({
    method: "PUT",
    path: "/items/{id}",
    options: {
      tags: ["api", "items"],
      description: "Update an existing item",
      validate: {
        params: Joi.object({
          id: Joi.number().required().description("Item ID"),
        }),
        payload: Joi.object({
          name: Joi.string().required().description("Item name"),
          price: Joi.number().description("Item price (must be non-negative)"),
        }),
        failAction: (request, h, err) => {
          return h.continue;
        },
      },
      response: {
        schema: Joi.object({
          id: Joi.number().required(),
          name: Joi.string().required(),
          price: Joi.number().required(),
        }).description("Updated item"),
        failAction: "log",
        status: {
          400: Joi.object({
            errors: Joi.array()
              .items(
                Joi.object({
                  field: Joi.string().required(),
                  message: Joi.string().required(),
                })
              )
              .required(),
          }).description("Validation Error Response"),
          404: Joi.any().description("Item not found"),
        },
      },
    },
    handler: async (request, h) => {
      try {
        const id = parseInt(request.params.id);
        const payload = request.payload as any;

        const validationErrors = verificationItem(payload);
        if (validationErrors.length > 0) {
          return h.response({ errors: validationErrors }).code(400);
        }

        const item = await itemService.updateItem(id, payload);

        if (!item) {
          return h.response().code(404);
        }

        return item;
      } catch (error) {
        console.error("Error updating item:", error);
        return h.response({ error: "Internal Server Error" }).code(500);
      }
    },
  });

  /**
   * @title Eliminar ítem
   * @description Elimina un ítem del sistema
   * @param {number} id - ID del ítem a eliminar (en URL path)
   * @response 204 - Ítem eliminado exitosamente
   * @response 404 - Ítem no encontrado
   */
  server.route({
    method: "DELETE",
    path: "/items/{id}",
    options: {
      tags: ["api", "items"],
      description: "Delete an item",
      validate: {
        params: Joi.object({
          id: Joi.number().required().description("Item ID"),
        }),
      },
      response: {
        schema: Joi.object().description("No content"),
        failAction: "log",
      },
    },
    handler: async (request, h) => {
      const id = parseInt(request.params.id);
      const item = await itemService.getItemById(id);

      if (!item) {
        return h.response().code(404);
      }

      await itemService.deleteItem(id);
      return h.response().code(204);
    },
  });
};