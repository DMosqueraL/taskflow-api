import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto, RegisterDto } from './dto/index';
import { PrismaService } from 'src/common/services/prisma.service';

@Injectable()
export class AuthService {

    constructor(
        private readonly jwtService: JwtService,
        private readonly prisma: PrismaService
    ) { }

    async register(dto: RegisterDto) {
        const existing = await this.prisma.user.findUnique({
            where: { email: dto.email }
        });
        if (existing)
            throw new ConflictException('El correo electrónico ya está en uso');

        const hashed = await bcrypt.hash(dto.password, 10);
        const user = await this.prisma.user.create({
            data: {
                name: dto.name,
                email: dto.email,
                password: hashed,
                organizationId: dto.organizationId,
            },
        });

        const { password, ...result } = user;
        return result;
    }

    async login(dto: LoginDto) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email }
        });
        if (!user) throw new UnauthorizedException('Credenciales inválidas');

        const valid = await bcrypt.compare(dto.password, user.password);
        if (!valid) throw new UnauthorizedException('Credenciales inválidas');

        const payload = { sub: user.id, email: user.email, role: user.role, organizationId: user.organizationId };

        const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
        const refreshToken = this.jwtService.sign(payload, {
            secret: process.env.JWT_REFRESH_SECRET,
            expiresIn: '7d',
        });

        return { accessToken, refreshToken };
    }

    async refresh(refreshToken: string) {
        try {
            const payload = this.jwtService.verify(refreshToken, {
                secret: process.env.JWT_REFRESH_SECRET,
            });

            const newPayload = {
                sub: payload.sub,
                email: payload.email,
                role: payload.role,
                organizationId: payload.organizationId,
            };

            const accessToken = this.jwtService.sign(newPayload);

            return { accessToken };
        } catch {
            throw new UnauthorizedException('Refresh token inválido o expirado');
        }
    }
}
