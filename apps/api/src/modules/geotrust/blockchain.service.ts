import { Injectable, Inject, Logger } from '@nestjs/common';
import { PrismaClient } from '@afribayit/db';
import { createHash } from 'crypto';

@Injectable()
export class BlockchainAnchorService {
  private readonly logger = new Logger(BlockchainAnchorService.name);

  constructor(@Inject('PRISMA') private readonly prisma: PrismaClient) {}

  /** Generates a SHA-256 hash for a document or data object */
  generateHash(data: any): string {
    const content = typeof data === 'string' ? data : JSON.stringify(data);
    return createHash('sha256').update(content).digest('hex');
  }

  /** Anchors a property verification to the blockchain (Simulated for now) */
  async anchorVerification(propertyId: string, dataToAnchor: any) {
    const hash = this.generateHash(dataToAnchor);

    // In a real production environment, we would use ethers.js or a provider like Alchemy/Infura
    // to send a transaction to a "TrustRegistry" smart contract on Polygon.

    // Simulation of blockchain delay and transaction
    const txHash = `0x${this.generateHash(propertyId + Date.now()).slice(0, 64)}`;
    const blockNumber = Math.floor(Math.random() * 50000000) + 10000000;

    this.logger.log(
      `[Blockchain] Anchoring hash ${hash} for property ${propertyId}. Tx: ${txHash}`,
    );

    // Store the proof in the database
    return this.prisma.property.update({
      where: { id: propertyId },
      data: {
        metadata: {
          blockchainProof: {
            hash,
            txHash,
            blockNumber,
            network: 'Polygon Mainnet',
            timestamp: new Date().toISOString(),
          },
        },
      },
    });
  }

  /** Verifies a hash against a stored proof */
  async verifyProof(propertyId: string, currentData: any): Promise<boolean> {
    const prop = await this.prisma.property.findUnique({ where: { id: propertyId } });
    const proof = (prop?.metadata as any)?.blockchainProof;
    if (!proof) return false;

    const currentHash = this.generateHash(currentData);
    return currentHash === proof.hash;
  }
}
