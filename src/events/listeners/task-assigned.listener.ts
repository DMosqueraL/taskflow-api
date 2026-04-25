import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { TaskAssignedEvent } from '../events/task-assigned.event';
import { NotificationsService } from '../../notifications/notifications.service';

@Injectable()
export class TaskAssignedListener {
  private readonly logger = new Logger(TaskAssignedListener.name);

  constructor(private readonly notificationsService: NotificationsService) {}

  @OnEvent('task.assigned')
  async handleTaskAssigned(event: TaskAssignedEvent) {
    this.logger.log(`Evento recibido: tarea "${event.taskTitle}" asignada`);
    await this.notificationsService.sendTaskAssigned(event.taskTitle, event.assignedToEmail);
  }
}