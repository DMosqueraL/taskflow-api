import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/common/services/prisma.service';
import { TasksService } from 'src/tasks/tasks.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentsService {

    constructor(
        private readonly prisma: PrismaService,
        private readonly tasksService: TasksService
    ) { }

    async create(taskId: string, createCommentDto: CreateCommentDto, user: any) {
        // Verificar que la tarea exista y pertenezca al usuario
        await this.tasksService.findOne(taskId);
        return this.prisma.comment.create({
            data: {
                ...createCommentDto,
                task: { connect: { id: taskId } },
                user: { connect: { id: user.sub } },
            },
        });
    }

    async findAll(taskId: string) {
        // Verificar que la tarea exista y pertenezca al usuario
        await this.tasksService.findOne(taskId);
        return this.prisma.comment.findMany({
            where: { taskId },
        });
    }

    async findOne(id: string) {
        const comment = await this.prisma.comment.findUnique({
            where: { id },
        });
        if (!comment) {
            throw new NotFoundException(`Comment not found`);
        }
        return comment;
    }

    async update(id: string, updateCommentDto: UpdateCommentDto) {
        await this.findOne(id);
        return this.prisma.comment.update({
            where: { id },
            data: updateCommentDto,
        });
    }

    async remove(id: string) {
        await this.findOne(id);
        return this.prisma.comment.delete({
            where: { id },
        });
    }

}
