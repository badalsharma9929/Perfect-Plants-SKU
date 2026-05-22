import {Body, Controller, Get, Post, Query} from '@nestjs/common';
import {AnalyticsEventDto} from './dto/analytics.dto';
import {AnalyticsService} from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Post('impression')
  impression(@Body() dto: AnalyticsEventDto) {
    return this.analyticsService.trackImpression(dto);
  }

  @Post('click')
  click(@Body() dto: AnalyticsEventDto) {
    return this.analyticsService.trackClick(dto);
  }

  @Post('purchase')
  purchase(@Body() dto: AnalyticsEventDto) {
    return this.analyticsService.trackPurchase(dto);
  }

  @Get('summary')
  summary(@Query('shop') shop: string) {
    return this.analyticsService.summary(shop);
  }
}
