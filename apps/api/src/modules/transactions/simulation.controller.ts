import { Controller, Post, Body, Param, Get, UseGuards } from '@nestjs/common';
import { TransactionSimulationService } from './simulation.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('v1/simulation')
export class SimulationController {
  constructor(private readonly simulationService: TransactionSimulationService) {}

  @Post('seed')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  async seed() {
    return this.simulationService.seedTestEnvironment();
  }

  @Post('transactions/:id/advance')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  async advance(@Param('id') id: string, @Body() body: { status: string }) {
    return this.simulationService.forceStatus(id, body.status);
  }
}
