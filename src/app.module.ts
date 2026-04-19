import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from './tasks/tasks.module';
import { ProjectsModule } from './projects/projects.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [TasksModule, ProjectsModule, CommonModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
