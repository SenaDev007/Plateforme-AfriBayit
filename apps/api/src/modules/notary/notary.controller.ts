import { Controller, Get, Post, Body, Param, UseGuards, Request, Patch } from '@nestjs/common';
import { NotaryService } from './notary.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('v1/notaries')
@UseGuards(JwtAuthGuard, RolesGuard)
export class NotaryController {
  constructor(private readonly notaryService: NotaryService) {}

  @Get('me/assignments')
  @Roles('NOTARY', 'ADMIN')
  async getMyAssignments(@Request() req: any) {
    // In a real scenario, we would first find the Notary ID associated with req.user.id
    // For now, let's assume we have a way to filter assignments by notaryId
    return this.notaryService.findAssignmentsByUserId(req.user.id);
  }

  @Patch('assignments/:id/status')
  @Roles('NOTARY')
  async updateStatus(
    @Param('id') id: string,
    @Body()
    body: { status: 'IN_PROGRESS' | 'SIGNED' | 'REGISTERED'; notes?: string; deedHash?: string },
  ) {
    return this.notaryService.updateAssignmentStatus(id, body.status, body.notes, body.deedHash);
  }
}
