import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { TaskPriority, TaskStatus } from "../entities/task.entity";

export class CreateTaskDto {
   
    @IsString()
    @IsNotEmpty()
    title!: string;

    @IsEnum (TaskStatus)
    @IsOptional()
    status?: TaskStatus = TaskStatus.PENDING;

    @IsEnum (TaskPriority)
    priority!: TaskPriority;
}