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
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery, ApiParam } from '@nestjs/swagger';

@ApiTags('tasks')
@Controller()
@UseGuards(AuthGuard, RolesGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) { }

  @Post('projects/:projectId/tasks')
  @Roles(Role.ADMIN, Role.LEADER)
  @ApiOperation({ summary: 'Crear tarea', description: 'Crea una nueva tarea en un proyecto específico' })
  @ApiResponse({ status: 201, description: 'Tarea creada exitosamente' })
  create(@Param('projectId', ParseUUIDPipe) projectId: string, @Body() createTaskDto: CreateTaskDto, @CurrentUser() user) {
    return this.tasksService.create(projectId, createTaskDto, user);
  }

  @Get('projects/:projectId/tasks')
  @ApiParam({ name: 'id', description: 'UUID del proyecto', example: '550e8400-e29b-41d4-a716-446655440000' })
  @ApiOperation({ summary: 'Listar tareas', description: 'Obtiene todas las tareas de un proyecto específico' })
  @ApiResponse({ status: 200, description: 'Tareas obtenidas exitosamente' })
  findAll(@Param('projectId', ParseUUIDPipe) projectId: string, @CurrentUser() user, @Query() paginationDto: PaginationDto,) {
    return this.tasksService.findAll(projectId, user, paginationDto);
  }

  @Get('tasks/:id')
  @ApiParam({ name: 'id', description: 'UUID de la tarea', example: '550e8400-e29b-41d4-a716-446655440000' })
  @ApiOperation({ summary: 'Obtener tarea', description: 'Obtiene una tarea específica por su ID' })
  @ApiResponse({ status: 200, description: 'Tarea obtenida exitosamente' })
  @ApiResponse({ status: 404, description: 'Tarea no encontrada' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.tasksService.findOne(id);
  }

  @Patch('tasks/:id')
  @ApiParam({ name: 'id', description: 'UUID de la tarea', example: '550e8400-e29b-41d4-a716-446655440000' })
  @ApiOperation({ summary: 'Actualizar tarea', description: 'Actualiza una tarea específica por su ID' })
  @ApiResponse({ status: 200, description: 'Tarea actualizada exitosamente' })
  @ApiResponse({ status: 404, description: 'Tarea no encontrada' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.update(id, updateTaskDto);
  }

  @Delete('tasks/:id')
  @ApiParam({ name: 'id', description: 'UUID de la tarea', example: '550e8400-e29b-41d4-a716-446655440000' })
  @Roles(Role.ADMIN)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.tasksService.remove(id);
  }

  @Patch('tasks/:id/assign')
  @ApiParam({ name: 'id', description: 'UUID de la tarea', example: '550e8400-e29b-41d4-a716-446655440000' })
  @ApiOperation({ summary: 'Asignar tarea', description: 'Asigna una tarea específica a un usuario' })
  @ApiResponse({ status: 200, description: 'Tarea asignada exitosamente' })
  @ApiResponse({ status: 404, description: 'Tarea no encontrada' })
  @Roles(Role.ADMIN, Role.LEADER)
  assign(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() assignTaskDto: AssignTaskDto,
    @CurrentUser() user,
  ) {
    return this.tasksService.assign(id, assignTaskDto, user);
  }
}
