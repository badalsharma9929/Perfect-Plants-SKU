import {IsBoolean, IsEnum, IsNumber, IsOptional, IsString, Min} from 'class-validator';
import {CampaignStatus, DestinationType, DiscountType, OfferType, TriggerType} from '@prisma/client';

export class RuleDto {
  @IsOptional()
  @IsString()
  triggerProductId?: string;

  @IsOptional()
  @IsString()
  triggerCollectionId?: string;

  @IsOptional()
  @IsString()
  triggerProductTag?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  minOrderValue?: number;

  @IsOptional()
  @IsString()
  customerType?: string;

  @IsOptional()
  @IsString()
  paymentType?: string;
}

export class OfferDto {
  @IsString()
  offerProductId!: string;

  @IsOptional()
  @IsString()
  offerVariantId?: string;

  @IsOptional()
  @IsString()
  offerProductHandle?: string;

  @IsString()
  offerProductTitle!: string;

  @IsOptional()
  @IsString()
  offerProductImage?: string;

  @IsOptional()
  @IsString()
  offerDescription?: string;

  @IsOptional()
  @IsNumber()
  offerPrice?: number;

  @IsOptional()
  @IsNumber()
  compareAtPrice?: number;

  @IsEnum(DiscountType)
  discountType!: DiscountType;

  @IsNumber()
  @Min(0)
  discountValue!: number;

  @IsEnum(DestinationType)
  destinationType!: DestinationType;

  @IsOptional()
  @IsString()
  destinationUrl?: string;

  @IsString()
  headline!: string;

  @IsString()
  subheadline!: string;

  @IsString()
  ctaText!: string;

  @IsOptional()
  @IsString()
  urgencyText?: string;

  @IsBoolean()
  timerEnabled!: boolean;

  @IsNumber()
  @Min(1)
  timerMinutes!: number;

  @IsOptional()
  @IsString()
  backgroundColor?: string;

  @IsOptional()
  @IsNumber()
  borderRadius?: number;

  @IsOptional()
  @IsString()
  buttonStyle?: string;

  @IsOptional()
  @IsBoolean()
  showComparePrice?: boolean;

  @IsOptional()
  @IsBoolean()
  showTrustBadges?: boolean;
}

export class CreateCampaignDto {
  @IsString()
  name!: string;

  @IsEnum(CampaignStatus)
  status!: CampaignStatus;

  @IsEnum(TriggerType)
  triggerType!: TriggerType;

  @IsEnum(OfferType)
  offerType!: OfferType;

  @IsOptional()
  @IsNumber()
  priority?: number;

  rule!: RuleDto;
  offer!: OfferDto;
}

export class UpdateCampaignDto extends CreateCampaignDto {}
