/**
 * @title Servicio de Gestión de Ítems
 * @description Capa de servicio para operaciones CRUD de ítems
 * @notice Implementa validación de negocio y persistencia via Prisma
 * @dev Encapsula toda la lógica de acceso a datos para la entidad Item
 * 
 * @module Services
 * @author Luis Grimaldi
 * @version 1.0.0
 */

import prisma from "../database/dataClient";

/**
 * @interface ItemInput
 * @description DTO para creación/actualización de ítems
 * 
 * @property {string} name - Nombre del ítem (requerido)
 * @property {number} price - Precio del ítem (no negativo)
 */
export interface ItemInput {
  name: string;
  price: number;
}

/**
 * @interface Item
 * @description Entidad completa de ítem con identificador
 * 
 * @extends ItemInput
 * @property {number} id - ID único generado por la base de datos
 */
export interface Item {
  id: number;
  name: string;
  price: number;
}

/**
 * @class ItemService
 * @description Servicio para operaciones CRUD de ítems
 * 
 * @method getAllItems - Lista todos los ítems existentes
 * @method getItemById - Obtiene un ítem por su ID
 * @method createItem - Crea un nuevo ítem
 * @method updateItem - Actualiza un ítem existente
 * @method deleteItem - Elimina un ítem
 */
export class ItemService {
  /**
   * @description Obtiene todos los ítems del sistema
   * @returns {Promise<Item[]>} Lista completa de ítems
   * 
   */
  async getAllItems(): Promise<Item[]> {
    return prisma.item.findMany();
  }

  /**
   * @description Busca un ítem por su ID
   * @param {number} id - ID del ítem a buscar
   * @returns {Promise<Item | null>} El ítem encontrado o null
   * 
   * @throws {PrismaClientKnownRequestError} Si hay error de base de datos
   * 
   */
  async getItemById(id: number): Promise<Item | null> {
    return prisma.item.findUnique({
      where: { id },
    });
  }

  /**
   * @description Crea un nuevo ítem en el sistema
   * @param {ItemInput} data - Datos para el nuevo ítem
   * @returns {Promise<Item>} El ítem creado con su ID
   * 
   * @throws {PrismaClientValidationError} Si los datos son inválidos
   * 
   */
  async createItem(data: ItemInput): Promise<Item> {
    return prisma.item.create({
      data,
    });
  }

    /**
   * @description Elimina permanentemente un ítem
   * @param {number} id - ID del ítem a eliminar
   * @returns {Promise<void>}
   * 
   * @throws {PrismaClientKnownRequestError} Si el ítem no existe
   * 
   */
    async deleteItem(id: number): Promise<void> {
      await prisma.item.delete({
        where: { id },
      });
    }

  /**
   * @description Actualiza un ítem existente
   * @param {number} id - ID del ítem a actualizar
   * @param {ItemInput} data - Nuevos datos para el ítem
   * @returns {Promise<Item | null>} El ítem actualizado o null si no existe
   * 
   * @throws {Error} Si ocurre un error durante la actualización
   * 
   */
  async updateItem(id: number, data: ItemInput): Promise<Item | null> {
    try {
      const item = await prisma.item.findUnique({
        where: { id },
      });

      if (!item) {
        return null;
      }

      return await prisma.item.update({
        where: { id },
        data,
      });
    } catch (error) {
      console.error("Error in updateItem:", error);
      throw error;
    }
  }

}
