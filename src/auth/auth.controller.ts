import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RefreshDto, RegisterDto } from './dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery, ApiParam } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Registrar usuario', description: 'Crea un nuevo usuario en el sistema' })
  @ApiResponse({ status: 201, description: 'Usuario registrado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  } 

  @Post('login')
  @ApiOperation({ summary: 'Iniciar sesión', description: 'Autentica un usuario y devuelve tokens de acceso y refresco' })
  @ApiResponse({ status: 200, description: 'Inicio de sesión exitoso' })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refrescar token', description: 'Genera un nuevo token de acceso usando un token de refresco válido' })
  @ApiResponse({ status: 200, description: 'Token refrescado exitosamente' })
  @ApiResponse({ status: 401, description: 'Token de refresco inválido' })
  refresh(@Body() dto: RefreshDto) {
    return this.authService.refresh(dto.refreshToken);
  }
}
