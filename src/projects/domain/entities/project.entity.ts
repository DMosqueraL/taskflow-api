export class ProjectEntity {
  readonly id: string;
  readonly name: string;
  readonly description: string | null;
  readonly organizationId: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly deletedAt: Date | null;

  constructor(props: {
    id: string;
    name: string;
    description: string | null;
    organizationId: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
  }) {
    this.id = props.id;
    this.name = props.name;
    this.description = props.description;
    this.organizationId = props.organizationId;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.deletedAt = props.deletedAt;
  }

  isDeleted(): boolean {
    return this.deletedAt !== null;
  }
}