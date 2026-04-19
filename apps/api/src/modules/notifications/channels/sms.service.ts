import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);
  private readonly username: string;
  private readonly apiKey: string;

  constructor(private readonly config: ConfigService) {
    this.username = config.getOrThrow<string>('AFRICASTALKING_USERNAME');
    this.apiKey = config.getOrThrow<string>('AFRICASTALKING_API_KEY');
  }

  /** Send SMS via Africa's Talking */
  async send(to: string, message: string): Promise<void> {
    try {
      await axios.post(
        'https://api.africastalking.com/version1/messaging',
        new URLSearchParams({
          username: this.username,
          to,
          message,
          from: 'AfriBayit',
        }).toString(),
        {
          headers: {
            apiKey: this.apiKey,
            Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );
    } catch (error) {
      this.logger.error(`SMS send failed to ${to}`, error);
    }
  }
}
