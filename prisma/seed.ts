import { PrismaClient, TaskStatus, TaskPriority, Role } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as pg from 'pg';
import 'dotenv/config';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // Limpiar datos existentes
  await prisma.task.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();
  await prisma.organization.deleteMany();

  // Crear organizaciones
  const org1 = await prisma.organization.create({
    data: { name: 'Acme Corp' },
  });
  const org2 = await prisma.organization.create({
    data: { name: 'Startup XYZ' },
  });

  // Crear usuarios (contraseñas hasheadas después con bcrypt, por ahora placeholder)
  const user1 = await prisma.user.create({
    data: {
      name: 'Doris Mosquera',
      email: 'doris@acme.com',
      password: '$2b$10$dn8Sra/oJfwi2mT6kM7oX.gu1QsXfO94Qo9w1SA8vdz4A8IVxXYAK',
      role: Role.ADMIN,
      organizationId: org1.id,
    },
  });
  const user2 = await prisma.user.create({
    data: {
      name: 'Carlos López',
      email: 'carlos@acme.com',
      password: '$2b$10$dn8Sra/oJfwi2mT6kM7oX.gu1QsXfO94Qo9w1SA8vdz4A8IVxXYAK',
      role: Role.LEADER,
      organizationId: org1.id,
    },
  });
  const user3 = await prisma.user.create({
    data: {
      name: 'Ana García',
      email: 'ana@startup.com',
      password: '$2b$10$dn8Sra/oJfwi2mT6kM7oX.gu1QsXfO94Qo9w1SA8vdz4A8IVxXYAK',
      role: Role.ADMIN,
      organizationId: org2.id,
    },
  });

  // Crear proyectos (cada uno en su organización)
  const project1 = await prisma.project.create({
    data: {
      name: 'TaskFlow API',
      description: 'Gestor de proyectos SaaS',
      organizationId: org1.id,
      members: { connect: [{ id: user1.id }, { id: user2.id }] },
    },
  });
  const project2 = await prisma.project.create({
    data: {
      name: 'Landing Page',
      description: 'Sitio web de marketing',
      organizationId: org2.id,
      members: { connect: [{ id: user3.id }] },
    },
  });

  // Crear 10 tareas
  const tasks = [
    { title: 'Configurar NestJS', status: TaskStatus.DONE, priority: TaskPriority.HIGH, projectId: project1.id },
    { title: 'Diseñar modelos Prisma', status: TaskStatus.DONE, priority: TaskPriority.HIGH, projectId: project1.id },
    { title: 'Implementar auth JWT', status: TaskStatus.IN_PROGRESS, priority: TaskPriority.HIGH, projectId: project1.id },
    { title: 'Crear endpoints CRUD', status: TaskStatus.DONE, priority: TaskPriority.MEDIUM, projectId: project1.id },
    { title: 'Escribir tests unitarios', status: TaskStatus.PENDING, priority: TaskPriority.MEDIUM, projectId: project1.id },
    { title: 'Configurar CI/CD', status: TaskStatus.PENDING, priority: TaskPriority.LOW, projectId: project1.id },
    { title: 'Diseñar hero section', status: TaskStatus.DONE, priority: TaskPriority.HIGH, projectId: project2.id },
    { title: 'Crear formulario contacto', status: TaskStatus.IN_PROGRESS, priority: TaskPriority.MEDIUM, projectId: project2.id },
    { title: 'Optimizar imágenes', status: TaskStatus.PENDING, priority: TaskPriority.LOW, projectId: project2.id },
    { title: 'Deploy a producción', status: TaskStatus.PENDING, priority: TaskPriority.HIGH, projectId: project2.id },
  ];

  for (const task of tasks) {
    await prisma.task.create({ data: task });
  }

  console.log('Seed ejecutado correctamente');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });