# CLAUDE.md — TaskFlow API

## Descripción del proyecto

TaskFlow es un gestor de proyectos SaaS multi-tenant construido con NestJS.
El proyecto evoluciona en 8 niveles de complejidad, desde un CRUD básico hasta un sistema distribuido en producción.
El objetivo es aprender NestJS progresivamente con un proyecto real digno de portafolio.

## Stack tecnológico

- **Framework:** NestJS (TypeScript, CommonJS)
- **ORM:** Prisma (se integra en Nivel 3)
- **Base de datos:** PostgreSQL (se integra en Nivel 3)
- **Caché/Colas:** Redis + BullMQ (se integra en Nivel 6)
- **Auth:** JWT con access + refresh token (se integra en Nivel 4)
- **Testing:** Jest
- **Docs:** Swagger/OpenAPI (se integra en Nivel 7)
- **Contenedores:** Docker + Docker Compose (se integra en Nivel 7)
- **CI/CD:** GitHub Actions (se integra en Nivel 8)
- **Observabilidad:** OpenTelemetry (se integra en Nivel 8)

## Estructura del proyecto

```
src/
├── common/              # Módulo compartido (servicios, pipes, filtros, utils)
├── projects/            # Módulo de proyectos
│   ├── dto/
│   ├── entities/
│   ├── projects.controller.ts
│   ├── projects.module.ts
│   └── projects.service.ts
├── tasks/               # Módulo de tareas
│   ├── dto/
│   ├── entities/
│   ├── tasks.controller.ts
│   ├── tasks.module.ts
│   └── tasks.service.ts
├── app.module.ts
└── main.ts
```

## Roadmap por niveles

### Nivel 1 ✅ — El esqueleto
- CRUD de proyectos y tareas con arrays en memoria
- DTOs validados con class-validator
- Relación projects → tasks vía projectId
- Endpoints: `/projects`, `/projects/:projectId/tasks`, `/tasks/:id`

### Nivel 2 ✅ — Arquitectura modular
- CommonModule con servicios compartidos
- Filtro de excepción global (formato estándar de error)
- Pipe de validación de UUID

### Nivel 3 ✅ — Base de datos real
- Prisma + PostgreSQL
- Modelos: Project, Task, User (sin auth)
- Relaciones: proyecto → tareas (1:N), usuario ↔ proyectos (N:M)
- Migraciones, seed, config por ambiente

### Nivel 4 ✅ — Auth y permisos
- Registro, login, JWT (access + refresh token)
- Modelo Organization (multi-tenant)
- Guards: AuthGuard, RolesGuard
- Roles: ADMIN, LEADER, MEMBER
- Decorador @CurrentUser()
- Filtrado por organizationId

### Nivel 5 ✅ — Pulir y testear
- Interceptor de respuesta estándar: { success, data, meta }
- Paginación genérica
- Soft deletes
- Logging estructurado
- Tests unitarios con Jest (cobertura >70%)

### Nivel 6 ✅ — Features de producto real
- Colas con BullMQ (notificaciones)
- Caché con Redis
- Upload de archivos adjuntos
- Comentarios en tareas
- Tests e2e

### Nivel 7 ✅ — Escalar la arquitectura
- Microservicio de notificaciones
- Rate limiting por tenant
- Swagger auto-generado
- Health checks
- Dockerfile multi-stage

### Nivel 8 ✅ — Producción real
- Clean architecture
- Eventos de dominio
- WebSockets (tiempo real)
- OpenTelemetry (tracing)
- CI/CD con GitHub Actions
- Deploy a cloud

## Convenciones de código

### Nomenclatura
- **Archivos:** kebab-case (`create-project.dto.ts`)
- **Clases:** PascalCase (`ProjectsService`)
- **Variables/funciones:** camelCase (`findAll`, `projectId`)
- **Enums:** PascalCase con valores UPPER_SNAKE_CASE (`TaskStatus.IN_PROGRESS`)

### DTOs
- Usar `class-validator` con mensajes en español
- `CreateDto`: campos requeridos con validación estricta
- `UpdateDto`: extender con `PartialType(CreateDto)`

### Servicios
- Lanzar `NotFoundException` cuando un recurso no existe (usar `throw`, nunca `return`)
- Reutilizar `this.findOne()` internamente en update/remove

### Controllers
- IDs son UUID (string), nunca convertir con `+id`
- `@Controller()` vacío cuando las rutas van en cada decorador

### Módulos
- Exportar servicios que otros módulos necesiten vía `exports`
- Importar módulos externos vía `imports`

## Comandos útiles

```bash
npm run start:dev          # Desarrollo con hot reload
npm run build              # Compilar
npm run test               # Tests unitarios
npm run test:e2e           # Tests e2e
npm run test:cov           # Cobertura
```

## Git workflow

- Rama por nivel: `nivel-1`, `nivel-2`, etc.
- Al completar un nivel: merge a `main`
- Formato de commits: `feat: Nivel X - descripción`
- Repositorio: https://github.com/DMosqueraL/taskflow-api

## Nivel actual: 8 ✅ (completado)

## Deploy a Render

### Paso 1 — Crear PostgreSQL
1. Dashboard → New → Postgres
2. Name: `taskflow-db`, Plan: Free
3. Copiar Internal Database URL

### Paso 2 — Crear Redis
1. Dashboard → New → Key Value
2. Name: `taskflow-redis`, Plan: Free
3. Copiar Internal Redis URL (solo el hostname para REDIS_HOST)

### Paso 3 — Crear Web Service
1. Dashboard → New → Web Service
2. Conectar repo: `DMosqueraL/taskflow-api`
3. Language: Docker, Branch: main, Plan: Free

### Paso 4 — Variables de entorno
```bash
DATABASE_URL=<Internal Database URL de PostgreSQL>
REDIS_HOST=<hostname de Redis sin redis:// ni puerto>
REDIS_PORT=6379
JWT_SECRET=<secreto de producción>
JWT_REFRESH_SECRET=<otro secreto de producción>
PORT=3005
```

### Paso 5 — Verificar
- URL pública: `https://taskflow-api-XXXX.onrender.com/health`
- Logs: Dashboard → Logs
- Auto-deploy: cada push a main despliega automáticamente

## Bonus — Frontend (Next.js)

### Stack
- Next.js 14+ (App Router)
- Tailwind CSS
- Socket.io client (WebSockets)
- Deploy en Vercel

### Páginas
1. `/login` — formulario que consume POST /auth/login
2. `/dashboard` — métricas: total proyectos, tareas por estado, tareas atrasadas
3. `/projects` — lista de proyectos con paginación
4. `/projects/:id` — tablero Kanban (columnas: PENDING, IN_PROGRESS, DONE)
5. Drag & drop para cambiar estado de tareas
6. WebSocket para actualización en tiempo real

### API Base URL
- Local: http://localhost:3005
- Producción: https://taskflow-api-sg4x.onrender.com

### Estado: pendiente

## Notas importantes
- `moduleFormat = "commonjs"` para compatibilidad NestJS
- Cada nivel se construye sobre el anterior — no se descarta código, se evoluciona
- El proyecto es de aprendizaje: priorizar comprensión sobre velocidad
- Clean Architecture: para cambiar de ORM, solo modificar `useClass` en el module del módulo refactorizado (ej: `useClass: TypeOrmProjectRepository` en projects.module.ts). El dominio y los controllers no se tocan.
