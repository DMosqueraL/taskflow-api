// projects.module.ts
import { Module } from '@nestjs/common';
import { CommonModule } from '../common/common.module';
import { AuthModule } from '../auth/auth.module';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { PrismaProjectRepository } from './infrastructure/prisma-project.repository';
import { CreateProjectUseCase } from './domain/use-cases/create-project.use-case';
import { FindAllProjectsUseCase } from './domain/use-cases/find-all-projects.use-case';
import { FindOneProjectUseCase } from './domain/use-cases/find-one-project.use-case';
import { UpdateProjectUseCase } from './domain/use-cases/update-project.use-case';
import { RemoveProjectUseCase } from './domain/use-cases/remove-project.use-case';
import { PROJECT_REPOSITORY } from './domain/repositories/project.repository';

@Module({
  imports: [CommonModule, AuthModule],
  controllers: [ProjectsController],
  providers: [
    ProjectsService,
    CreateProjectUseCase,
    FindAllProjectsUseCase,
    FindOneProjectUseCase,
    UpdateProjectUseCase,
    RemoveProjectUseCase,
    {
      provide: PROJECT_REPOSITORY,
      useClass: PrismaProjectRepository,
    },
  ],
  exports: [ProjectsService],
})
export class ProjectsModule {}