import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { QuizService } from './quiz.service';
import { CoursesController } from './courses.controller';
import { DatabaseModule } from '../../database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [CoursesService, QuizService],
  controllers: [CoursesController],
  exports: [CoursesService, QuizService],
})
export class CoursesModule {}
