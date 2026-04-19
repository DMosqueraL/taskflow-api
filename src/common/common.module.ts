import { Module } from '@nestjs/common';
import { IdGeneratorService } from './services/id-generator.service';
import { PrismaService } from './services/prisma.service';

@Module({
  providers: [IdGeneratorService, PrismaService],
  exports: [IdGeneratorService, PrismaService],
})
export class CommonModule {}
