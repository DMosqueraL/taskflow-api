// projects.service.ts
import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { CreateProjectUseCase } from './domain/use-cases/create-project.use-case';
import { FindAllProjectsUseCase } from './domain/use-cases/find-all-projects.use-case';
import { FindOneProjectUseCase } from './domain/use-cases/find-one-project.use-case';
import { UpdateProjectUseCase } from './domain/use-cases/update-project.use-case';
import { RemoveProjectUseCase } from './domain/use-cases/remove-project.use-case';

@Injectable()
export class ProjectsService {

  constructor(
    private readonly createProjectUC: CreateProjectUseCase,
    private readonly findAllProjectsUC: FindAllProjectsUseCase,
    private readonly findOneProjectUC: FindOneProjectUseCase,
    private readonly updateProjectUC: UpdateProjectUseCase,
    private readonly removeProjectUC: RemoveProjectUseCase,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  async create(createProjectDto: CreateProjectDto, user: any) {
    const project = await this.createProjectUC.execute(
      createProjectDto.name,
      createProjectDto.description ?? null,
      user.organizationId,
    );
    await this.invalidateCache(user.organizationId);
    return project;
  }

  async findAll(user: any, paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;
    const cacheKey = `projects:${user.organizationId}:${page}:${limit}`;

    const cached = await this.cache.get(cacheKey);
    if (cached) return cached;

    const result = await this.findAllProjectsUC.execute(user.organizationId, page, limit);

    await this.cache.set(cacheKey, result);
    return result;
  }

  async findOne(id: string) {
    return this.findOneProjectUC.execute(id);
  }

  async update(id: string, updateProjectDto: UpdateProjectDto) {
    const project = await this.updateProjectUC.execute(id, updateProjectDto);
    await this.invalidateCache(project.organizationId);
    return project;
  }

  async remove(id: string) {
    const project = await this.removeProjectUC.execute(id);
    await this.invalidateCache(project.organizationId);
    return project;
  }

  private async invalidateCache(organizationId: string) {
    await this.cache.del(`projects:${organizationId}:1:10`);
  }
}