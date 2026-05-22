import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import {AnalyticsModule} from './analytics/analytics.module';
import {AuthModule} from './auth/auth.module';
import {CampaignsModule} from './campaigns/campaigns.module';
import {HealthController} from './health.controller';
import {OffersModule} from './offers/offers.module';
import {PrismaModule} from './prisma/prisma.module';
import {WebhooksModule} from './webhooks/webhooks.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['../.env', '.env'],
    }),
    PrismaModule,
    AuthModule,
    CampaignsModule,
    OffersModule,
    AnalyticsModule,
    WebhooksModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
