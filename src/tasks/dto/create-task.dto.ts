import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { TaskPriority, TaskStatus } from "../entities/task.entity";
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
   
    @ApiProperty({ example: 'Tarea 1', description: 'Título de la tarea' })
    @IsString()
    @IsNotEmpty()
    title!: string;
    
    @ApiProperty({ example: 'PENDING', description: 'Estado de la tarea' })
    @IsEnum (TaskStatus)
    @IsOptional()
    status?: TaskStatus = TaskStatus.PENDING;

    @ApiProperty({ example: 'MEDIUM', description: 'Prioridad de la tarea' })
    @IsEnum (TaskPriority)
    priority!: TaskPriority;
}