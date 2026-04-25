import { IsUUID } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class AssignTaskDto {
    
    @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'ID del usuario al que se asignará la tarea' })
    @IsUUID('4', { message: 'assignedToId debe ser un UUID v4 válido' })
    assignedToId!: string;
}
