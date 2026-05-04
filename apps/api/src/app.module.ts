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

    // Rate limiting — Section 10.2.1 Rate Limiting Différencié
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: () => ({
        throttlers: [
          { name: 'default', ttl: 60_000, limit: 100 }, // API authentifiée (100 req/min)
          { name: 'auth', ttl: 60_000, limit: 5 }, // Auth: login, OTP, register (5 req/min)
          { name: 'public', ttl: 60_000, limit: 30 }, // API publique anonyme (30 req/min)
          { name: 'premium', ttl: 60_000, limit: 200 }, // Agent Premium (200 req/min)
          { name: 'sensitive', ttl: 3600_000, limit: 10 }, // Escrow, KYC (10 req/heure)
          { name: 'partner', ttl: 60_000, limit: 500 }, // API partenaires (500 req/min)
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
