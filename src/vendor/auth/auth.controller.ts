import { BadRequestException, Body, Controller, Get, Inject, Post, Req } from '@nestjs/common'
import type { Request } from 'express'
import { AuthService } from './auth.service'
import { LoginDto } from './dto'
import { DB_CONNECTION } from '../../db/db.module'
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import * as schema from '../../db/schema'
import { eq } from 'drizzle-orm'

@Controller('vendor/auth')
export class AuthController {
  constructor(
    @Inject(DB_CONNECTION) private db: PostgresJsDatabase<typeof schema>,
    private readonly authService: AuthService,
  ) {}

  @Post('login')
  async login(@Req() req: Request, @Body() data: LoginDto) {
    const vendor = await this.authService.login(data)
    req.session.vendorId = vendor.id;
    req.session.vendor = { id: vendor.id, username: vendor.username, email: vendor.email, };
    return { vendor }
  }

  @Get('me')
  async me(@Req() req: Request) {
    const vendor = req.session.vendor;
    if (!vendor) return null
    const user = await this.db.select().from(schema.vendor).where(eq(schema.vendor.id, vendor.id));
    return user.length ? { vendor: user[0] } : null;
  }

  @Post('logout')
  async logout(@Req() req: Request) {
    try {
      await new Promise<void>((resolve, reject) => {
        req.session.destroy((err) => {
          if (err) {
            reject(err)
          } else {
            resolve()
          }
        })
      })
      return { message: 'Logged out successfully' }
    } catch (error) {
      throw new BadRequestException('Failed to logout')
    }
  }
}
