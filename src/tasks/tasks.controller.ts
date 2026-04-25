import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, UseGuards, Query } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Role } from 'generated/prisma/client';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { AssignTaskDto } from './dto/assign-task.dto';

@Controller()
@UseGuards(AuthGuard, RolesGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) { }

  @Post('projects/:projectId/tasks')
  @Roles(Role.ADMIN, Role.LEADER)
  create(@Param('projectId', ParseUUIDPipe) projectId: string, @Body() createTaskDto: CreateTaskDto, @CurrentUser() user) {
    return this.tasksService.create(projectId, createTaskDto, user);
  }

  @Get('projects/:projectId/tasks')
  findAll(@Param('projectId', ParseUUIDPipe) projectId: string, @CurrentUser() user, @Query() paginationDto: PaginationDto,) {
    return this.tasksService.findAll(projectId, user, paginationDto);
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
  @Roles(Role.ADMIN)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.tasksService.remove(id);
  }

  @Patch('tasks/:id/assign')
  @Roles(Role.ADMIN, Role.LEADER)
  assign(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() assignTaskDto: AssignTaskDto,
    @CurrentUser() user,
  ) {
    return this.tasksService.assign(id, assignTaskDto, user);
  }
}
