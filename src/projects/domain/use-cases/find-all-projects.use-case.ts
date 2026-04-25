import { Inject, Injectable } from '@nestjs/common';
import type { ProjectRepository } from '../repositories/project.repository';
import { PROJECT_REPOSITORY } from '../repositories/project.repository';

@Injectable()
export class FindAllProjectsUseCase {
  constructor(
    @Inject(PROJECT_REPOSITORY) private readonly projectRepo: ProjectRepository,
  ) {}

  async execute(organizationId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.projectRepo.findAll(organizationId, skip, limit),
      this.projectRepo.count(organizationId),
    ]);
    return {
      data,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }
}