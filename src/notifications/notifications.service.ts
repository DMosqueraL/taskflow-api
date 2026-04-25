import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class NotificationsService {

  constructor(
    @Inject('NOTIFICATIONS_SERVICE') private readonly client: ClientProxy,
  ) {}

  async sendTaskAssigned(taskTitle: string, assignedToEmail: string) {
    this.client.emit('task_assigned', { taskTitle, assignedToEmail });
  }
}