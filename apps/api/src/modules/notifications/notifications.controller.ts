import { Controller, Get, Patch, Param, UseGuards, Version, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { User } from '@afribayit/db';

@ApiTags('Notifications')
@Controller('notifications')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @Version('1')
  @ApiOperation({ summary: 'Mes notifications' })
  getAll(@CurrentUser() user: User, @Query('limit') limit = 20) {
    return this.notificationsService.getForUser(user.id, limit);
  }

  @Patch(':id/read')
  @Version('1')
  @ApiOperation({ summary: 'Marquer comme lue' })
  markRead(@Param('id') id: string, @CurrentUser() user: User) {
    return this.notificationsService.markRead(id, user.id);
  }

  @Patch('read-all')
  @Version('1')
  @ApiOperation({ summary: 'Tout marquer comme lu' })
  markAllRead(@CurrentUser() user: User) {
    return this.notificationsService.markAllRead(user.id);
  }
}
