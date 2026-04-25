import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, UseGuards, Query } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Role, User } from 'generated/prisma/client';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery, ApiParam } from '@nestjs/swagger';

@ApiTags('Projects')
@ApiBearerAuth()
@Controller('projects')
@UseGuards(AuthGuard, RolesGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) { }

  @Post()
  @Roles(Role.ADMIN, Role.LEADER)
  @ApiOperation({ summary: 'Crear proyecto', description: 'Solo ADMIN y LEADER pueden crear proyectos' })
  @ApiResponse({ status: 201, description: 'Proyecto creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No tiene permisos (rol insuficiente)' })
  create(@Body() createProjectDto: CreateProjectDto, @CurrentUser() user) {
    return this.projectsService.create(createProjectDto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Listar proyectos', description: 'Retorna proyectos paginados de la organización del usuario' })
  @ApiResponse({ status: 200, description: 'Lista de proyectos paginada' })
  @ApiQuery({ name: 'page', required: false, description: 'Número de página' })
  @ApiQuery({ name: 'limit', required: false, description: 'Cantidad de elementos por página' })
  findAll(@Query() paginationDto: PaginationDto, @CurrentUser() user) {
    return this.projectsService.findAll(user, paginationDto);
  }

  @Get(':id')
  @ApiParam({ name: 'id', description: 'UUID del proyecto', example: '550e8400-e29b-41d4-a716-446655440000' })
  @ApiOperation({ summary: 'Obtener proyecto', description: 'Retorna un proyecto específico por su ID' })
  @ApiResponse({ status: 200, description: 'Proyecto encontrado' })
  @ApiResponse({ status: 404, description: 'Proyecto no encontrado' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.projectsService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.LEADER)
  @ApiParam({ name: 'id', description: 'UUID del proyecto', example: '550e8400-e29b-41d4-a716-446655440000' })
  @ApiOperation({ summary: 'Actualizar proyecto', description: 'Solo ADMIN y LEADER pueden actualizar proyectos' })
  @ApiResponse({ status: 200, description: 'Proyecto actualizado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  @ApiResponse({ status: 404, description: 'Proyecto no encontrado' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectsService.update(id, updateProjectDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiParam({ name: 'id', description: 'UUID del proyecto', example: '550e8400-e29b-41d4-a716-446655440000' })
  @ApiOperation({ summary: 'Eliminar proyecto', description: 'Solo ADMIN pueden eliminar proyectos' })
  @ApiResponse({ status: 200, description: 'Proyecto eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Proyecto no encontrado' })
  remove(@Param('id') id: string) {
    return this.projectsService.remove(id);
  }
}
