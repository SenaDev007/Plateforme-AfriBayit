import {
  Injectable,
  Inject,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import type { PrismaClient } from '@afribayit/db';

interface QuestionDto {
  text: string;
  options: string[];
  answer: number;
  order?: number;
}

interface CreateQuizDto {
  title: string;
  passingScore?: number;
  questions: QuestionDto[];
}

@Injectable()
export class QuizService {
  constructor(@Inject('PRISMA') private readonly prisma: PrismaClient) {}

  async createQuiz(courseId: string, instructorId: string, dto: CreateQuizDto) {
    const course = await this.prisma.course.findUnique({ where: { id: courseId } });
    if (!course) throw new NotFoundException('Formation introuvable.');
    if (course.instructorId !== instructorId) throw new ForbiddenException();
    if (dto.questions.length === 0)
      throw new BadRequestException('Le quiz doit avoir au moins une question.');

    return this.prisma.$transaction(async (tx) => {
      // Upsert quiz (one per course)
      const existing = await tx.quiz.findUnique({ where: { courseId } });
      if (existing) {
        await tx.quizQuestion.deleteMany({ where: { quizId: existing.id } });
        await tx.quiz.update({
          where: { id: existing.id },
          data: {
            title: dto.title,
            ...(dto.passingScore !== undefined ? { passingScore: dto.passingScore } : {}),
          },
        });
        await this.createQuestions(tx, existing.id, dto.questions);
        return tx.quiz.findUnique({ where: { id: existing.id }, include: { questions: true } });
      }

      const quiz = await tx.quiz.create({
        data: {
          courseId,
          title: dto.title,
          passingScore: dto.passingScore ?? 70,
        },
      });
      await this.createQuestions(tx, quiz.id, dto.questions);
      return tx.quiz.findUnique({ where: { id: quiz.id }, include: { questions: true } });
    });
  }

  async getQuiz(courseId: string, userId?: string) {
    const quiz = await this.prisma.quiz.findUnique({
      where: { courseId },
      include: {
        questions: { orderBy: { order: 'asc' } },
      },
    });
    if (!quiz) throw new NotFoundException('Aucun quiz pour cette formation.');

    // Strip correct answers before sending to client
    const safeQuestions = quiz.questions.map(({ answer: _answer, ...q }) => q);

    let myBestAttempt = null;
    if (userId) {
      const attempts = await this.prisma.quizAttempt.findMany({
        where: { quizId: quiz.id, userId },
        orderBy: { score: 'desc' },
        take: 1,
      });
      myBestAttempt = attempts[0] ?? null;
    }

    return { ...quiz, questions: safeQuestions, myBestAttempt };
  }

  async submitAttempt(courseId: string, userId: string, answers: number[]) {
    const quiz = await this.prisma.quiz.findUnique({
      where: { courseId },
      include: { questions: { orderBy: { order: 'asc' } } },
    });
    if (!quiz) throw new NotFoundException('Aucun quiz pour cette formation.');
    if (answers.length !== quiz.questions.length) {
      throw new BadRequestException(
        `Attendu ${quiz.questions.length} réponses, reçu ${answers.length}.`,
      );
    }

    const correct = quiz.questions.filter((q, i) => q.answer === answers[i]).length;
    const score = Math.round((correct / quiz.questions.length) * 100);
    const passed = score >= quiz.passingScore;

    const attempt = await this.prisma.quizAttempt.create({
      data: {
        quizId: quiz.id,
        userId,
        answers: answers as unknown as object,
        score,
        passed,
      },
    });

    let certificateId: string | null = null;
    if (passed) {
      const cert = await this.prisma.certificate.upsert({
        where: { userId_courseId: { userId, courseId } },
        create: { userId, courseId, attemptId: attempt.id, score },
        update: { attemptId: attempt.id, score, issuedAt: new Date() },
      });
      certificateId = cert.id;
    }

    return {
      score,
      passed,
      correct,
      total: quiz.questions.length,
      passingScore: quiz.passingScore,
      certificateId,
    };
  }

  async getMyCertificates(userId: string) {
    return this.prisma.certificate.findMany({
      where: { userId },
      include: {
        course: {
          select: { id: true, title: true, slug: true, thumbnailUrl: true, level: true },
        },
      },
      orderBy: { issuedAt: 'desc' },
    });
  }

  async getCertificate(id: string) {
    const cert = await this.prisma.certificate.findUnique({
      where: { id },
      include: {
        user: { select: { firstName: true, lastName: true } },
        course: { select: { title: true, level: true, category: true } },
      },
    });
    if (!cert) throw new NotFoundException('Certificat introuvable.');
    return cert;
  }

  private async createQuestions(
    tx: Parameters<Parameters<PrismaClient['$transaction']>[0]>[0],
    quizId: string,
    questions: QuestionDto[],
  ) {
    await tx.quizQuestion.createMany({
      data: questions.map((q, i) => ({
        quizId,
        text: q.text,
        options: q.options as unknown as object,
        answer: q.answer,
        order: q.order ?? i,
      })),
    });
  }
}
