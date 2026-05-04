import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { PropertiesModule } from './modules/properties/properties.module';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { SearchModule } from './modules/search/search.module';
import { HotelsModule } from './modules/hotels/hotels.module';
import { ArtisansModule } from './modules/artisans/artisans.module';
import { CoursesModule } from './modules/courses/courses.module';
import { CommunityModule } from './modules/community/community.module';
import { MessagesModule } from './modules/messages/messages.module';
import { DatabaseModule } from './database/database.module';
import { QueueModule } from './modules/queue/queue.module';
import { GatewaysModule } from './gateways/gateways.module';
import { SecurityModule } from './modules/security/security.module';
import { NotaryModule } from './modules/notary/notary.module';
import { ComplianceModule } from './modules/compliance/compliance.module';
import { AiModule } from './modules/ai/ai.module';
import { GeoTrustModule } from './modules/geotrust/geotrust.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.local'],
    }),

    // GraphQL — Section 3.1.2
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: process.env['NODE_ENV'] !== 'production',
    }),

    // Rate limiting — applied globally via APP_GUARD below
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        throttlers: [
          { name: 'default', ttl: 60_000, limit: config.get<number>('THROTTLE_LIMIT', 100) },
          { name: 'auth', ttl: 60_000, limit: 10 }, // stricter for auth endpoints
          { name: 'upload', ttl: 60_000, limit: 20 }, // for file upload endpoints
        ],
      }),
    }),

    // Redis cache — global
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const password = config.get<string>('REDIS_PASSWORD');
        return {
          store: await redisStore({
            socket: {
              host: config.get<string>('REDIS_HOST', 'localhost'),
              port: config.get<number>('REDIS_PORT', 6379),
            },
            ...(password ? { password } : {}),
            ttl: config.get<number>('CACHE_TTL_SECONDS', 300),
          }),
        };
      },
    }),

    // Async job queue (BullMQ + Redis)
    QueueModule,

    // WebSocket gateways
    GatewaysModule,

    // Feature modules
    DatabaseModule,
    SecurityModule,
    AuthModule,
    UsersModule,
    PropertiesModule,
    TransactionsModule,
    NotificationsModule,
    SearchModule,
    HotelsModule,
    ArtisansModule,
    CoursesModule,
    CommunityModule,
    MessagesModule,
    NotaryModule,
    ComplianceModule,
    AiModule,
    GeoTrustModule,
  ],
  providers: [
    // Apply ThrottlerGuard globally — every route is rate-limited by default
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
