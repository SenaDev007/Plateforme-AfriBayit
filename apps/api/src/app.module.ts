import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { PropertiesModule } from './modules/properties/properties.module';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { SearchModule } from './modules/search/search.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    // Config — loads .env
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.local'],
    }),

    // Rate limiting
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        throttlers: [
          {
            name: 'default',
            ttl: 60_000,
            limit: config.get<number>('THROTTLE_LIMIT', 100),
          },
        ],
      }),
    }),

    DatabaseModule,
    AuthModule,
    UsersModule,
    PropertiesModule,
    TransactionsModule,
    NotificationsModule,
    SearchModule,
  ],
})
export class AppModule {}
