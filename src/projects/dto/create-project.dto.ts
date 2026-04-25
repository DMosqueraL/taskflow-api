import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class CreateProjectDto {
    
    @ApiProperty({ example: 'TaskFlow API', description: 'Nombre del proyecto' })
    @IsString()
    @IsNotEmpty()
    name!: string;

    @ApiProperty({ example: 'Gestor de proyectos SaaS', description: 'Descripción del proyecto', required: false })
    @IsString()
    @IsOptional()
    description?: string;

}
