import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsService } from './projects.service';
import { CreateProjectUseCase } from './domain/use-cases/create-project.use-case';
import { FindAllProjectsUseCase } from './domain/use-cases/find-all-projects.use-case';
import { FindOneProjectUseCase } from './domain/use-cases/find-one-project.use-case';
import { UpdateProjectUseCase } from './domain/use-cases/update-project.use-case';
import { RemoveProjectUseCase } from './domain/use-cases/remove-project.use-case';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { NotFoundException } from '@nestjs/common';

const mockCreateUC = { execute: jest.fn() };
const mockFindAllUC = { execute: jest.fn() };
const mockFindOneUC = { execute: jest.fn() };
const mockUpdateUC = { execute: jest.fn() };
const mockRemoveUC = { execute: jest.fn() };
const mockCache = {
  get: jest.fn().mockResolvedValue(null),
  set: jest.fn().mockResolvedValue(undefined),
  del: jest.fn().mockResolvedValue(undefined),
};

describe('ProjectsService', () => {
  let service: ProjectsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectsService,
        { provide: CreateProjectUseCase, useValue: mockCreateUC },
        { provide: FindAllProjectsUseCase, useValue: mockFindAllUC },
        { provide: FindOneProjectUseCase, useValue: mockFindOneUC },
        { provide: UpdateProjectUseCase, useValue: mockUpdateUC },
        { provide: RemoveProjectUseCase, useValue: mockRemoveUC },
        { provide: CACHE_MANAGER, useValue: mockCache },
      ],
    }).compile();

    service = module.get<ProjectsService>(ProjectsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated projects', async () => {
      const mockResult = {
        data: [{ id: '1', name: 'Proyecto 1', organizationId: 'org1' }],
        meta: { page: 1, limit: 10, total: 1, totalPages: 1 },
      };
      mockFindAllUC.execute.mockResolvedValue(mockResult);

      const user = { organizationId: 'org1' };
      const pagination = { page: 1, limit: 10 };
      const result = await service.findAll(user, pagination) as any;

      expect(result.data).toEqual(mockResult.data);
      expect(result.meta.total).toBe(1);
    });
  });

  describe('findOne', () => {
    it('should return a project by id', async () => {
      const mockProject = { id: '1', name: 'Proyecto 1' };
      mockFindOneUC.execute.mockResolvedValue(mockProject);

      const result = await service.findOne('1');
      expect(result).toEqual(mockProject);
    });

    it('should throw NotFoundException if project does not exist', async () => {
      mockFindOneUC.execute.mockRejectedValue(new NotFoundException());

      await expect(service.findOne('id-falso')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a new project', async () => {
      const mockProject = { id: '1', name: 'Nuevo', organizationId: 'org1' };
      mockCreateUC.execute.mockResolvedValue(mockProject);

      const dto = { name: 'Nuevo', description: 'Desc' };
      const user = { organizationId: 'org1' };
      const result = await service.create(dto as any, user);

      expect(result).toEqual(mockProject);
    });
  });

  describe('remove', () => {
    it('should soft delete a project', async () => {
      const mockProject = { id: '1', organizationId: 'org1', deletedAt: new Date() };
      mockRemoveUC.execute.mockResolvedValue(mockProject);

      await service.remove('1');
      expect(mockRemoveUC.execute).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException if project does not exist', async () => {
      mockRemoveUC.execute.mockRejectedValue(new NotFoundException());

      await expect(service.remove('id-falso')).rejects.toThrow(NotFoundException);
    });
  });
});