import { Inject, Injectable } from '@nestjs/common';
import type { ProjectRepository } from '../repositories/project.repository';
import { PROJECT_REPOSITORY } from '../repositories/project.repository';
import { FindOneProjectUseCase } from './find-one-project.use-case';

@Injectable()
export class UpdateProjectUseCase {
  constructor(
    @Inject(PROJECT_REPOSITORY) private readonly projectRepo: ProjectRepository,
    private readonly findOne: FindOneProjectUseCase,
  ) {}

  async execute(id: string, data: Partial<{ name: string; description: string }>) {
    await this.findOne.execute(id);
    return this.projectRepo.update(id, data);
  }
}