import { Inject, Injectable } from '@nestjs/common'
import { DB_CONNECTION } from '../../db/db.module'
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import * as schema from '../../db/schema'
import { CategoryDto, UpdateProfileDto } from './dto'
import { eq } from 'drizzle-orm'
import bcrypt from 'bcrypt'

@Injectable()
export class ProfileService {
  constructor(@Inject(DB_CONNECTION) private db: PostgresJsDatabase<typeof schema>) {}

  async getCategories(vendorId: number) {
    const categories = await this.db.select().from(schema.category)
    const vendorCategories = await this.db
      .select({
        id: schema.category.id,
        name: schema.category.name,
        img: schema.category.img,
      })
      .from(schema.category)
      .innerJoin(schema.vendorCategory, eq(schema.vendorCategory.category_id, schema.category.id))
      .where(eq(schema.vendorCategory.vendor_id, vendorId))
    return { allCategories: categories, vendorCategories: vendorCategories }
  }
  async addCategory(vendorId: number, category: CategoryDto, file: Express.Multer.File) {
    const imagePath = file ? `uploads/categories/${file.filename}` : null
    const newCategory = await this.db
      .insert(schema.category)
      .values({ name: category.name, img: imagePath })
      .returning()
    await this.db.insert(schema.vendorCategory).values({ vendor_id: vendorId, category_id: newCategory[0].id })
    return newCategory[0]
  }

  async updateCategory(vendorId: number, categories: number[]) {
    for (const category of categories) {
      await this.db
        .insert(schema.vendorCategory)
        .values({ vendor_id: vendorId, category_id: category })
        .onConflictDoNothing()
    }

    const vendorCategories = await this.db
      .select({
        id: schema.category.id,
        name: schema.category.name,
        img: schema.category.img,
      })
      .from(schema.category)
      .innerJoin(schema.vendorCategory, eq(schema.vendorCategory.category_id, schema.category.id))
      .where(eq(schema.vendorCategory.vendor_id, vendorId))

    return { categories: vendorCategories }
  }

  async updateProfile(vendorId: number, details: UpdateProfileDto) {
    const updateData = { ...details } as Partial<typeof schema.vendor.$inferInsert>
    if (details.password) {
      updateData.password = await bcrypt.hash(details.password, 10)
    }
    await this.db.update(schema.vendor).set(updateData).where(eq(schema.vendor.id, vendorId))
    return { message: 'Profile updated successfully' }
  }
}
