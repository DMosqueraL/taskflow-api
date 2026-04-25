import { Controller, Post, Get, Delete, Param, UseGuards, UseInterceptors, UploadedFile, ParseUUIDPipe } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { randomUUID } from 'crypto';
import { extname } from 'path';
import { AttachmentsService } from './attachments.service';
import { AuthGuard } from '../auth/guards/auth.guard';

@Controller()
@UseGuards(AuthGuard)
export class AttachmentsController {

  constructor(private readonly attachmentsService: AttachmentsService) {}

  @Post('tasks/:taskId/attachments')
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
  findAll(@Param('taskId', ParseUUIDPipe) taskId: string) {
    return this.attachmentsService.findAll(taskId);
  }

  @Delete('attachments/:id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.attachmentsService.remove(id);
  }
}