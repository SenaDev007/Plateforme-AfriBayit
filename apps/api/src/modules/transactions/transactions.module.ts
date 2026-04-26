import { Module } from '@nestjs/common';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { EscrowService } from './escrow.service';
import { FedaPayService } from './payments/fedapay.service';
import { StripeService } from './payments/stripe.service';
import { DisputesService } from './disputes.service';
import { DisputesController } from './disputes.controller';
import { PayoutService } from './payout.service';
import { PayoutController } from './payout.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [TransactionsController, DisputesController, PayoutController],
  providers: [
    TransactionsService,
    EscrowService,
    FedaPayService,
    StripeService,
    DisputesService,
    PayoutService,
  ],
  exports: [TransactionsService, EscrowService, DisputesService, PayoutService],
})
export class TransactionsModule {}
