/**
 * @title Punto de Entrada de la Aplicación
 * @description Configuración e inicialización del servidor Hapi.js
 * @notice Maneja el ciclo de vida completo del servidor
 * @dev Implementa patrones para gestión de errores y shutdown graceful
 * 
 * @module Main
 * @author Luis Grimaldi
 * @version 1.0.0
 */

import { initializeServer, startServer } from "./server";

/**
 * @event unhandledRejection
 * @description Manejador global para promesas no capturadas
 * @listens process#unhandledRejection
 * 
 * @param {Error} err - Error no capturado
 * @action Registra el error y termina el proceso con código 1
 * 
 * @example
 * // Si una promesa es rechazada sin .catch():
 * Promise.reject(new Error('Fallo crítico'));
 */
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Promise Rejection:", err);
  process.exit(1);
});

/**
 * @event uncaughtException
 * @description [RECOMENDADO] Manejador para excepciones no capturadas
 * @listens process#uncaughtException
 * 
 * @example
 * // Añadir al inicio del archivo:
 * process.on('uncaughtException', (err) => {
 *   console.error('Uncaught Exception:', err);
 *   process.exit(1);
 * });
 */

/**
 * @function anonymous
 * @description Función autoinvocada que inicia el servidor
 * @async
 * @IIFE (Immediately Invoked Function Expression)
 * 
 * @throws {Error} - Si falla la inicialización del servidor
 * 
 * @example
 * // Flujo exitoso:
 * 1. Inicializa dependencias
 * 2. Inicia servidor
 * 3. Logea éxito en consola
 * 
 * // Flujo con error:
 * 1. Detecta error en inicialización
 * 2. Logea error crítico
 * 3. Termina proceso con código 1
 */
(async () => {
  try {
    /**
     * @step 1 - Inicialización del servidor
     * @description Configura rutas, plugins y middleware
     */
    await initializeServer();
    
    /**
     * @step 2 - Arranque del servidor
     * @description Inicia el listener HTTP/HTTPS
     */
    await startServer();
    
    console.log(`Server running at: ${process.env.HOST || 'localhost'}:${process.env.PORT || 3000}`);
  } catch (error) {
    console.error("[FATAL] Server startup error:", error);
    
    /**
     * @action Shutdown graceful
     * @description Termina el proceso con código de error
     * @exitcode 1 - Error general
     */
    process.exit(1);
  }
})();