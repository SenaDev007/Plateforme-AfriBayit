import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { GeoTrustService } from './geotrust.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('v1/geotrust')
export class GeoTrustController {
  constructor(private readonly geoTrustService: GeoTrustService) {}

  @Get('property/:id/mapping')
  async getMapping(@Param('id') id: string) {
    return this.geoTrustService.getMappingByProperty(id);
  }

  @Post('mapping')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SURVEYOR', 'ADMIN')
  async saveMapping(@Body() body: any) {
    return this.geoTrustService.saveDroneMapping({
      ...body,
      capturedAt: new Date(body.capturedAt),
    });
  }

  @Get('me/assignments')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SURVEYOR')
  async getMyAssignments(@Request() req: any) {
    return this.geoTrustService.findAssignmentsByUserId(req.user.id);
  }
}
