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
import { HealthController } from './health.controller';

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
          { name: 'default', ttl: 60_000, limit: 100 },
          { name: 'auth', ttl: 60_000, limit: 5 },
          { name: 'public', ttl: 60_000, limit: 30 },
          { name: 'premium', ttl: 60_000, limit: 200 },
          { name: 'sensitive', ttl: 3600_000, limit: 10 },
          { name: 'partner', ttl: 60_000, limit: 500 },
        ],
      }),
    }),

    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const host = config.get<string>('REDIS_HOST');
        const url = config.get<string>('REDIS_URL');
        if (!host && !url) {
          // Fallback to in-memory cache if Redis is not configured
          return { ttl: config.get<number>('CACHE_TTL_SECONDS', 300) };
        }

        const password = config.get<string>('REDIS_PASSWORD');
        return {
          store: await redisStore({
            url,
            socket: !url
              ? {
                  host: host || 'localhost',
                  port: config.get<number>('REDIS_PORT', 6379),
                }
              : undefined,
            ...(password ? { password } : {}),
            ttl: config.get<number>('CACHE_TTL_SECONDS', 300),
          }),
        };
      },
    }),

    QueueModule,
    GatewaysModule,
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
  controllers: [HealthController],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
