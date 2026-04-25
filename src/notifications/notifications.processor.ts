import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Logger } from "@nestjs/common";
import { Job } from "bullmq";

@Processor('notifications')
export class NotificationsProcessor extends WorkerHost{

    private readonly logger = new Logger(NotificationsProcessor.name);

    async process(job: Job): Promise<void> {
        const { taskTitle, assignedToEmail } = job.data;
        this.logger.log(
            `Email enviado a ${assignedToEmail} - Tarea asignada: "${taskTitle}"`
        );
    }
}