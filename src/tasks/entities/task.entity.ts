export enum TaskStatus {
    PENDING = 'PENDING',
    IN_PROGRESS = 'IN_PROGRESS',
    DONE = 'DONE',
}

export enum TaskPriority {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH',
}

export class Task {
    id!: string;
    title!: string;
    status!: TaskStatus;
    priority!: TaskPriority;
    projectId!: string;
    createdAt!: Date;
}