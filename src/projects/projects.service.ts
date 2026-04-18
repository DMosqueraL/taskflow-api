import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { v4 as uuidv4 } from 'uuid';
import { Project } from './entities/project.entity';

@Injectable()
export class ProjectsService {

  private projects: Project[] = []; //Nivel 1

  constructor() {
    //Nivel1
    const p1 = new Project();
    p1.id = uuidv4();
    p1.name = 'Project 1';
    p1.description = 'Description for project 1';
    p1.createdAt = new Date();
    
    const p2 = new Project();
    p2.id = uuidv4();
    p2.name = 'Project 2';
    p2.description = 'Description for project 2';
    p2.createdAt = new Date();

    this.projects =[p1, p2];
  }

  create(createProjectDto: CreateProjectDto) {
    const project = new Project();
    project.id = uuidv4();
    project.name = createProjectDto.name; 
    project.createdAt = new Date();
    if (createProjectDto.description) {
      project.description = createProjectDto.description;
    }
    this.projects.push(project);
    return project;
  }

  findAll() {
    
    return this.projects;
  }
  //Nivel 1
  findOne(id: string) {
    const project = this.projects.find((p) => p.id === id);
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    return project;
  }

  update(id: string, updateProjectDto: UpdateProjectDto) {
    const project = this.projects.find((p) => p.id === id);
    if (!project) {
      throw  new NotFoundException('Project not found');
    }
    return Object.assign(project, updateProjectDto);
  }

  remove(id: string) {
    const project = this.projects.find((p) => p.id === id);
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    this.projects = this.projects.filter((p) => p.id !== id);
    return { message: 'Project deleted successfully' };
  }
}

