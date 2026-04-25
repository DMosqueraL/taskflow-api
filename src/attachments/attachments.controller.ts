import { Controller, Post, Get, Delete, Param, UseGuards, UseInterceptors, UploadedFile, ParseUUIDPipe } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { randomUUID } from 'crypto';
import { extname } from 'path';
import { AttachmentsService } from './attachments.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

@ApiTags('Attachments')
@ApiBearerAuth()
@Controller()
@UseGuards(AuthGuard)
export class AttachmentsController {

  constructor(private readonly attachmentsService: AttachmentsService) {}

  @Post('tasks/:taskId/attachments')
  @ApiOperation({ summary: 'Subir archivo adjunto', description: 'Permite subir un archivo adjunto a una tarea específica' })
  @ApiResponse({ status: 201, description: 'Archivo adjunto creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  @ApiResponse({ status: 401, description: 'No autenticado' }) 
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const uniqueName = `${randomUUID()}${extname(file.originalname)}`;
        cb(null, uniqueName);
      },
    }),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB máximo
  }))
  upload(
    @Param('taskId', ParseUUIDPipe) taskId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.attachmentsService.create(taskId, file);
  }

  @Get('tasks/:taskId/attachments')
  @ApiOperation({ summary: 'Listar archivos adjuntos', description: 'Retorna una lista de archivos adjuntos asociados a una tarea específica' })
  @ApiResponse({ status: 200, description: 'Lista de archivos adjuntos' })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  findAll(@Param('taskId', ParseUUIDPipe) taskId: string) {
    return this.attachmentsService.findAll(taskId);
  }

  @Delete('attachments/:id')
  @ApiOperation({ summary: 'Eliminar archivo adjunto', description: 'Permite eliminar un archivo adjunto específico por su ID' })
  @ApiResponse({ status: 200, description: 'Archivo adjunto eliminado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.attachmentsService.remove(id);
  }
}