import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ProjectsService } from '../projects/projects.service';
import { PrismaService } from '../common/services/prisma.service';
import { PaginationDto } from '../common/dto/pagination.dto';
import { AssignTaskDto } from './dto/assign-task.dto';
import { NotificationsService } from 'src/notifications/notifications.service';

@Injectable()
export class TasksService {

  constructor(
    private readonly projectsService: ProjectsService,
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService
  ) { }


  async create(projectId: string, createTaskDto: CreateTaskDto, user: any) {
    // Verificar que el proyecto pertenezca a la organización del usuario
    const project = await this.projectsService.findOne(projectId);
    if (project.organizationId !== user.organizationId) {
      throw new NotFoundException('Project not found');
    }
    return this.prisma.task.create({
      data: {
        ...createTaskDto,
        project: { connect: { id: projectId } },
      },
    });
  }

  async findAll(projectId: string, user: any, paginationDto: PaginationDto) {
    const project = await this.projectsService.findOne(projectId);
    if (project.organizationId !== user.organizationId) {
      throw new NotFoundException('Project not found');
    }
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.task.findMany({
        where: { projectId, deletedAt: null },
        skip,
        take: limit,
      }),
      this.prisma.task.count({
        where: { project, deletedAt: null },
      }),
    ]);

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const task = await this.prisma.task.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });
    if (!task) {
      throw new NotFoundException(`Task with id ${id} not found.`);
    }
    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto) {
    await this.findOne(id);
    return this.prisma.task.update({
      where: { id },
      data: updateTaskDto
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return await this.prisma.task.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  async assign(id: string, assignTaskDto: AssignTaskDto, user: any) {
    const task = await this.findOne(id);

    //verificar que el usuario a asignar exista
    const userAssinged = await this.prisma.user.findUnique({
      where: { id: assignTaskDto.assignedToId },
    });
    if (!userAssinged) {
      throw new NotFoundException(`User not found.`);
    }

    //Actualizar la tarea con el usuario asignado
    const updatedTask = await this.prisma.task.update({
      where: { id },
      data: {
        assignedToId: assignTaskDto.assignedToId,
      },
    });

    //Ingresar el job a la cola de notificaciones
    await this.notificationsService.sendTaskAssigned(task.title, userAssinged.email);

    return updatedTask;
  }
}
