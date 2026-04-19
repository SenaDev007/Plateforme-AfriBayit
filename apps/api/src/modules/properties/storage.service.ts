import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from 'crypto';

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private readonly s3: S3Client;
  private readonly bucket: string;
  private readonly publicUrl: string;

  constructor(private readonly config: ConfigService) {
    this.s3 = new S3Client({
      region: 'auto',
      endpoint: `https://${config.getOrThrow<string>('CLOUDFLARE_ACCOUNT_ID')}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: config.getOrThrow<string>('R2_ACCESS_KEY_ID'),
        secretAccessKey: config.getOrThrow<string>('R2_SECRET_ACCESS_KEY'),
      },
    });
    this.bucket = config.getOrThrow<string>('R2_BUCKET_NAME');
    this.publicUrl = config.getOrThrow<string>('R2_PUBLIC_URL');
  }

  /** Generate a pre-signed URL for direct browser upload to R2 */
  async getPresignedUploadUrl(params: {
    folder: string;
    contentType: string;
    maxSizeBytes?: number;
  }): Promise<{ uploadUrl: string; fileKey: string; publicUrl: string }> {
    const ext = params.contentType.split('/')[1] ?? 'bin';
    const fileKey = `${params.folder}/${randomUUID()}.${ext}`;

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: fileKey,
      ContentType: params.contentType,
    });

    const uploadUrl = await getSignedUrl(this.s3, command, { expiresIn: 300 });

    return {
      uploadUrl,
      fileKey,
      publicUrl: `${this.publicUrl}/${fileKey}`,
    };
  }

  /** Delete a file from R2 */
  async delete(fileKey: string): Promise<void> {
    try {
      await this.s3.send(new DeleteObjectCommand({ Bucket: this.bucket, Key: fileKey }));
    } catch (error) {
      this.logger.error(`Failed to delete R2 file: ${fileKey}`, error);
    }
  }
}
