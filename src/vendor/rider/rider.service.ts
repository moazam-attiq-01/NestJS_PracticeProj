import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { DB_CONNECTION } from '../../db/db.module'
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import * as schema from '../../db/schema'
import { and, eq } from 'drizzle-orm'
import { RiderDto } from './dto'

@Injectable()
export class RiderService {
  constructor(@Inject(DB_CONNECTION) private db: PostgresJsDatabase<typeof schema>) {}

  createRider(data: RiderDto, vendorId: number) {
    return this.db.insert(schema.rider).values({ ...data, vendor_id: vendorId })
  }

  getRiders(vendorId: number) {
    return this.db.select().from(schema.rider).where(eq(schema.rider.vendor_id, vendorId))
  }

  async updateRider(data: RiderDto, vendorId: number) {
    const [r] = await this.db
      .select()
      .from(schema.rider)
      .where(and(eq(schema.rider.id, data.id), eq(schema.rider.vendor_id, vendorId)))

    if (!r) {
      throw new BadRequestException('Rider not found or not owned by vendor')
    }

    return this.db
      .update(schema.rider)
      .set({
        username: data.username,
        email: data.email,
        password: data.password,
        phone: data.phone,
        image: data.image,
        available: data.available,
        status: data.status,
      })
      .where(eq(schema.rider.id, data.id))
  }

  async deleteRider(vendorId: number, riderId: number) {
    await this.db.delete(schema.rider).where(and(eq(schema.rider.vendor_id, vendorId), eq(schema.rider.id, riderId)))

    return { message: 'Rider deleted successfully!' }
  }
}
