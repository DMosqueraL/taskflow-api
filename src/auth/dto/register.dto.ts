import { IsEmail, IsNotEmpty, IsString, IsUUID, MinLength } from 'class-validator';

export class RegisterDto {

    @IsString({ message: 'El nombre de usuario debe ser una cadena de texto' })
    @IsNotEmpty({ message: 'El nombre de usuario es obligatorio' })
    name!: string;

    @IsEmail({}, { message: 'El correo electrónico no es válido' })
    @IsNotEmpty({ message: 'El correo electrónico es obligatorio' })
    email!: string;

    @IsString({ message: 'La contraseña debe ser una cadena de texto' })
    @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
    password!: string;

    @IsUUID('4', { message: 'El ID de la organización debe ser un UUID válido' })
    @IsNotEmpty({ message: 'El ID de la organización es obligatorio' })
    organizationId!: string;

}
