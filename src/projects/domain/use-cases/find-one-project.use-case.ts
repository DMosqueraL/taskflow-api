import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { ProjectRepository } from '../repositories/project.repository';
import { PROJECT_REPOSITORY } from '../repositories/project.repository';

@Injectable()
export class FindOneProjectUseCase {
  constructor(
    @Inject(PROJECT_REPOSITORY) private readonly projectRepo: ProjectRepository,
  ) {}

  async execute(id: string) {
    const project = await this.projectRepo.findById(id);
    if (!project) throw new NotFoundException('Project not found');
    return project;
  }
}