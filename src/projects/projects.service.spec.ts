import { Test, TestingModule } from "@nestjs/testing";
import { PrismaService } from "../common/services/prisma.service";
import { ProjectsService } from "./projects.service";
import { NotFoundException } from '@nestjs/common';

//Mock de PrismaService - Simulamos la BD para las pruebas
const mockPrisma = {
    project: {
        create: jest.fn(),
        findMany: jest.fn(),
        findFirst: jest.fn(),
        update: jest.fn(),
        count: jest.fn(),
    },
};

describe('ProjectsService', () => {

    let service: ProjectsService;
    let prisma: any;

    //Antes de cada test, se crea una instancia limpia del servicio
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ProjectsService,
                PrismaService,
            ],
        }).compile();

        service = module.get<ProjectsService>(ProjectsService);
        prisma = module.get<PrismaService>(PrismaService);

        //Limpiar los mocks antes de cada test para evitar interferencias
        jest.clearAllMocks();
    });

    //Test #1: Verificar que el servicio exista
    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    //Test #2: Verificar que findAll retorna todos los proyectos
    describe('findAll', () => {
        it('should return paginated projects', async () => {
            const mockProjects = [
                { id: '1', name: 'Proyecto 1', organizationId: 'org1', deletedAt: null },
                { id: '2', name: 'Proyecto 2', organizationId: 'org1', deletedAt: null },
            ];
            prisma.project.findMany.mockResolvedValue(mockProjects);
            prisma.project.count.mockResolvedValue(2);

            const user = { organizationId: 'org1' };
            const pagination = { page: 1, limit: 10 };

            const result = await service.findAll(user, pagination);

            expect(result.data).toEqual(mockProjects);
            expect(result.meta.total).toBe(2);
            expect(result.meta.page).toBe(1);
        });
    });

    //Test #3: Verificar que findOne retorna un proyecto específico
    describe('findOne', () => {
        it('should return a project by id', async () => {
            const mockProject = { id: '1', name: 'Proyecto 1', deletedAt: null };
            prisma.project.findFirst.mockResolvedValue(mockProject);

            const result = await service.findOne('1');

            expect(result).toEqual(mockProject);
        });
        it('should throw NotFoundException if project does not exist', async () => {
            prisma.project.findFirst.mockResolvedValue(null);
            await expect(service.findOne('id-falso')).rejects.toThrow(NotFoundException);
        });
    });

    //Test #4: Verificar que create crea un nuevo proyecto
    describe('create', () => {
        it('should create a new project', async () => {
            const mockProject = { id: '1', name: 'Nuevo Proyecto', organizationId: 'org1' }
            prisma.project.create.mockResolvedValue(mockProject);

            const dto = { name: 'Nuevo Proyecto', description: 'Descripción del proyecto' };
            const user = { organizationId: 'org1' };

            const result = await service.create(dto as any, user);

            expect(result).toEqual(mockProject);
        });
    });

    //Test #5: Verificar que remove hace soft delete de un proyecto
    describe('remove', () => {
        it('should soft delete a project', async () => {
            const mockProject = { id: '1', name: 'Proyecto1', deletedAt: null };
            const deletedProject = { ...mockProject, deletedAt: expect.any(Date) };

            prisma.project.findFirst.mockResolvedValue(mockProject);
            prisma.project.update.mockResolvedValue(deletedProject);

            await service.remove('1');

            expect(prisma.project.update).toHaveBeenCalledWith({
                where: { id: '1' },
                data: { deletedAt: expect.any(Date) },
            });
        });

        it('should throw NotFoundException if project does not exist', async () => {
            prisma.project.findFirst.mockResolvedValue(null);
            await expect(service.remove('id-falso')).rejects.toThrow(NotFoundException);
        });
    });
});
