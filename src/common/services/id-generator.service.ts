import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

@Injectable()
export class IdGeneratorService {
  generateId(): string {
    return randomUUID();
  }
}