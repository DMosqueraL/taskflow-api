# TaskFlow — Clean Architecture

> Guía de la arquitectura limpia aplicada al proyecto TaskFlow.
> Patrón de referencia implementado en el módulo Projects, replicable al resto del sistema.

---

## ¿Qué es Clean Architecture?

Clean Architecture separa el código en capas concéntricas donde la **dependencia siempre apunta hacia adentro**. La capa más interna (dominio) no sabe que existen las capas externas (framework, base de datos, HTTP).

```
┌─────────────────────────────────────────────────┐
│                  FRAMEWORK                       │
│  NestJS, Express, Swagger, Guards, Interceptors  │
│  ┌─────────────────────────────────────────────┐ │
│  │              ADAPTADORES                     │ │
│  │  Controllers, Repositories (Prisma), DTOs    │ │
│  │  ┌─────────────────────────────────────────┐ │ │
│  │  │           CASOS DE USO                   │ │ │
│  │  │  CreateProject, FindAllProjects, etc.    │ │ │
│  │  │  ┌─────────────────────────────────────┐ │ │ │
│  │  │  │           DOMINIO                    │ │ │ │
│  │  │  │  Entidades, Interfaces, Reglas       │ │ │ │
│  │  │  │  de negocio puras                    │ │ │ │
│  │  │  └─────────────────────────────────────┘ │ │ │
│  │  └─────────────────────────────────────────┘ │ │
│  └─────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
```

**Regla de oro:** Las capas internas NUNCA importan de las capas externas.

---

## Capas del proyecto

### 1. Dominio (Core)

Puro TypeScript. No importa NestJS, Prisma, Express ni ninguna librería externa. Contiene:

- **Entidades de dominio** — Representan los objetos de negocio con sus reglas
- **Interfaces de repositorio** — Contratos que definen QUÉ operaciones se pueden hacer, no CÓMO
- **Casos de uso** — Orquestan la lógica de negocio usando las interfaces

### 2. Adaptadores (Infrastructure)

Implementaciones concretas de las interfaces del dominio:

- **Repositorios** — Implementan las interfaces usando Prisma, TypeORM, etc.
- **Controllers** — Traducen HTTP a casos de uso
- **DTOs** — Validación de datos de entrada (class-validator)

### 3. Framework

Configuración y pegamento del framework:

- **Módulos** — Configuración de inyección de dependencias
- **Guards, Interceptors, Pipes** — Infraestructura transversal
- **main.ts** — Bootstrap de la aplicación

---

## Estructura de carpetas (módulo Projects)

```
src/projects/
├── domain/                              # CAPA DE DOMINIO (puro TypeScript)
│   ├── entities/
│   │   └── project.entity.ts            # Entidad de dominio con reglas de negocio
│   ├── repositories/
│   │   └── project.repository.ts        # Interface (contrato) del repositorio
│   └── use-cases/
│       ├── create-project.use-case.ts   # Caso de uso: crear proyecto
│       ├── find-all-projects.use-case.ts # Caso de uso: listar proyectos
│       ├── find-one-project.use-case.ts  # Caso de uso: buscar proyecto
│       ├── update-project.use-case.ts    # Caso de uso: actualizar proyecto
│       └── remove-project.use-case.ts    # Caso de uso: soft delete
│
├── infrastructure/                       # CAPA DE ADAPTADORES
│   └── prisma-project.repository.ts     # Implementación con Prisma
│
├── dto/                                  # Validación de entrada
│   ├── create-project.dto.ts
│   └── update-project.dto.ts
│
├── projects.controller.ts                # Controller HTTP
├── projects.service.ts                   # Orquestador (delega a use cases)
└── projects.module.ts                    # Configuración del módulo
```

---

## Componentes en detalle

### Entidad de dominio

```typescript
// src/projects/domain/entities/project.entity.ts

export class ProjectEntity {
  readonly id: string;
  readonly name: string;
  readonly description: string | null;
  readonly organizationId: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly deletedAt: Date | null;

  constructor(props: {
    id: string;
    name: string;
    description: string | null;
    organizationId: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
  }) {
    this.id = props.id;
    this.name = props.name;
    this.description = props.description;
    this.organizationId = props.organizationId;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.deletedAt = props.deletedAt;
  }

  // Reglas de negocio viven aquí
  isDeleted(): boolean {
    return this.deletedAt !== null;
  }

  belongsToOrganization(organizationId: string): boolean {
    return this.organizationId === organizationId;
  }
}
```

**¿Por qué no usar el tipo de Prisma directamente?**
Porque el dominio no debe depender del ORM. Si cambias de Prisma a TypeORM, la entidad de dominio no cambia.

---

### Interface del repositorio

```typescript
// src/projects/domain/repositories/project.repository.ts

import { ProjectEntity } from '../entities/project.entity';

export interface ProjectRepository {
  create(name: string, description: string | null, organizationId: string): Promise<ProjectEntity>;
  findAll(organizationId: string, skip: number, take: number): Promise<ProjectEntity[]>;
  count(organizationId: string): Promise<number>;
  findById(id: string): Promise<ProjectEntity | null>;
  update(id: string, data: Partial<{ name: string; description: string }>): Promise<ProjectEntity>;
  softDelete(id: string): Promise<ProjectEntity>;
}

// Token para inyección de dependencias
export const PROJECT_REPOSITORY = 'PROJECT_REPOSITORY';
```

**¿Qué es esto?**
Un contrato. Dice "cualquier repositorio de proyectos DEBE tener estos métodos". No dice CÓMO implementarlos — eso lo decide la capa de infraestructura.

---

### Implementación del repositorio (Prisma)

```typescript
// src/projects/infrastructure/prisma-project.repository.ts

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/services/prisma.service';
import { ProjectRepository } from '../domain/repositories/project.repository';
import { ProjectEntity } from '../domain/entities/project.entity';

@Injectable()
export class PrismaProjectRepository implements ProjectRepository {

  constructor(private readonly prisma: PrismaService) {}

  async create(name: string, description: string | null, organizationId: string): Promise<ProjectEntity> {
    const project = await this.prisma.project.create({
      data: {
        name,
        description,
        organization: { connect: { id: organizationId } },
      },
    });
    return new ProjectEntity(project);
  }

  async findAll(organizationId: string, skip: number, take: number): Promise<ProjectEntity[]> {
    const projects = await this.prisma.project.findMany({
      where: { organizationId, deletedAt: null },
      skip,
      take,
    });
    return projects.map(p => new ProjectEntity(p));
  }

  async count(organizationId: string): Promise<number> {
    return this.prisma.project.count({
      where: { organizationId, deletedAt: null },
    });
  }

  async findById(id: string): Promise<ProjectEntity | null> {
    const project = await this.prisma.project.findFirst({
      where: { id, deletedAt: null },
    });
    return project ? new ProjectEntity(project) : null;
  }

  async update(id: string, data: Partial<{ name: string; description: string }>): Promise<ProjectEntity> {
    const project = await this.prisma.project.update({
      where: { id },
      data,
    });
    return new ProjectEntity(project);
  }

  async softDelete(id: string): Promise<ProjectEntity> {
    const project = await this.prisma.project.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    return new ProjectEntity(project);
  }
}
```

**Si mañana cambias de Prisma a TypeORM**, solo creas `TypeOrmProjectRepository` que implemente la misma interface. El dominio y los controllers no se tocan.

---

### Casos de uso

```typescript
// src/projects/domain/use-cases/create-project.use-case.ts

import { Inject, Injectable } from '@nestjs/common';
import { ProjectRepository, PROJECT_REPOSITORY } from '../repositories/project.repository';

@Injectable()
export class CreateProjectUseCase {
  constructor(
    @Inject(PROJECT_REPOSITORY) private readonly projectRepo: ProjectRepository,
  ) {}

  async execute(name: string, description: string | null, organizationId: string) {
    return this.projectRepo.create(name, description, organizationId);
  }
}
```

```typescript
// src/projects/domain/use-cases/find-all-projects.use-case.ts

import { Inject, Injectable } from '@nestjs/common';
import { ProjectRepository, PROJECT_REPOSITORY } from '../repositories/project.repository';

@Injectable()
export class FindAllProjectsUseCase {
  constructor(
    @Inject(PROJECT_REPOSITORY) private readonly projectRepo: ProjectRepository,
  ) {}

  async execute(organizationId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.projectRepo.findAll(organizationId, skip, limit),
      this.projectRepo.count(organizationId),
    ]);
    return {
      data,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }
}
```

```typescript
// src/projects/domain/use-cases/find-one-project.use-case.ts

import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ProjectRepository, PROJECT_REPOSITORY } from '../repositories/project.repository';

@Injectable()
export class FindOneProjectUseCase {
  constructor(
    @Inject(PROJECT_REPOSITORY) private readonly projectRepo: ProjectRepository,
  ) {}

  async execute(id: string) {
    const project = await this.projectRepo.findById(id);
    if (!project) throw new NotFoundException('Project not found');
    return project;
  }
}
```

```typescript
// src/projects/domain/use-cases/update-project.use-case.ts

import { Inject, Injectable } from '@nestjs/common';
import { ProjectRepository, PROJECT_REPOSITORY } from '../repositories/project.repository';
import { FindOneProjectUseCase } from './find-one-project.use-case';

@Injectable()
export class UpdateProjectUseCase {
  constructor(
    @Inject(PROJECT_REPOSITORY) private readonly projectRepo: ProjectRepository,
    private readonly findOne: FindOneProjectUseCase,
  ) {}

  async execute(id: string, data: Partial<{ name: string; description: string }>) {
    await this.findOne.execute(id);
    return this.projectRepo.update(id, data);
  }
}
```

```typescript
// src/projects/domain/use-cases/remove-project.use-case.ts

import { Inject, Injectable } from '@nestjs/common';
import { ProjectRepository, PROJECT_REPOSITORY } from '../repositories/project.repository';
import { FindOneProjectUseCase } from './find-one-project.use-case';

@Injectable()
export class RemoveProjectUseCase {
  constructor(
    @Inject(PROJECT_REPOSITORY) private readonly projectRepo: ProjectRepository,
    private readonly findOne: FindOneProjectUseCase,
  ) {}

  async execute(id: string) {
    await this.findOne.execute(id);
    return this.projectRepo.softDelete(id);
  }
}
```

---

### Módulo (inyección de dependencias)

```typescript
// src/projects/projects.module.ts

import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { CommonModule } from '../common/common.module';
import { AuthModule } from '../auth/auth.module';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { PrismaProjectRepository } from './infrastructure/prisma-project.repository';
import { CreateProjectUseCase } from './domain/use-cases/create-project.use-case';
import { FindAllProjectsUseCase } from './domain/use-cases/find-all-projects.use-case';
import { FindOneProjectUseCase } from './domain/use-cases/find-one-project.use-case';
import { UpdateProjectUseCase } from './domain/use-cases/update-project.use-case';
import { RemoveProjectUseCase } from './domain/use-cases/remove-project.use-case';
import { PROJECT_REPOSITORY } from './domain/repositories/project.repository';

@Module({
  imports: [CommonModule, AuthModule],
  controllers: [ProjectsController],
  providers: [
    ProjectsService,
    CreateProjectUseCase,
    FindAllProjectsUseCase,
    FindOneProjectUseCase,
    UpdateProjectUseCase,
    RemoveProjectUseCase,
    {
      provide: PROJECT_REPOSITORY,
      useClass: PrismaProjectRepository, // ← Cambiar aquí para usar otro ORM
    },
  ],
  exports: [ProjectsService],
})
export class ProjectsModule {}
```

---

## Flujo de un request

```
HTTP Request
    │
    ▼
Controller (projects.controller.ts)
    │  Recibe HTTP, valida DTOs, extrae parámetros
    │
    ▼
Service (projects.service.ts)
    │  Orquesta: caché, use cases, lógica transversal
    │
    ▼
Use Case (create-project.use-case.ts)
    │  Lógica de negocio pura
    │  Solo conoce la INTERFACE del repositorio
    │
    ▼
Repository Interface (project.repository.ts)
    │  Contrato: "debe existir un método create()"
    │
    ▼
Repository Implementation (prisma-project.repository.ts)
    │  Implementación concreta con Prisma
    │
    ▼
Base de datos (PostgreSQL)
```

---

## Beneficios

| Beneficio | Descripción |
|-----------|-------------|
| **Testeable** | Los use cases se testean con mocks del repositorio, sin BD real |
| **Intercambiable** | Cambiar Prisma por TypeORM = solo crear nueva implementación |
| **Independiente del framework** | El dominio funciona con NestJS, Express, Fastify o sin framework |
| **Escalable** | Nuevas reglas de negocio van en use cases, no en controllers |
| **Mantenible** | Cada archivo tiene una sola responsabilidad |

---

## Cuándo usar Clean Architecture

**Sí usar cuando:**
- El proyecto va a producción y va a crecer
- Hay múltiples desarrolladores
- La lógica de negocio es compleja
- Necesitas poder cambiar el ORM, framework o BD en el futuro

**No usar cuando:**
- Prototipos rápidos o MVPs
- CRUD simple sin lógica de negocio
- Proyectos pequeños de una sola persona
- La velocidad de desarrollo es prioridad sobre la mantenibilidad

---

## Patrón aplicado en TaskFlow

Clean Architecture se implementó como **patrón de referencia** en el módulo Projects. Los demás módulos (Tasks, Comments, Attachments) mantienen la arquitectura por capas original — el patrón es idéntico y se replica cuando el proyecto lo necesite.

---

## Relación con DDD

| Concepto | Clean Architecture | DDD |
|----------|-------------------|-----|
| **Enfoque** | Dónde poner el código | Cómo modelar el negocio |
| **Entidades** | Objetos con datos | Objetos con identidad y reglas |
| **Repositorios** | Interfaces para acceso a datos | Abstracciones del dominio |
| **Eventos** | No los define | Eventos de dominio (TaskAssigned) |
| **Se pueden combinar** | ✅ | ✅ |

En TaskFlow usamos elementos de ambos: la estructura de capas de Clean Architecture con eventos de dominio de DDD.
