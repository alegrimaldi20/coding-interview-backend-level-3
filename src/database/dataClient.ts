/**
 * @title Prisma Client Singleton
 * @description Configuración centralizada del cliente de base de datos Prisma
 * @notice Esta instancia única evita múltiples conexiones a la DB
 * @dev Implementa el patrón Singleton para reutilizar la conexión
 * 
 * @module Database
 * @author Luis Grimaldi
 * @version 1.0.0
 * 
 * @example
 * // Uso típico en servicios:
 * import prisma from './config/prisma';
 * 
 * const items = await prisma.item.findMany();
 */

import { PrismaClient } from "@prisma/client";

/**
 * @dev Instancia única de Prisma Client
 * @type {PrismaClient}
 * 
 * @property {Function} $connect - Establece conexión con la DB
 * @property {Function} $disconnect - Cierra la conexión
 * @property {Object} item - Modelo Item para operaciones CRUD
 */
const prisma = new PrismaClient();

/**
 * @dev Exporta la instancia configurada
 * @type {PrismaClient}
 */
export default prisma;
