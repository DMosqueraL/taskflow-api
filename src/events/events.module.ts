import { Module } from '@nestjs/common';
import { TaskAssignedListener } from './listeners/task-assigned.listener';
import { NotificationsModule } from '../notifications/notifications.module';
import { TaskEventsGateway } from './gateways/task-events.gateway';

@Module({
  imports: [NotificationsModule],
  providers: [TaskAssignedListener, TaskEventsGateway],
})
export class EventsModule {}