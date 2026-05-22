import {Controller, Get, Query, Res, UseGuards} from '@nestjs/common';
import type {Response} from 'express';
import {ShopDomain} from '../common/shop-domain.decorator';
import {AuthService} from './auth.service';
import {ShopifySessionGuard} from './shopify-session.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('install')
  install(@Query('shop') shop: string, @Res() response: Response) {
    response.redirect(this.authService.createInstallUrl(shop));
  }

  @Get('callback')
  async callback(@Query() query: Record<string, string>, @Res() response: Response) {
    const redirectUrl = await this.authService.completeInstall(query);
    response.redirect(redirectUrl);
  }

  @UseGuards(ShopifySessionGuard)
  @Get('me')
  me(@ShopDomain() shopDomain: string) {
    return {shopDomain};
  }
}
