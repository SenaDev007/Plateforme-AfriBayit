import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CoursesService } from './courses.service';
import { QuizService } from './quiz.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Courses')
@Controller('courses')
export class CoursesController {
  constructor(
    private readonly coursesService: CoursesService,
    private readonly quizService: QuizService,
  ) {}

  // ── Certificates (literal routes BEFORE param routes) ─────────────────────

  @Get('certificates/me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mes certificats' })
  getMyCertificates(@CurrentUser() user: { id: string }) {
    return this.quizService.getMyCertificates(user.id);
  }

  @Get('certificates/:id')
  @ApiOperation({ summary: "Détail d'un certificat (public)" })
  getCertificate(@Param('id') id: string) {
    return this.quizService.getCertificate(id);
  }

  // ── Courses ────────────────────────────────────────────────────────────────

  @Get()
  @ApiOperation({ summary: 'Liste des formations disponibles' })
  findAll(
    @Query('category') category?: string,
    @Query('level') level?: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query('limit', new DefaultValuePipe(12), ParseIntPipe) limit?: number,
  ) {
    return this.coursesService.findAll(category, level, undefined, page, limit);
  }

  @Get('me/enrollments')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mes formations en cours' })
  getMyEnrollments(@CurrentUser() user: { id: string }) {
    return this.coursesService.getMyEnrollments(user.id);
  }

  @Get(':slug')
  @ApiOperation({ summary: "Détail d'une formation par slug" })
  findBySlug(@Param('slug') slug: string) {
    return this.coursesService.findBySlug(slug);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Créer une formation (instructeur)' })
  create(
    @Body() body: Parameters<typeof this.coursesService.create>[0],
    @CurrentUser() user: { id: string },
  ) {
    return this.coursesService.create(body, user.id);
  }

  @Post(':id/enroll')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "S'inscrire à une formation" })
  enroll(@Param('id') id: string, @CurrentUser() user: { id: string }) {
    return this.coursesService.enroll(id, user.id);
  }

  @Patch('enrollments/:id/progress')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mettre à jour la progression' })
  updateProgress(
    @Param('id') id: string,
    @Body('progress', ParseIntPipe) progress: number,
    @CurrentUser() user: { id: string },
  ) {
    return this.coursesService.updateProgress(id, user.id, progress);
  }

  @Post('lessons')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Ajouter une leçon à une formation' })
  addLesson(
    @Body() body: Parameters<typeof this.coursesService.addLesson>[0],
    @CurrentUser() user: { id: string },
  ) {
    return this.coursesService.addLesson(body, user.id);
  }

  // ── Quiz ───────────────────────────────────────────────────────────────────

  @Post(':courseId/quiz')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Créer ou mettre à jour le quiz d'une formation (instructeur)" })
  createQuiz(
    @Param('courseId') courseId: string,
    @Body() body: Parameters<typeof this.quizService.createQuiz>[2],
    @CurrentUser() user: { id: string },
  ) {
    return this.quizService.createQuiz(courseId, user.id, body);
  }

  @Get(':courseId/quiz')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Récupérer le quiz d'une formation" })
  getQuiz(@Param('courseId') courseId: string, @CurrentUser() user: { id: string }) {
    return this.quizService.getQuiz(courseId, user.id);
  }

  @Post(':courseId/quiz/attempt')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Soumettre une tentative de quiz' })
  submitAttempt(
    @Param('courseId') courseId: string,
    @Body('answers') answers: number[],
    @CurrentUser() user: { id: string },
  ) {
    return this.quizService.submitAttempt(courseId, user.id, answers);
  }
}
