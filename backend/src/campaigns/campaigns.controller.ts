import {Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards} from '@nestjs/common';
import {ShopDomain} from '../common/shop-domain.decorator';
import {ShopifySessionGuard} from '../auth/shopify-session.guard';
import {CampaignsService} from './campaigns.service';
import {CreateCampaignDto, UpdateCampaignDto} from './dto/campaign.dto';

@UseGuards(ShopifySessionGuard)
@Controller('campaigns')
export class CampaignsController {
  constructor(private readonly campaignsService: CampaignsService) {}

  @Get()
  findAll(@ShopDomain() shopDomain: string, @Query('search') search?: string, @Query('status') status?: string) {
    return this.campaignsService.findAll(shopDomain, {search, status});
  }

  @Post()
  create(@ShopDomain() shopDomain: string, @Body() dto: CreateCampaignDto) {
    return this.campaignsService.create(shopDomain, dto);
  }

  @Put(':id')
  update(@ShopDomain() shopDomain: string, @Param('id') id: string, @Body() dto: UpdateCampaignDto) {
    return this.campaignsService.update(shopDomain, id, dto);
  }

  @Post(':id/duplicate')
  duplicate(@ShopDomain() shopDomain: string, @Param('id') id: string) {
    return this.campaignsService.duplicate(shopDomain, id);
  }

  @Delete(':id')
  delete(@ShopDomain() shopDomain: string, @Param('id') id: string) {
    return this.campaignsService.delete(shopDomain, id);
  }
}
