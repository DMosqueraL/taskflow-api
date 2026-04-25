import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PrismaService } from '../common/services/prisma.service';
import { PaginationDto } from '../common/dto/pagination.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { Inject } from '@nestjs/common';

@Injectable()
export class ProjectsService {

  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cache: Cache,
  ) { }

  async create(createProjectDto: CreateProjectDto, user: any) {
    const project = this.prisma.project.create({
      data: {
        name: createProjectDto.name,
        description: createProjectDto.description,
        organization: {
          connect: { id: user.organizationId },
        },
      },
    });
    await this.invalidateCache(user.organizationId);
    return project;
  }

  async findAll(user: any, paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;
    const cacheKey = `projects:${user.organizationId}:${page}:${limit}`;

    // Buscar en caché primero
    const cached = await this.cache.get(cacheKey);
    if (cached) return cached;

    // Si no hay caché, consultar BD
    const [data, total] = await Promise.all([
      this.prisma.project.findMany({
        where: { organizationId: user.organizationId, deletedAt: null },
        skip,
        take: limit,
      }),
      this.prisma.project.count({
        where: { organizationId: user.organizationId, deletedAt: null },
      }),
    ]);

    const result = {
      data,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };

    // Guardar en caché
    await this.cache.set(cacheKey, result);

    return result;
  }

  async findOne(id: string) {
    const project = await this.prisma.project.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    return project;
  }

  async update(id: string, updateProjectDto: UpdateProjectDto) {
    await this.findOne(id);
    const project = await this.prisma.project.update({
      where: { id },
      data: updateProjectDto
    });
    await this.invalidateCache(project.organizationId);
    return project;
  }

  async remove(id: string) {
    await this.findOne(id);
    const project = await this.prisma.project.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    await this.invalidateCache(project.organizationId);
    return project;
  }

  private async invalidateCache(organizationId: string) {
    await this.cache.del(`projects:${organizationId}:1:10`);
  }

}

