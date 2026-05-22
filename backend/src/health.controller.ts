import {Controller, Get} from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  health() {
    return {
      ok: true,
      service: 'post-purchase-revenue-engine',
      timestamp: new Date().toISOString(),
    };
  }
}
