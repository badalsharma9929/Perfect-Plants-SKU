import {Body, Controller, Post} from '@nestjs/common';
import {OfferMatchDto} from './dto/offer-match.dto';
import {OffersService} from './offers.service';

@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post('match')
  match(@Body() dto: OfferMatchDto) {
    return this.offersService.match(dto);
  }
}
