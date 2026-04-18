import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task, TaskStatus } from './entities/task.entity';
import { ProjectsService } from '../projects/projects.service';
import { v4 as uuidv4 } from 'uuid'

@Injectable()
export class TasksService {

  private tasks: Task[] = []

  constructor(private readonly projectsService: ProjectsService) { }

  create(projectId: string, createTaskDto: CreateTaskDto) {

    this.projectsService.findOne(projectId);

    const task = new Task();
    task.id = uuidv4();
    task.title = createTaskDto.title;
    task.status = createTaskDto.status ?? TaskStatus.PENDING;
    task.priority = createTaskDto.priority
    task.projectId = projectId;
    task.createdAt = new Date();

    this.tasks.push(task);
    return task;
  }

  findAll(projectId: string) {
    this.projectsService.findOne(projectId);
    const tasks = this.tasks.filter(t => t.projectId === projectId)
    return tasks;
  }

  findOne(id: string) {
    const task = this.tasks.find(t => t.id === id);
    if (!task) {
      throw new NotFoundException(`Task with id ${id} not founded.`);
    }
    return task;
  }

  update(id: string, updateTaskDto: UpdateTaskDto) {
    const task = this.findOne(id);
    return Object.assign(task, updateTaskDto);
  }

  remove(id: string) {
    this.findOne(id);

    this.tasks = this.tasks.filter(t => t.id !== id);
    return { message: 'Task deleted successfully' };
  }
}
