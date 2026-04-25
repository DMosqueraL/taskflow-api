import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/services/prisma.service';
import { ProjectRepository } from '../domain/repositories/project.repository';
import { ProjectEntity } from '../domain/entities/project.entity';

@Injectable()
export class PrismaProjectRepository implements ProjectRepository {

  constructor(private readonly prisma: PrismaService) {}

  async create(name: string, description: string | null, organizationId: string): Promise<ProjectEntity> {
    const project = await this.prisma.project.create({
      data: {
        name,
        description,
        organization: { connect: { id: organizationId } },
      },
    });
    return new ProjectEntity(project);
  }

  async findAll(organizationId: string, skip: number, take: number): Promise<ProjectEntity[]> {
    const projects = await this.prisma.project.findMany({
      where: { organizationId, deletedAt: null },
      skip,
      take,
    });
    return projects.map(p => new ProjectEntity(p));
  }

  async count(organizationId: string): Promise<number> {
    return this.prisma.project.count({
      where: { organizationId, deletedAt: null },
    });
  }

  async findById(id: string): Promise<ProjectEntity | null> {
    const project = await this.prisma.project.findFirst({
      where: { id, deletedAt: null },
    });
    return project ? new ProjectEntity(project) : null;
  }

  async update(id: string, data: Partial<{ name: string; description: string }>): Promise<ProjectEntity> {
    const project = await this.prisma.project.update({
      where: { id },
      data,
    });
    return new ProjectEntity(project);
  }

  async softDelete(id: string): Promise<ProjectEntity> {
    const project = await this.prisma.project.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    return new ProjectEntity(project);
  }
}