import {Controller, Headers, Post, Req, UnauthorizedException} from '@nestjs/common';
import type {Request} from 'express';
import {verifyShopifyWebhookHmac} from '../common/shopify.utils';
import {WebhooksService} from './webhooks.service';

type RawBodyRequest = Request & {rawBody?: Buffer};

@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) {}

  @Post('app/uninstalled')
  appUninstalled(@Req() request: RawBodyRequest, @Headers('x-shopify-hmac-sha256') hmac: string) {
    this.verify(request, hmac);
    return this.webhooksService.appUninstalled(this.shop(request));
  }

  @Post('orders/create')
  ordersCreate(@Req() request: RawBodyRequest, @Headers('x-shopify-hmac-sha256') hmac: string) {
    this.verify(request, hmac);
    return this.webhooksService.ordersCreate(this.shop(request), request.body);
  }

  @Post('orders/paid')
  ordersPaid(@Req() request: RawBodyRequest, @Headers('x-shopify-hmac-sha256') hmac: string) {
    this.verify(request, hmac);
    return this.webhooksService.ordersPaid(this.shop(request), request.body);
  }

  private verify(request: RawBodyRequest, hmac: string | undefined) {
    const secret = process.env.SHOPIFY_API_SECRET;
    if (!secret || !request.rawBody || !verifyShopifyWebhookHmac(request.rawBody, hmac, secret)) {
      throw new UnauthorizedException('Invalid Shopify webhook HMAC');
    }
  }

  private shop(request: Request) {
    const shop = request.header('x-shopify-shop-domain');
    if (!shop) throw new UnauthorizedException('Missing Shopify shop header');
    return shop;
  }
}
