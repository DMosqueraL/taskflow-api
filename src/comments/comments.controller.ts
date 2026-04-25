import { Controller, Post, Param, Body, ParseUUIDPipe, Get, Patch, Delete } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { UseGuards } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery, ApiParam } from '@nestjs/swagger';

@ApiTags('Comments')
@Controller()
@UseGuards(AuthGuard)
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) { }

  @Post('tasks/:taskId/comments')
  @ApiParam({ name: 'taskId', description: 'UUID de la tarea', example: '550e8400-e29b-41d4-a716-446655440000' })
  @ApiOperation({ summary: 'Crear comentario', description: 'Crea un nuevo comentario para una tarea específica' })
  @ApiResponse({ status: 201, description: 'Comentario creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  create(@Param('taskId', ParseUUIDPipe) taskId: string, @Body() createCommentDto: CreateCommentDto, @CurrentUser() user) {
    return this.commentsService.create(taskId, createCommentDto, user);
  }

  @Get('tasks/:taskId/comments')
  @ApiParam({ name: 'taskId', description: 'UUID de la tarea', example: '550e8400-e29b-41d4-a716-446655440000' })
  @ApiOperation({ summary: 'Listar comentarios', description: 'Obtiene todos los comentarios para una tarea específica' })
  @ApiResponse({ status: 200, description: 'Comentarios obtenidos exitosamente' })
  findAll(@Param('taskId', ParseUUIDPipe) taskId: string) {
    return this.commentsService.findAll(taskId);
  }

  @Get('comments/:id')
  @ApiParam({ name: 'id', description: 'UUID del comentario', example: '550e8400-e29b-41d4-a716-446655440000' })
  @ApiOperation({ summary: 'Obtener comentario', description: 'Obtiene un comentario específico por su ID' })
  @ApiResponse({ status: 200, description: 'Comentario obtenido exitosamente' })
  @ApiResponse({ status: 404, description: 'Comentario no encontrado' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.commentsService.findOne(id);
  }

  @Patch('comments/:id')
  @ApiParam({ name: 'id', description: 'UUID del comentario', example: '550e8400-e29b-41d4-a716-446655440000' })
  @ApiOperation({ summary: 'Actualizar comentario', description: 'Actualiza un comentario específico por su ID' })
  @ApiResponse({ status: 200, description: 'Comentario actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'Comentario no encontrado' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentsService.update(id, updateCommentDto);
  }

  @Delete('comments/:id')
  @ApiParam({ name: 'id', description: 'UUID del comentario', example: '550e8400-e29b-41d4-a716-446655440000' })
  @ApiOperation({ summary: 'Eliminar comentario', description: 'Elimina un comentario específico por su ID' })
  @ApiResponse({ status: 200, description: 'Comentario eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Comentario no encontrado' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.commentsService.remove(id);
  }
}
