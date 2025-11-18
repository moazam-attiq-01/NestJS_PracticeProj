import { IsAlphanumeric, IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator'

// dto/login.dto.ts
export class LoginDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @IsAlphanumeric()
  password: string

  @IsEmail()
  email: string
}
