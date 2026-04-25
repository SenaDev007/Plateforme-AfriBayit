import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  Version,
  UseGuards,
  ParseIntPipe,
  DefaultValuePipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CommunityService } from './community.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { User } from '@afribayit/db';

@ApiTags('Community')
@Controller('community')
export class CommunityController {
  constructor(private readonly communityService: CommunityService) {}

  // ─── Posts ───────────────────────────────────────────────────────────────────

  @Get('posts')
  @Version('1')
  @ApiOperation({ summary: 'Liste des posts' })
  getPosts(
    @Query('category') category?: string,
    @Query('groupId') groupId?: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit?: number,
  ) {
    return this.communityService.getPosts(category, groupId, page, limit);
  }

  @Get('posts/:slug')
  @Version('1')
  @ApiOperation({ summary: "Détail d'un post" })
  getPost(@Param('slug') slug: string) {
    return this.communityService.getPostBySlug(slug);
  }

  @Post('posts')
  @Version('1')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Créer un post' })
  createPost(
    @Body() body: Parameters<CommunityService['createPost']>[0],
    @CurrentUser() user: User,
  ) {
    return this.communityService.createPost(body, user.id);
  }

  @Patch('posts/:id')
  @Version('1')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Modifier un post' })
  updatePost(
    @Param('id') id: string,
    @Body() body: Parameters<CommunityService['updatePost']>[1],
    @CurrentUser() user: User,
  ) {
    return this.communityService.updatePost(id, body, user.id);
  }

  @Delete('posts/:id')
  @Version('1')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Supprimer un post (soft-delete)' })
  async deletePost(@Param('id') id: string, @CurrentUser() user: User) {
    await this.communityService.deletePost(id, user.id);
  }

  @Post('posts/:id/like')
  @Version('1')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Liker / unliker un post' })
  toggleLike(@Param('id') id: string, @CurrentUser() user: User) {
    return this.communityService.toggleLike(id, user.id);
  }

  @Post('posts/:id/comments')
  @Version('1')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Commenter un post' })
  addComment(@Param('id') id: string, @Body('content') content: string, @CurrentUser() user: User) {
    return this.communityService.addComment(id, content, user.id);
  }

  @Delete('comments/:id')
  @Version('1')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Supprimer un commentaire' })
  async deleteComment(@Param('id') id: string, @CurrentUser() user: User) {
    await this.communityService.deleteComment(id, user.id);
  }

  // ─── Groups ──────────────────────────────────────────────────────────────────

  @Get('groups')
  @Version('1')
  @ApiOperation({ summary: 'Liste des groupes' })
  getGroups(@Query('category') category?: string) {
    return this.communityService.getGroups(category);
  }

  @Get('groups/:slug')
  @Version('1')
  @ApiOperation({ summary: "Détail d'un groupe" })
  getGroup(@Param('slug') slug: string) {
    return this.communityService.getGroupBySlug(slug);
  }

  @Post('groups')
  @Version('1')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Créer un groupe' })
  createGroup(
    @Body() body: Parameters<CommunityService['createGroup']>[0],
    @CurrentUser() user: User,
  ) {
    return this.communityService.createGroup(body, user.id);
  }

  @Post('groups/:id/join')
  @Version('1')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Rejoindre un groupe' })
  joinGroup(@Param('id') id: string, @CurrentUser() user: User) {
    return this.communityService.joinGroup(id, user.id);
  }

  @Delete('groups/:id/leave')
  @Version('1')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Quitter un groupe' })
  async leaveGroup(@Param('id') id: string, @CurrentUser() user: User) {
    await this.communityService.leaveGroup(id, user.id);
  }

  // ─── Reviews ─────────────────────────────────────────────────────────────────

  @Post('reviews')
  @Version('1')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Soumettre un avis sur un utilisateur ou une propriété' })
  createReview(
    @Body() body: { targetId: string; propertyId?: string; rating: number; comment?: string },
    @CurrentUser() user: User,
  ) {
    return this.communityService.createReview({ authorId: user.id, ...body });
  }

  @Get('reviews/:targetId')
  @Version('1')
  @ApiOperation({ summary: 'Avis reçus par un utilisateur' })
  getReviews(@Param('targetId') targetId: string) {
    return this.communityService.getReviewsForTarget(targetId);
  }
}
