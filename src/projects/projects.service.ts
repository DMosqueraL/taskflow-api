import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PrismaService } from '../common/services/prisma.service';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class ProjectsService {

  constructor(
    private readonly prisma: PrismaService
  ) { }

  async create(createProjectDto: CreateProjectDto, user: any) {
    return this.prisma.project.create({
      data: {
        name: createProjectDto.name,
        description: createProjectDto.description,
        organization: {
          connect: { id: user.organizationId },
        },
      },
    });
  }

  async findAll(user: any, paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

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

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
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
    return this.prisma.project.update({
      where: { id },
      data: updateProjectDto
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return await this.prisma.project.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}

