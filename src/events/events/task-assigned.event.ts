export class TaskAssignedEvent {
  constructor(
    public readonly taskId: string,
    public readonly taskTitle: string,
    public readonly assignedToEmail: string,
    public readonly assignedById: string,
  ) {}
}