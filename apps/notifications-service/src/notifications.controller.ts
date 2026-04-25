import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class NotificationsController {
  private readonly logger = new Logger(NotificationsController.name);

  @MessagePattern('task_assigned')
  handleTaskAssigned(@Payload() data: { taskTitle: string; assignedToEmail: string }) {
    this.logger.log(
      `Email enviado a: ${data.assignedToEmail} — Tarea asignada: "${data.taskTitle}"`,
    );
    return { success: true };
  }
}