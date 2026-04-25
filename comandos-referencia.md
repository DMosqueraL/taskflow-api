# Comandos de Referencia — TaskFlow API

## NestJS CLI

```bash
nest new nombre-proyecto              # Crear proyecto nuevo
nest g resource nombre --no-spec      # Generar módulo + controller + service + DTOs (CRUD completo)
nest g module nombre --no-spec        # Generar solo un módulo
nest g service nombre --no-spec       # Generar solo un servicio
nest g controller nombre --no-spec    # Generar solo un controller
```

> `--no-spec` evita generar archivos de test (.spec.ts)
> `--flat` evita crear subcarpeta adicional

## NestJS — Ejecución

```bash
npm run start:dev          # Iniciar en modo desarrollo (hot reload)
npm run build              # Compilar el proyecto
npm run start:prod         # Iniciar en modo producción
npm run test               # Ejecutar tests unitarios
npm run test:e2e           # Ejecutar tests end-to-end
npm run test:cov           # Ejecutar tests con reporte de cobertura
```

## Prisma

```bash
npx prisma init                              # Inicializar Prisma (crea schema.prisma, .env, prisma.config.ts)
npx prisma generate                          # Generar el cliente de Prisma (después de cambiar el schema)
npx prisma migrate dev --name nombre         # Crear y aplicar una migración en desarrollo
npx prisma migrate reset                     # Borrar BD, reaplicar migraciones y correr seed
npx prisma db seed                           # Ejecutar el script de seed manualmente
npx prisma studio                            # Abrir panel web para ver/editar datos de la BD
npx prisma migrate status                    # Ver estado de las migraciones
npx prisma db push                           # Sincronizar schema con BD sin crear migración (prototipado)
```

## npm — Instalación de dependencias

```bash
npm i paquete                  # Instalar dependencia de producción
npm i -D paquete               # Instalar dependencia de desarrollo (devDependency)
npm uninstall paquete          # Desinstalar un paquete
```

### Dependencias usadas en TaskFlow

```bash
# Nivel 1 — Validación
npm i class-validator class-transformer
# uuid reemplazado por crypto.randomUUID() nativo de Node

# Nivel 3 — Base de datos
npm i @prisma/client @prisma/adapter-pg pg dotenv
npm i -D prisma @types/pg tsx

# Nivel 4 — Auth
npm i @nestjs/jwt @nestjs/passport passport passport-jwt bcrypt @nestjs/config
npm i -D @types/passport-jwt @types/bcrypt

# Nivel 5 — Testing
npm i -D @types/jest

# Nivel 6 — Features de producto real
npm i @nestjs/bullmq bullmq                                    # Colas con BullMQ
npm i @nestjs/cache-manager cache-manager cache-manager-redis-yet  # Caché con Redis
npm i @nestjs/platform-express multer                           # Upload de archivos
npm i -D @types/multer supertest @types/supertest cross-env     # Testing e2e y utilidades

# Nivel 7 — Escalar la arquitectura
npm i @nestjs/swagger                         # Documentación OpenAPI/Swagger
npm i @nestjs/terminus                        # Health checks
npm i @nestjs/throttler                       # Rate limiting
```

## Docker

```bash
# Instalación y manejo de containers
docker run -d --name redis -p 6379:6379 redis    # Crear y levantar container de Redis
docker ps                                        # Ver containers corriendo
docker start redis                               # Iniciar container existente
docker stop redis                                # Detener container
docker rm redis                                  # Eliminar container
docker logs redis                                # Ver logs de un container

# Docker Compose (Nivel 7+)
docker compose up -d                             # Levantar todos los servicios en background
docker compose down                              # Detener y eliminar todos los servicios
docker compose logs -f                           # Ver logs en tiempo real
docker compose build                             # Reconstruir imágenes
docker compose ps                                # Ver estado de los servicios

# Docker Build
docker build -t taskflow-api .                   # Construir imagen
docker build -t taskflow-api -f Dockerfile .     # Construir con Dockerfile específico
```

## PostgreSQL (psql)

```bash
psql -U postgres -d taskflow_dev                 # Conectar a la BD
```

```sql
-- Dentro de psql:
SELECT id, name FROM "Project";                  -- Consultar tabla
SELECT id, name, email FROM "User";              -- Ver usuarios
\dt                                              -- Listar todas las tablas
\d "NombreTabla"                                 -- Ver estructura de una tabla
\q                                               -- Salir de psql
```

## Git

```bash
git init                                    # Inicializar repositorio
git add .                                   # Agregar todos los cambios al staging
git commit -m "mensaje"                     # Crear commit con mensaje
git push                                    # Subir cambios al remoto
git push -u origin nombre-rama              # Subir rama nueva al remoto
git checkout -b nombre-rama                 # Crear rama nueva y cambiar a ella
git checkout nombre-rama                    # Cambiar a una rama existente
git merge nombre-rama                       # Fusionar rama al branch actual
git branch -M main                          # Renombrar rama actual a main
git log --oneline -3                        # Ver últimos 3 commits resumidos
git pull --rebase origin main               # Traer cambios remotos y rebasear
git push origin --delete nombre-rama        # Borrar rama remota
git remote add origin URL                   # Vincular repositorio remoto
```

### Convención de commits (Conventional Commits)

```bash
feat: descripción       # Nueva funcionalidad
fix: descripción        # Corrección de bug
docs: descripción       # Cambios en documentación
refactor: descripción   # Refactorización sin cambio de funcionalidad
test: descripción       # Agregar o modificar tests
chore: descripción      # Tareas de mantenimiento
```

## Node.js / Utilidades

```bash
node -e "código"                            # Ejecutar código JS en una línea
# Ejemplo: generar hash con bcrypt
node -e "const bcrypt = require('bcrypt'); bcrypt.hash('admin123', 10).then(h => console.log(h))"
```

## Windows — Solución de problemas

```powershell
# Tomar posesión de una carpeta (permisos)
takeown /f "C:\ruta\carpeta" /r /d S

# Eliminar carpeta con contenido
Remove-Item "C:\ruta\carpeta" -Recurse -Force

# Actualizar WSL (necesario para Docker)
wsl --update
```

## VSCode — Atajos útiles

```
Ctrl + H            # Buscar y reemplazar
Ctrl + Shift + F    # Buscar en todos los archivos del proyecto
Ctrl + Shift + P    # Paleta de comandos
Ctrl + P            # Buscar archivo por nombre
Ctrl + `            # Abrir/cerrar terminal integrada
Ctrl + .            # Quick fix / auto-import
```

## Windows PowerShell

```bash
ls src/ -R           # Listar archivos recursivamente
rm -r carpeta        # Eliminar carpeta con contenido
mkdir carpeta        # Crear carpeta
```
