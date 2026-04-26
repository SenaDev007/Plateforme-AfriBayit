import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UseGuards,
  Version,
  RawBodyRequest,
  Req,
  Headers,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import type { Request } from 'express';
import { TransactionsService } from './transactions.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { User } from '@afribayit/db';

@ApiTags('Transactions')
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  @Version('1')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Initier une transaction avec escrow' })
  create(@CurrentUser() user: User, @Body() body: Parameters<TransactionsService['create']>[0]) {
    return this.transactionsService.create({ ...body, buyerId: user.id });
  }

  @Get()
  @Version('1')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mes transactions' })
  findAll(@CurrentUser() user: User) {
    return this.transactionsService.findByUser(user.id);
  }

  @Get(':id')
  @Version('1')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Détail d'une transaction" })
  findOne(@Param('id') id: string, @CurrentUser() user: User) {
    return this.transactionsService.findOne(id, user.id);
  }

  @Post(':id/release')
  @Version('1')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Libérer les fonds escrow (acheteur) — 2FA requis si montant > 100 000 FCFA',
  })
  release(@Param('id') id: string, @Body() body: { totpCode?: string }, @CurrentUser() user: User) {
    return this.transactionsService.releaseEscrow(id, user.id, body.totpCode);
  }

  @Get(':id/release-requirements')
  @Version('1')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Vérifier si 2FA requis pour libérer les fonds' })
  async releaseRequirements(@Param('id') id: string, @CurrentUser() user: User) {
    return this.transactionsService.getReleaseRequirements(id, user.id);
  }

  @Post('webhook/fedapay')
  @Version('1')
  @ApiOperation({ summary: 'FedaPay webhook' })
  async fedapayWebhook(
    @Body() payload: Record<string, unknown>,
    @Headers('x-fedapay-signature') signature: string,
  ) {
    await this.transactionsService.handleFedaPayWebhook(payload, signature);
    return { received: true };
  }
}
