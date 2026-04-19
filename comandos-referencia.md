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
npm i class-validator class-transformer uuid
npm i -D @types/uuid

# Nivel 3 — Base de datos
npm i @prisma/client @prisma/adapter-pg pg dotenv
npm i -D prisma @types/pg tsx

# Nivel 4 — Auth
npm i @nestjs/jwt @nestjs/passport passport passport-jwt bcrypt @nestjs/config
npm i -D @types/passport-jwt @types/bcrypt
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

## VSCode — Atajos útiles

```
Ctrl + H            # Buscar y reemplazar
Ctrl + Shift + P    # Paleta de comandos
Ctrl + P            # Buscar archivo por nombre
Ctrl + `            # Abrir/cerrar terminal integrada
```

## Windows PowerShell

```bash
ls src/ -R           # Listar archivos recursivamente
rm -r carpeta        # Eliminar carpeta con contenido
```
