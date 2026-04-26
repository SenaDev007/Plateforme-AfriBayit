import { Controller, Get, Post, Param, Body, UseGuards, Version } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PayoutService } from './payout.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { User } from '@afribayit/db';

class RetryPayoutDto {
  phone?: string;
  operator?: string;
}

@ApiTags('Payouts')
@Controller('payouts')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PayoutController {
  constructor(private readonly payoutService: PayoutService) {}

  /** Admin — liste tous les payouts */
  @Get()
  @Version('1')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Admin — liste des payouts' })
  findAll() {
    return this.payoutService.findAll();
  }

  /** Vendeur — mes payouts */
  @Get('me')
  @Version('1')
  @ApiOperation({ summary: 'Mes payouts (vendeur)' })
  findMine(@CurrentUser() user: User) {
    return this.payoutService.findBySeller(user.id);
  }

  /** Admin — relancer un payout échoué */
  @Post(':id/retry')
  @Version('1')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Admin — relancer un payout échoué' })
  retry(@Param('id') id: string, @Body() body: RetryPayoutDto, @CurrentUser() user: User) {
    return this.payoutService.retry(id, user.id, body.phone, body.operator);
  }
}
