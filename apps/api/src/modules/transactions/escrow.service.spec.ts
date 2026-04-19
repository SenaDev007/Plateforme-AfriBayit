import { Test, type TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { EscrowService } from './escrow.service';
import { Decimal } from '@prisma/client/runtime/library';

const mockTransaction = {
  id: 'tx-1',
  reference: 'AFB-001',
  status: 'INITIATED' as const,
  amount: new Decimal(85000000),
  currency: 'XOF' as const,
  escrowAccount: null,
};

const mockPrisma = {
  transaction: {
    findUnique: jest.fn(),
    findUniqueOrThrow: jest.fn(),
    update: jest.fn().mockResolvedValue({ ...mockTransaction, status: 'FUNDED' }),
  },
  ledgerEntry: {
    create: jest.fn().mockResolvedValue({ id: 'le-1' }),
  },
  escrowAccount: {
    upsert: jest.fn(),
  },
  $transaction: jest.fn().mockImplementation(async (ops: unknown[]) => {
    return Promise.all(ops.map((op) => (typeof op === 'function' ? op() : op)));
  }),
};

describe('EscrowService', () => {
  let service: EscrowService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EscrowService,
        { provide: 'PRISMA', useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<EscrowService>(EscrowService);
    jest.clearAllMocks();
  });

  describe('transition', () => {
    it('should transition INITIATED → FUNDED', async () => {
      mockPrisma.transaction.findUnique.mockResolvedValue(mockTransaction);
      mockPrisma.$transaction.mockResolvedValue([{ ...mockTransaction, status: 'FUNDED' }, {}]);

      const result = await service.transition('tx-1', 'FUNDED', 'user-1');
      expect(result.status).toBe('FUNDED');
    });

    it('should throw NotFoundException for unknown transaction', async () => {
      mockPrisma.transaction.findUnique.mockResolvedValue(null);
      await expect(service.transition('unknown', 'FUNDED', 'user-1'))
        .rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException for invalid transition', async () => {
      mockPrisma.transaction.findUnique.mockResolvedValue(mockTransaction);
      // INITIATED → COMPLETED is invalid
      await expect(service.transition('tx-1', 'COMPLETED', 'user-1'))
        .rejects.toThrow(BadRequestException);
    });

    it('should reject FUNDED → INITIATED transition', async () => {
      const fundedTx = { ...mockTransaction, status: 'FUNDED' as const };
      mockPrisma.transaction.findUnique.mockResolvedValue(fundedTx);
      await expect(service.transition('tx-1', 'INITIATED', 'user-1'))
        .rejects.toThrow(BadRequestException);
    });

    it('should allow FUNDED → VALIDATED transition', async () => {
      const fundedTx = { ...mockTransaction, status: 'FUNDED' as const };
      mockPrisma.transaction.findUnique.mockResolvedValue(fundedTx);
      mockPrisma.$transaction.mockResolvedValue([{ ...fundedTx, status: 'VALIDATED' }, {}]);

      const result = await service.transition('tx-1', 'VALIDATED', 'admin-1');
      expect(result.status).toBe('VALIDATED');
    });

    it('should allow COMPLETED state to have no further transitions', async () => {
      const completedTx = { ...mockTransaction, status: 'COMPLETED' as const };
      mockPrisma.transaction.findUnique.mockResolvedValue(completedTx);
      await expect(service.transition('tx-1', 'FUNDED', 'user-1'))
        .rejects.toThrow(BadRequestException);
    });
  });

  describe('fundEscrow', () => {
    it('should upsert escrow account with correct balance', async () => {
      await service.fundEscrow('tx-1', new Decimal(85000000));
      expect(mockPrisma.escrowAccount.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { transactionId: 'tx-1' },
          create: expect.objectContaining({ balance: new Decimal(85000000) }),
        }),
      );
    });
  });
});
