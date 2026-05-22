import {createParamDecorator, ExecutionContext} from '@nestjs/common';
import type {Request} from 'express';

export const ShopDomain = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<Request & {shopDomain?: string}>();
  const headerShop = request.header('x-shop-domain');
  const queryShop = typeof request.query.shop === 'string' ? request.query.shop : undefined;
  return request.shopDomain ?? headerShop ?? queryShop;
});
