import { Controller, Get, Post, UseGuards, Req } from '@nestjs/common';
import { AmbassadorService } from './ambassador.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('v1/ambassadors')
export class AmbassadorController {
  constructor(private readonly ambassadorService: AmbassadorService) {}

  @Get('stats')
  @UseGuards(JwtAuthGuard)
  async getStats(@Req() req: any) {
    return this.ambassadorService.getStats(req.user.id);
  }

  @Post('code')
  @UseGuards(JwtAuthGuard)
  async generateCode(@Req() req: any) {
    const code = await this.ambassadorService.generateCode(req.user.id);
    return { referralCode: code };
  }
}
