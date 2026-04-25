import { InjectQueue } from "@nestjs/bullmq";
import { Injectable } from "@nestjs/common";
import { Queue } from "bullmq";

@Injectable()
export class NotificationsService {
    constructor(

        @InjectQueue("notifications") private readonly notificationsQueue: Queue,

    ) {}

    async sendTaskAssigned(taskTitle: string, assignedToEmail: string) {
        await this.notificationsQueue.add("task-assigned", {
            taskTitle,
            assignedToEmail,
            timestamp: new Date().toISOString(),
        });
    }

}