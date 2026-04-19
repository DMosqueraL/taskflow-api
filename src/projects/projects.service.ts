import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PrismaService } from '../common/services/prisma.service';

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

  async findAll(user: any) {
    return this.prisma.project.findMany({
      where: { organizationId: user.organizationId },
    });
  }

  async findOne(id: string) {
    const project = await this.prisma.project.findUnique({
      where: {
        id,
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
    await this.prisma.project.delete({
      where: {
        id,
      },
    });
    return { message: 'Project deleted successfully' };
  }
}

