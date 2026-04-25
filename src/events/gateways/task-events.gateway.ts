import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { TaskAssignedEvent } from '../events/task-assigned.event';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class TaskEventsGateway {
  private readonly logger = new Logger(TaskEventsGateway.name);

  @WebSocketServer()
  server!: Server;

  @OnEvent('task.assigned')
  handleTaskAssigned(event: TaskAssignedEvent) {
    this.logger.log(`WebSocket: emitiendo task.assigned a los clientes`);
    this.server.emit('task.assigned', {
      taskId: event.taskId,
      taskTitle: event.taskTitle,
      assignedToEmail: event.assignedToEmail,
    });
  }
}