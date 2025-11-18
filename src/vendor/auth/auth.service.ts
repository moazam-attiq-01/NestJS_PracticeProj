import { Injectable, Inject, BadRequestException } from '@nestjs/common'
import { LoginDto } from './dto'
import { DB_CONNECTION } from '../../db/db.module'
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import * as schema from '../../db/schema'
import { eq } from 'drizzle-orm'
import bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
  constructor(@Inject(DB_CONNECTION) private db: PostgresJsDatabase<typeof schema>) {}

  async login(data: LoginDto) {
    const vendor = await this.db.select().from(schema.vendor).where(eq(schema.vendor.email, data.email))

    if (vendor.length === 0) {
      throw new BadRequestException('Invalid credentials')
    }
    if (!(await bcrypt.compare(data.password, vendor[0].password))) {
      throw new BadRequestException('Invalid credentials')
    }
    return { email: vendor[0].email, username: vendor[0].username, id: vendor[0].id }
  }
}
