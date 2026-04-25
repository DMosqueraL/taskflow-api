import { IsUUID } from "class-validator";

export class AssignTaskDto {

    @IsUUID('4', { message: 'assignedToId debe ser un UUID v4 válido' })
    assignedToId!: string;
}
