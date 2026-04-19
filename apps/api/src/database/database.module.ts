import { Module, Global } from '@nestjs/common';
import { prisma } from '@afribayit/db';

/** Provides Prisma client globally across all NestJS modules */
@Global()
@Module({
  providers: [
    {
      provide: 'PRISMA',
      useValue: prisma,
    },
  ],
  exports: ['PRISMA'],
})
export class DatabaseModule {}
