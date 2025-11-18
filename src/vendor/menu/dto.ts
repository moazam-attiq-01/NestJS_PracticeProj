import { IsString, IsInt, IsOptional, IsBoolean, ValidateNested, MinLength, IsNumber } from 'class-validator'
import { Type } from 'class-transformer'

class DiscountDto {
  @IsInt()
  amount: number

  @IsBoolean()
  available: boolean
}

export class ItemDto {
  @IsOptional()
  @IsNumber()
  id: number

  @IsBoolean()
  available: boolean

  @IsNumber()
  category_id: number

  @IsString()
  @MinLength(3)
  name: string

  @IsInt()
  price: number

  @IsString()
  description: string

  @IsOptional()
  @ValidateNested()
  @Type(() => DiscountDto)
  discount?: DiscountDto
}

class DealItemDto {
  @IsInt()
  item_id: number

  @IsInt()
  qty: number
}

export class DealDto {
  @IsOptional()
  @IsNumber()
  id: number

  @IsString()
  @MinLength(3)
  name: string

  @IsString()
  img: string

  @IsInt()
  price: number

  @ValidateNested({ each: true })
  @Type(() => DealItemDto)
  items: DealItemDto[]

  @IsBoolean()
  available: boolean
}
