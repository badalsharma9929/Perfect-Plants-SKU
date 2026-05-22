import {CanActivate, ExecutionContext, Injectable, UnauthorizedException} from '@nestjs/common';
import type {Request} from 'express';
import jwt from 'jsonwebtoken';
import {assertShopDomain} from '../common/shopify.utils';

type ShopifySessionClaims = {
  aud: string;
  dest: string;
  exp: number;
  nbf: number;
  iat: number;
  jti: string;
  sub?: string;
};

@Injectable()
export class ShopifySessionGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request & {shopDomain?: string}>();
    const devShop = request.header('x-shop-domain');

    if (process.env.ALLOW_UNAUTHENTICATED_ADMIN === 'true' && devShop) {
      request.shopDomain = assertShopDomain(devShop);
      return true;
    }

    const token = request.header('authorization')?.replace(/^Bearer\s+/i, '');
    if (!token) throw new UnauthorizedException('Missing Shopify session token');

    const secret = process.env.SHOPIFY_API_SECRET;
    const apiKey = process.env.SHOPIFY_API_KEY;
    if (!secret || !apiKey) throw new UnauthorizedException('Shopify auth env vars are not configured');

    const claims = jwt.verify(token, secret, {
      algorithms: ['HS256'],
      audience: apiKey,
    }) as ShopifySessionClaims;

    const destination = claims.dest.startsWith('http') ? new URL(claims.dest).hostname : claims.dest;
    request.shopDomain = assertShopDomain(destination);
    return true;
  }
}
