import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { RebeccaService } from './rebecca.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('v1/ai')
export class AiController {
  constructor(private readonly rebeccaService: RebeccaService) {}

  @Post('rebecca/chat')
  async chat(@Body() body: { message: string; propertyId?: string }, @Request() req: any) {
    // Optional auth: Rebecca can be used without login, but context is better if logged in
    const userId = req.user?.id;
    return this.rebeccaService.chat(body.message, body.propertyId, userId);
  }
}
