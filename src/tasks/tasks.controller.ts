import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller()
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post('projects/:projectId/tasks')
  create(@Param('projectId', ParseUUIDPipe) projectId: string, @Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(projectId, createTaskDto);
  }

 @Get('projects/:projectId/tasks')
  findAll(@Param('projectId', ParseUUIDPipe) projectId: string) {
    return this.tasksService.findAll(projectId);
  }

  @Get('tasks/:id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.tasksService.findOne(id);
  }

  @Patch('tasks/:id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.update(id, updateTaskDto);
  }

  @Delete('tasks/:id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.tasksService.remove(id);
  }
}
