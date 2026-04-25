import { Inject, Injectable } from '@nestjs/common';
import type { ProjectRepository } from '../repositories/project.repository';
import { PROJECT_REPOSITORY } from '../repositories/project.repository';

@Injectable()
export class CreateProjectUseCase {

  constructor(
    @Inject(PROJECT_REPOSITORY) private readonly projectRepo: ProjectRepository,
  ) {}

  async execute(name: string, description: string | null, organizationId: string) {
    return this.projectRepo.create(name, description, organizationId);
  }
}