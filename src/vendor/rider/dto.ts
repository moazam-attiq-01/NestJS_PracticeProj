import { IsBoolean, IsEmail, IsInt, IsNumber, IsOptional, IsString, MinLength } from 'class-validator'

export class RiderDto {
  @IsOptional()
  @IsNumber()
  id: number

  @IsString()
  @MinLength(3)
  username: string

  @IsEmail()
  email: string

  @IsString()
  @MinLength(8)
  password: string

  @IsString() // DB stores phone as varchar
  phone: string

  @IsOptional()
  @IsString()
  image?: string

  @IsOptional()
  @IsString()
  cloud_id?: string

  @IsOptional()
  @IsBoolean()
  available?: boolean

  @IsOptional()
  @IsInt()
  status?: number

}
