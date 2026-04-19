import { IsDate, isNotEmpty, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateProjectDto {
    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsString()
    @IsOptional()
    description?: string;

}
