import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('health')
  health() {
    return {
      status: 'OK',
      uptime: `${process.uptime().toFixed(0)}초`,
      timestamp: new Date().toISOString(),
    };
  }
}
