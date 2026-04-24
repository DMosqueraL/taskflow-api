import { Test, TestingModule } from "@nestjs/testing";
import { PrismaService } from "../common/services/prisma.service";
import { ProjectsService } from "../projects/projects.service";
import { NotFoundException } from '@nestjs/common';
import { TasksService } from "./tasks.service";

// Mock de ProjectsService
const mockProjectsService = {
  findOne: jest.fn(),
};

describe('TasksService', () => {

  let service: TasksService;
  let prisma: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        PrismaService,
        { provide: ProjectsService, useValue: mockProjectsService },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    prisma = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated tasks for a project', async () => {
      const mockProject = { id: 'proj1', organizationId: 'org1', deletedAt: null };
      const mockTasks = [
        { id: '1', title: 'Tarea 1', projectId: 'proj1', deletedAt: null },
      ];

      // Primero mockea el proyecto, después las tareas
      mockProjectsService.findOne.mockResolvedValue(mockProject);
      prisma.task.findMany.mockResolvedValue(mockTasks);
      prisma.task.count.mockResolvedValue(1);

      const user = { organizationId: 'org1' };
      const pagination = { page: 1, limit: 10 };
      const result = await service.findAll('proj1', user, pagination);

      expect(result.data).toEqual(mockTasks);
      expect(result.meta.total).toBe(1);
      expect(result.meta.page).toBe(1);
    });
  });

  describe('findOne', () => {
    it('should return a task by id', async () => {
      const mockTask = { id: '1', title: 'Tarea 1', deletedAt: null };
      prisma.task.findFirst.mockResolvedValue(mockTask);

      const result = await service.findOne('1');
      expect(result).toEqual(mockTask);
    });

    it('should throw NotFoundException if task not found', async () => {
      prisma.task.findFirst.mockResolvedValue(null);

      await expect(service.findOne('id-falso')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a task', async () => {
      const mockProject = { id: 'proj1', organizationId: 'org1', deletedAt: null };
      const mockTask = { id: '1', title: 'Nueva tarea', projectId: 'proj1' };

      mockProjectsService.findOne.mockResolvedValue(mockProject);
      prisma.task.create.mockResolvedValue(mockTask);

      const dto = { title: 'Nueva tarea', priority: 'HIGH' };
      const user = { organizationId: 'org1' };

      const result = await service.create('proj1', dto as any, user);
      expect(result).toEqual(mockTask);
    });
  });

  describe('remove', () => {
    it('should soft delete a task', async () => {
      const mockTask = { id: '1', title: 'Tarea', deletedAt: null };
      prisma.task.findFirst.mockResolvedValue(mockTask);
      prisma.task.update.mockResolvedValue({ ...mockTask, deletedAt: new Date() });

      await service.remove('1');

      expect(prisma.task.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { deletedAt: expect.any(Date) },
      });
    });

    it('should throw NotFoundException if task does not exist', async () => {
      prisma.task.findFirst.mockResolvedValue(null);

      await expect(service.remove('id-falso')).rejects.toThrow(NotFoundException);
    });
  });
});