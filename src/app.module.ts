import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from './tasks/tasks.module';
import { ProjectsModule } from './projects/projects.module';
import { CommonModule } from './common/common.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { LoggingMiddleware } from './common/middleware/logging.middleware';
import { CommentsModule } from './comments/comments.module';
import { NotificationsModule } from './notifications/notifications.module';
import { BullModule } from '@nestjs/bullmq';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { AttachmentsModule } from './attachments/attachments.module';

@Module({
  imports: [CacheModule.registerAsync({
    isGlobal: true,
    useFactory: async () => ({
      store: await redisStore({
        socket: {
          host: process.env.REDIS_HOST || 'localhost',
          port: parseInt(process.env.REDIS_PORT ?? '6379'),
        },
        ttl: 30000, // 30 segundos en milisegundos
      }),
    }),
  }),
  BullModule.forRoot({
    connection: {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT ?? '6379'),
    },
  }),
  ConfigModule.forRoot({ isGlobal: true }),
    TasksModule,
    ProjectsModule,
    CommonModule,
    AuthModule,
    CommentsModule,
    NotificationsModule,
    AttachmentsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
