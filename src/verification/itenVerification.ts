/**
 * @title Módulo de Validación de Ítems
 * @description Implementa validaciones para la entidad Item usando Joi
 * @notice Combina validación de esquema con reglas de negocio personalizadas
 * @dev Capa de validación reutilizable para operaciones CRUD
 * 
 * @module Verification
 * @author Luis Grimaldi
 * @version 1.0.0
 */

import Joi from "joi";

/**
 * @interface VerificationError
 * @description Modelo para errores de validación estructurados
 * 
 * @property {string} field - Nombre del campo con error
 * @property {string} message - Mensaje descriptivo del error
 * 
 * @example
 * {
 *   field: "price",
 *   message: "Field cannot be negative"
 * }
 */
export interface VerificationError {
  field: string;
  message: string;
}

/**
 * @function verificationItem
 * @description Valida los datos de un Item contra reglas de esquema y negocio
 * 
 * @param {any} data - Objeto con datos a validar
 * @returns {VerificationError[]} Lista de errores de validación (vacía si es válido)
 * 
 * @throws {Joi.ValidationError} Solo si hay error interno de Joi (no para validaciones normales)
 * 
 * @example
 * const errors = verificationItem({ name: "", price: -10 });
 * // Retorna:
 * // [
 * //   { field: "name", message: "Field is required" },
 * //   { field: "price", message: "Field cannot be negative" }
 * // ]
 */
export const verificationItem = (data: any): VerificationError[] => {
  /**
   * @schema itemValidationSchema
   * @description Esquema base de validación con Joi
   * 
   * @rule name - Requerido, debe ser string
   * @rule price - Requerido, debe ser número no negativo
   */
  const schema = Joi.object({
    name: Joi.string().required(),
    price: Joi.number().required().min(0),
  });

  // Validación sin abortar ante primer error
  const { error } = schema.validate(data, { abortEarly: false });

  if (!error) return [];

  /**
   * @description Mapea errores de Joi a formato estandarizado
   * @dev Añade lógica especial para campos numéricos
   */
  return error.details.map((detail) => {
    const field = detail.path[0].toString();

    // Validación especial para campo price
    if (field === "price") {
      if (!data.price && data.price !== 0) {
        return {
          field,
          message: `Field "${field}" is required`,
        };
      }

      if (data.price < 0) {
        return {
          field,
          message: `Field "${field}" cannot be negative`,
        };
      }
    }

    // Caso general para otros campos
    return {
      field,
      message: `Field "${field}" is required`,
    };
  });
};