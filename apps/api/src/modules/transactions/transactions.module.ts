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
import { NotificationsModule } from '../notifications/notifications.module';
import { NotaryModule } from '../notary/notary.module';
import { GeoTrustModule } from '../geotrust/geotrust.module';
import { SimulationController } from './simulation.controller';
import { TransactionSimulationService } from './simulation.service';

@Module({
  imports: [AuthModule, NotificationsModule, NotaryModule, GeoTrustModule],
  controllers: [TransactionsController, DisputesController, PayoutController, SimulationController],
  providers: [
    TransactionsService,
    EscrowService,
    FedaPayService,
    StripeService,
    DisputesService,
    PayoutService,
    TransactionSimulationService,
  ],
  exports: [TransactionsService, EscrowService, DisputesService, PayoutService],
})
export class TransactionsModule {}
