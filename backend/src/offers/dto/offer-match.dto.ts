import {IsArray, IsNumber, IsOptional, IsString} from 'class-validator';

export class OfferMatchDto {
  @IsString()
  shop!: string;

  @IsOptional()
  @IsString()
  orderId?: string;

  @IsArray()
  products!: Array<string | number>;

  @IsOptional()
  @IsArray()
  collections?: Array<string | number>;

  @IsOptional()
  @IsArray()
  productTags?: string[];

  @IsNumber()
  orderValue!: number;

  @IsOptional()
  @IsString()
  customerType?: string;

  @IsOptional()
  @IsString()
  paymentType?: string;

  @IsOptional()
  @IsString()
  checkoutToken?: string;
}
