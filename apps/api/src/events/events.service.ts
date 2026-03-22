import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  async logEvent(data: {
    eventType: string;
    userId?: string;
    entityId?: string;
    payload?: any;
  }) {
    return this.prisma.eventLog.create({
      data,
    });
  }
}