import { Controller, Post, Get, Patch, Param, Body, UseGuards, Version } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DisputesService } from './disputes.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { User } from '@afribayit/db';

class OpenDisputeDto {
  reason!: string;
  description?: string;
}

class ResolveDisputeDto {
  resolution!: string;
  action!: 'RESOLVED' | 'REFUNDED';
}

@ApiTags('Disputes')
@Controller('disputes')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DisputesController {
  constructor(private readonly disputesService: DisputesService) {}

  /** Ouvrir un litige sur une transaction */
  @Post('transactions/:transactionId')
  @Version('1')
  @ApiOperation({ summary: 'Ouvrir un litige (acheteur uniquement)' })
  open(
    @Param('transactionId') transactionId: string,
    @Body() body: OpenDisputeDto,
    @CurrentUser() user: User,
  ) {
    return this.disputesService.open(transactionId, user.id, body.reason, body.description);
  }

  /** Détail du litige d'une transaction */
  @Get('transactions/:transactionId')
  @Version('1')
  @ApiOperation({ summary: "Litige d'une transaction" })
  findOne(@Param('transactionId') transactionId: string, @CurrentUser() user: User) {
    return this.disputesService.findForTransaction(transactionId, user.id);
  }

  /** Admin — liste tous les litiges */
  @Get()
  @Version('1')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Admin — liste des litiges' })
  findAll() {
    return this.disputesService.findAll();
  }

  /** Admin — mettre en révision */
  @Patch(':id/review')
  @Version('1')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Admin — mettre en révision' })
  markUnderReview(@Param('id') id: string) {
    return this.disputesService.markUnderReview(id);
  }

  /** Admin — résoudre un litige */
  @Patch(':id/resolve')
  @Version('1')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Admin — résoudre un litige' })
  resolve(@Param('id') id: string, @Body() body: ResolveDisputeDto, @CurrentUser() user: User) {
    return this.disputesService.resolve(id, user.id, body.resolution, body.action);
  }
}
