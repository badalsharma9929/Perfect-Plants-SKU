import {Module} from '@nestjs/common';
import {AuthController} from './auth.controller';
import {AuthService} from './auth.service';
import {ShopifySessionGuard} from './shopify-session.guard';

@Module({
  controllers: [AuthController],
  providers: [AuthService, ShopifySessionGuard],
  exports: [AuthService, ShopifySessionGuard],
})
export class AuthModule {}
