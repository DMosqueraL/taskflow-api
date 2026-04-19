import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { ProjectsModule } from 'src/projects/projects.module';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [
    CommonModule, 
    ProjectsModule
  ],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
