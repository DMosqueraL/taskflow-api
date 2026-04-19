import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { CommonModule } from 'src/common/common.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    CommonModule,
    AuthModule
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService],
  exports: [ProjectsService],
})
export class ProjectsModule {}
