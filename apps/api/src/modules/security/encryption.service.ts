import { Injectable } from '@nestjs/common';
import { createCipheriv, createDecipheriv, randomBytes, createHash } from 'crypto';

/**
 * Section 10.1 — Chiffrement AES-256-GCM pour données au repos
 * Champs sensibles : téléphone, adresse, documents KYC, données financières.
 */
@Injectable()
export class EncryptionService {
  private readonly algorithm = 'aes-256-gcm';
  // Production: key from HashiCorp Vault via process.env.ENCRYPTION_KEY
  private readonly key: Buffer;

  constructor() {
    const envKey = process.env['ENCRYPTION_KEY'] || 'afribayit-dev-key-32-chars-long!';
    this.key = createHash('sha256').update(envKey).digest();
  }

  /** Encrypt a plaintext string → returns base64(iv:authTag:ciphertext) */
  encrypt(plaintext: string): string {
    const iv = randomBytes(16);
    const cipher = createCipheriv(this.algorithm, this.key, iv);

    let encrypted = cipher.update(plaintext, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag();

    return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
  }

  /** Decrypt a previously encrypted string */
  decrypt(encryptedData: string): string {
    const parts = encryptedData.split(':');
    if (parts.length < 3) throw new Error('Format de données chiffrées invalide');
    const [ivHex, authTagHex, ciphertext] = parts;

    const iv = Buffer.from(ivHex || '', 'hex');
    const authTag = Buffer.from(authTagHex || '', 'hex');

    const decipher = createDecipheriv(this.algorithm, this.key, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(ciphertext, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

  /** Hash sensitive data for indexing (non-reversible) */
  hash(data: string): string {
    return createHash('sha256').update(data).digest('hex');
  }
}
