import { Module } from '@nestjs/common';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { EscrowService } from './escrow.service';
import { FedaPayService } from './payments/fedapay.service';
import { StripeService } from './payments/stripe.service';

@Module({
  controllers: [TransactionsController],
  providers: [TransactionsService, EscrowService, FedaPayService, StripeService],
  exports: [TransactionsService, EscrowService],
})
export class TransactionsModule {}
