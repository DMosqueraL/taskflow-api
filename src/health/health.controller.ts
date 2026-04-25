import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService, PrismaHealthIndicator } from '@nestjs/terminus';
import { PrismaService } from '../common/services/prisma.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';

@SkipThrottle()
@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly prisma: PrismaHealthIndicator,
    private readonly prismaService: PrismaService,
  ) {}

  @Get()
  @HealthCheck()
  @ApiOperation({ summary: 'Health check', description: 'Verifica el estado de la API y sus conexiones' })
  @ApiResponse({ status: 200, description: 'API saludable' })
  @ApiResponse({ status: 503, description: 'API con problemas' })
  check() {
    return this.health.check([
      () => this.prisma.pingCheck('database', this.prismaService),
    ]);
  }
}