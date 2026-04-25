import { IsEmail, IsNotEmpty, IsString, IsUUID, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {

    @ApiProperty({ example: 'John Doe', description: 'Nombre completo del usuario' })
    @IsString({ message: 'El nombre de usuario debe ser una cadena de texto' })
    @IsNotEmpty({ message: 'El nombre de usuario es obligatorio' })
    name!: string;

    @ApiProperty({ example: 'john.doe@example.com', description: 'Correo electrónico del usuario' })
    @IsEmail({}, { message: 'El correo electrónico no es válido' })
    @IsNotEmpty({ message: 'El correo electrónico es obligatorio' })
    email!: string;

    @ApiProperty({ example: 'password123', description: 'Contraseña del usuario' })
    @IsString({ message: 'La contraseña debe ser una cadena de texto' })
    @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
    password!: string;

    @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'ID de la organización' })
    @IsUUID('4', { message: 'El ID de la organización debe ser un UUID válido' })
    @IsNotEmpty({ message: 'El ID de la organización es obligatorio' })
    organizationId!: string;

}
