import {Module} from '@nestjs/common';
import {DiscountsService} from './discounts.service';
import {OffersController} from './offers.controller';
import {OffersService} from './offers.service';
import {RuleEngineService} from './rule-engine.service';

@Module({
  controllers: [OffersController],
  providers: [OffersService, RuleEngineService, DiscountsService],
  exports: [OffersService],
})
export class OffersModule {}
