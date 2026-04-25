import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/services/prisma.service';
import * as fs from 'fs';

@Injectable()
export class AttachmentsService {

  constructor(private readonly prisma: PrismaService) {}

  async create(taskId: string, file: Express.Multer.File) {
    return this.prisma.attachment.create({
      data: {
        filename: file.originalname,
        path: file.path,
        mimetype: file.mimetype,
        size: file.size,
        task: { connect: { id: taskId } },
      },
    });
  }

  async findAll(taskId: string) {
    return this.prisma.attachment.findMany({
      where: { taskId },
    });
  }

  async remove(id: string) {
    const attachment = await this.prisma.attachment.findUnique({
      where: { id },
    });
    if (!attachment) {
      throw new NotFoundException('Attachment not found');
    }

    // Borrar archivo del disco
    if (fs.existsSync(attachment.path)) {
      fs.unlinkSync(attachment.path);
    }

    return this.prisma.attachment.delete({ where: { id } });
  }
}