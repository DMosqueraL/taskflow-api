import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  
  @ApiProperty({ example: 'Este es un comentario', description: 'Contenido del comentario' })
  @IsString()
  @IsNotEmpty()
  content!: string
};