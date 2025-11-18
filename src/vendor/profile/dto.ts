import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator'
import { PartialType } from '@nestjs/mapped-types'

export class ProfileDto {
  @IsString()
  username: string

  @IsEmail()
  email: string

  @IsString()
  password: string

  @IsString()
  img: string

  @IsNotEmpty()
  @MinLength(4)
  @IsString()
  phone: string
}

export class UpdateProfileDto extends PartialType(ProfileDto) {}

export class CategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string
}
