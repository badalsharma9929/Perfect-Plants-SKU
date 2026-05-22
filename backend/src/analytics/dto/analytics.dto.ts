import {IsNumber, IsOptional, IsString} from 'class-validator';

export class AnalyticsEventDto {
  @IsString()
  shop!: string;

  @IsString()
  campaignId!: string;

  @IsOptional()
  @IsString()
  orderId?: string;

  @IsOptional()
  @IsString()
  checkoutToken?: string;

  @IsOptional()
  @IsString()
  customerType?: string;

  @IsOptional()
  @IsString()
  redirectUrl?: string;

  @IsOptional()
  @IsNumber()
  revenue?: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsString()
  discountCode?: string;
}
