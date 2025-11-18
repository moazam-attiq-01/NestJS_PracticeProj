import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { DB_CONNECTION } from '../../db/db.module'
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import * as schema from '../../db/schema'
import { eq } from 'drizzle-orm'
import { CreateVendorDto, UpdateVendorDto } from './dto'
import bcrypt from 'bcrypt'

@Injectable()
export class VendorService {
  constructor(@Inject(DB_CONNECTION) private db: PostgresJsDatabase<typeof schema>) {}

  // ========== CREATE VENDOR ==========
  async createVendor(data: CreateVendorDto) {
    const hashedPassword = await bcrypt.hash(data.password, 12)
    // Create vendor
    const [vendor] = await this.db
      .insert(schema.vendor)
      .values({
        username: data.username,
        email: data.email,
        password: hashedPassword,
        img: data.img,
        location: data.location,
        locked: data.locked ?? false,
        phone: data.phone,
      })
      .returning()

    return vendor
  }

  // ========== UPDATE VENDOR (NO PASSWORD ALLOWED) ==========
  async updateVendor(vendorId: number, data: UpdateVendorDto) {
    // Check if vendor exists
    const [existing] = await this.db.select().from(schema.vendor).where(eq(schema.vendor.id, vendorId))
    if (!existing) throw new BadRequestException('Vendor not found')

    // Update vendor fields except password
    await this.db
      .update(schema.vendor)
      .set({
        username: data.username ?? existing.username,
        email: data.email ?? existing.email,
        img: data.img ?? existing.img,
        location: data.location ?? existing.location,
        locked: data.locked ?? existing.locked,
        phone: data.phone ?? existing.phone,
      })
      .where(eq(schema.vendor.id, vendorId))

    return { message: 'Vendor updated successfully' }
  }

  // ========== DELETE VENDOR ==========
  async deleteVendor(vendorId: number) {
    await this.db.delete(schema.vendor).where(eq(schema.vendor.id, vendorId))
    return { message: 'Vendor deleted successfully' }
  }
}
