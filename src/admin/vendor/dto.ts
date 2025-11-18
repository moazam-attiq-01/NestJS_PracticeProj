import { IsString, IsEmail, IsOptional, IsBoolean, IsArray, IsNumber, IsNotEmpty, MinLength } from 'class-validator'

export class CreateVendorDto {
  @IsString()
  username: string

  @IsEmail()
  email: string

  @IsString()
  password: string

  @IsOptional()
  @IsString()
  img?: string

  @IsOptional()
  @IsString()
  location?: string

  @IsOptional()
  @IsBoolean()
  locked?: boolean

  @IsNotEmpty()
  @MinLength(4)
  @IsString()
  phone: string
}

export class UpdateVendorDto {
  @IsOptional()
  @IsString()
  username?: string

  @IsOptional()
  @IsEmail()
  email?: string

  @IsOptional()
  @IsString()
  img?: string

  @IsOptional()
  @IsString()
  location?: string

  @IsOptional()
  @IsBoolean()
  locked?: boolean

  @IsNotEmpty()
  @MinLength(4)
  @IsString()
  phone: string

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  category_ids?: number[]
}
