import {
  Controller, Get, Post, Delete, Param, Body, Query,
  UseGuards, ParseIntPipe, DefaultValuePipe,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CommunityService } from './community.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Community')
@Controller('community')
export class CommunityController {
  constructor(private readonly communityService: CommunityService) {}

  @Get('posts')
  @ApiOperation({ summary: 'Liste des posts de la communauté' })
  getPosts(
    @Query('category') category?: string,
    @Query('groupId') groupId?: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit?: number,
  ) {
    return this.communityService.getPosts(category, groupId, page, limit);
  }

  @Get('posts/:slug')
  @ApiOperation({ summary: 'Détail d\'un post par slug' })
  getPost(@Param('slug') slug: string) {
    return this.communityService.getPostBySlug(slug);
  }

  @Post('posts')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Créer un post' })
  createPost(
    @Body() body: Parameters<typeof this.communityService.createPost>[0],
    @CurrentUser() user: { id: string },
  ) {
    return this.communityService.createPost(body, user.id);
  }

  @Delete('posts/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Supprimer un post' })
  deletePost(@Param('id') id: string, @CurrentUser() user: { id: string }) {
    return this.communityService.deletePost(id, user.id);
  }

  @Post('posts/:id/like')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Liker / unliker un post' })
  toggleLike(@Param('id') id: string, @CurrentUser() user: { id: string }) {
    return this.communityService.toggleLike(id, user.id);
  }

  @Post('posts/:id/comments')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Commenter un post' })
  addComment(
    @Param('id') id: string,
    @Body('content') content: string,
    @CurrentUser() user: { id: string },
  ) {
    return this.communityService.addComment(id, content, user.id);
  }

  @Get('groups')
  @ApiOperation({ summary: 'Liste des groupes' })
  getGroups(@Query('category') category?: string) {
    return this.communityService.getGroups(category);
  }

  @Post('groups')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Créer un groupe' })
  createGroup(
    @Body() body: Parameters<typeof this.communityService.createGroup>[0],
    @CurrentUser() user: { id: string },
  ) {
    return this.communityService.createGroup(body, user.id);
  }

  @Post('groups/:id/join')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Rejoindre un groupe' })
  joinGroup(@Param('id') id: string, @CurrentUser() user: { id: string }) {
    return this.communityService.joinGroup(id, user.id);
  }

  @Delete('groups/:id/leave')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Quitter un groupe' })
  leaveGroup(@Param('id') id: string, @CurrentUser() user: { id: string }) {
    return this.communityService.leaveGroup(id, user.id);
  }
}
