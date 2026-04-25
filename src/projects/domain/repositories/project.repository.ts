import { ProjectEntity } from '../entities/project.entity';

export interface ProjectRepository {
  create(name: string, description: string | null, organizationId: string): Promise<ProjectEntity>;
  findAll(organizationId: string, skip: number, take: number): Promise<ProjectEntity[]>;
  count(organizationId: string): Promise<number>;
  findById(id: string): Promise<ProjectEntity | null>;
  update(id: string, data: Partial<{ name: string; description: string }>): Promise<ProjectEntity>;
  softDelete(id: string): Promise<ProjectEntity>;
}

export const PROJECT_REPOSITORY = 'PROJECT_REPOSITORY';