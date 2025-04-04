import Hapi from "@hapi/hapi";
import Inert from "@hapi/inert";
import Vision from "@hapi/vision";
import HapiSwagger from "hapi-swagger";
import { defineRoutes } from "./routes";
import prisma from "./database/dataClient";

const getServer = () => {
  const server = Hapi.server({
    host: "localhost",
    port: 3000,
  });

  return server;
};

export const initializeServer = async () => {
  const server = getServer();

  // Clean database for tests - MOVED TO THE TOP before any operations
  await prisma.item.deleteMany();

  // Register Swagger plugins
  const swaggerOptions = {
    info: {
      title: "Items API Documentation",
      version: "1.0.0",
    },
    grouping: "tags",
    documentationPath: "/docs",
  };

  await server.register([
    Inert,
    Vision,
    {
      plugin: HapiSwagger,
      options: swaggerOptions,
    },
  ]);

  // Define routes after registering plugins
  defineRoutes(server);

  await server.initialize();

  // Connect to the database
  await prisma.$connect();

  return server;
};

export const startServer = async () => {
  const server = getServer();

  // Register Swagger plugins
  const swaggerOptions = {
    info: {
      title: "Items API Documentation",
      version: "1.0.0",
    },
    grouping: "tags",
    documentationPath: "/docs",
  };

  await server.register([
    Inert,
    Vision,
    { plugin: HapiSwagger,
      options: swaggerOptions,
    },
  ]);

  // Define routes after registering plugins
  defineRoutes(server);
  await server.start();

  // Connect to the database
  await prisma.$connect();
  console.log(`Server running on ${server.info.uri}`);
  console.log(`Documentation available at ${server.info.uri}/docs`);
  return server;
};

// Handle graceful shutdown
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
