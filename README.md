# Challenge Backend El Dorado

## Descripción

API REST robusta diseñada para gestionar operaciones CRUD sobre entidades de tipo Item, implementando mejores prácticas de desarrollo backend con:

- Persistencia de datos mediante SQLite con Prisma ORM

- Validaciones exhaustivas a nivel de ruta y negocio

- Documentación automática con Swagger UI

- Suite de pruebas E2E completa

- Arquitectura escalable preparada para crecimiento

## Stack Tecnologico

### Core

⚙ Node.js + TypeScript – Base del proyecto, combinando el rendimiento de Node.js con el tipado estático de TypeScript para mayor robustez.

🚀 Hapi.js – Framework web elegido por su:

- Arquitectura modular y escalable

- Soporte nativo para validación (Joi)

- Generación automática de documentación (Swagger)

- Enfoque declarativo en la definición de rutas

### Base de Datos
🔷 Prisma – ORM moderno que ofrece:

- Tipado seguro en consultas y modelos

- Sintaxis intuitiva para operaciones CRUD

- Migraciones automatizadas

- Compatibilidad con múltiples bases de datos

🗃 SQLite – Motor de base de datos ligero y autocontenido, ideal para:

- Desarrollo local y testing

- Prototipado rápido

- Aplicaciones con persistencia simple

### Validación

✅ Joi – Biblioteca de validación de esquemas, utilizada para:

- Garantizar la integridad de datos en payloads y parámetros

- Mensajes de error personalizables

- Validación en capas (formato + reglas de negocio)

### Testing
🧪 Jest – Framework de testing completo que permite:

- Pruebas unitarias e integración

- Snapshots y mocks sencillos

- Cobertura de código integrada

### Documentación
📚 Swagger (hapi-swagger) – Genera documentación interactiva automáticamente, ofreciendo:

- Interfaz web para explorar endpoints

- Ejemplos de requests/responses

- Soporte para autenticación en la documentación


## Requisitos Previos

- Node.js (versión 16 o superior)
- npm o yarn

## Instalación

```bash
# Clonar el repositorio
git clone https://github.com/alegrimaldi20/coding-interview-backend-level-3

# Instalar dependencias
npm install
```

## Estructura del Proyecto

```
/
├── e2e/                   # Tests end-to-end
├── prisma/                # Configuración de Prisma y migraciones
│   ├── migrations/        # Migraciones de base de datos
│   └── schema.prisma      # Esquema de Prisma
├── src/                   # Código fuente
│   ├── database/          # Configuración de la base de datos
│   │   └── dataClient.ts      # Cliente Prisma
│   ├── services/          # Lógica de negocio
│   │   └── itemServices.ts # Servicio para operaciones con items
│   ├── verification/        # Validaciones
│   │   └── itemVerification.ts # Verificacion de items
│   ├── index.ts          # Punto de entrada
│   ├── routes.ts          # Definición de rutas 
│   └── server.ts           # Configuración del servidor
├── .env                   # Variables de entorno
└── package.json           # Dependencias y scripts
```

### Ejecucion del Proyecto

El proyecto usa SQLite como base de datos, que se configura automáticamente. El archivo `.env` ya contiene la configuración:

```
DATABASE_URL="file:./dev.db"
```

### Migraciones

Antes de iniciar el servidor, debes aplicar las migraciones para crear la estructura de la base de datos:

```bash
npm run db:migrate
```
#### Modo Desarrollo

```bash
npm run dev
```

#### Modo Producción

```bash
npm run build
npm start
```

### Pruebas

```bash
npm test
```

### Explorar Base de Datos

```bash
npm run db:studio
```

Prisma Studio en http://localhost:5555 para ver y manipular los datos.

## Documentación de la API

Accede a la documentación interactiva (Swagger) en http://localhost:3000/docs cuando el servidor esté en ejecución.

## Decisiones Técnicas

### Hapi

✔ **Definición estructurada de rutas** – Configuración clara de endpoints, métodos HTTP y manejadores.

✔ **Validación integrada con Joi** – Soporte nativo para esquemas de validación de payloads y parámetros.

✔ **Documentación automática** – Integración con Swagger/OpenAPI para generar documentación interactiva sin esfuerzo.

✔ **Arquitectura modular** – Enfoque basado en plugins para extender funcionalidades (autenticación, logging, etc.).

### Prisma + SQLite: Productividad y Flexibilidad
Prisma (ORM moderno) combinado con SQLite (base de datos ligera) ofrece:

✔ **Tipado seguro** – Generación automática de tipos para modelos y consultas.

✔ **Rápido desarrollo** – Migraciones simples y operaciones CRUD con sintaxis declarativa.

✔ **Escalabilidad adaptable** – SQLite es ideal para prototipado, mientras Prisma permite migrar fácilmente a PostgreSQL/MySQL.

### Validación en Dos Niveles

El sistema implementa un esquema de validación robusto que opera en dos capas:

#### Validación de Formatos

- Aprovecha las capacidades nativas de Hapi.js junto con Joi para garantizar que parámetros y payloads cumplan con la estructura esperada (tipos de datos, formatos básicos, etc.).

#### Validación de Reglas de Negocio

- Lógica adicional implementada en `itemVerification.ts` donde se aplican reglas específicas del dominio (ej. restricciones comerciales o condiciones complejas).

### Arquitectura sin Capa de Controladores Explícitos

En este proyecto, he optado por un enfoque arquitectónico que prescinde de controladores como capa separada, integrando su funcionalidad directamente en los handlers de las rutas. Esta decisión se alinea con las convenciones de Hapi.js, donde los handlers actúan como controladores únicos, consolidando en un mismo lugar toda la lógica del endpoint: validación, procesamiento y generación de respuestas.

Al eliminar la distinción artificial entre rutas y controladores, se reduce la complejidad de la estructura, se mejora la cohesión del código y se mantiene una trazabilidad más clara entre las definiciones de rutas y su implementación.
