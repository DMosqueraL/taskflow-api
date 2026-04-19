import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ProjectsService } from '../projects/projects.service';
import { PrismaService } from '../common/services/prisma.service';

@Injectable()
export class TasksService {

  constructor(
    private readonly projectsService: ProjectsService,
    private readonly prisma: PrismaService
  ) { }


  async create(projectId: string, createTaskDto: CreateTaskDto) {
    await this.projectsService.findOne(projectId);
    const task = await this.prisma.task.create({
      data: {
        ...createTaskDto, project: {
          connect: { id: projectId },
        }
      },
    });
    return task;
  }

  async findAll(projectId: string) {
    await this.projectsService.findOne(projectId);
    const tasks = await this.prisma.task.findMany({
      where: {
        projectId,
      },
    });
    return tasks;
  }

  async findOne(id: string) {
    const task = await this.prisma.task.findUnique({
      where: {
        id,
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
    await this.prisma.task.delete({
      where: {
        id,
      },
    });
    return { message: 'Task deleted successfully' };
  }
}
