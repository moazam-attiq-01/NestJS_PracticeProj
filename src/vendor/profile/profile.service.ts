import { Inject, Injectable } from "@nestjs/common";
import { DB_CONNECTION } from "../../db/db.module";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import * as schema from "../../db/schema";
import { CategoryDto, UpdateProfileDto } from "./dto";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import { CloudinaryService } from "src/cloudinary/cloudinary.service";

@Injectable()
export class ProfileService {
  constructor(
    @Inject(DB_CONNECTION) private db: PostgresJsDatabase<typeof schema>,
    private readonly cloudinary: CloudinaryService
  ) {}

  async getCategories(vendorId: number) {
    const categories = await this.db.select().from(schema.category);
    const vendorCategories = await this.db
      .select({
        id: schema.category.id,
        name: schema.category.name,
        img: schema.category.img,
      })
      .from(schema.category)
      .innerJoin(
        schema.vendorCategory,
        eq(schema.vendorCategory.category_id, schema.category.id)
      )
      .where(eq(schema.vendorCategory.vendor_id, vendorId));
    return { allCategories: categories, vendorCategories: vendorCategories };
  }
  async addCategory(
    vendorId: number,
    category: CategoryDto,
    file?: Express.Multer.File
  ) {
    let imageUrl = '';
    let cloudId = '';

    if (file) {
      const uploaded = await this.cloudinary.uploadFile(
        file,
        `categories`,
        `category_${vendorId}_${Date.now()}`
      );
      imageUrl = uploaded.secure_url;
      cloudId = uploaded.public_id;
    }

    const newCategory = await this.db
      .insert(schema.category)
      .values({ name: category.name, img: imageUrl, cloud_id: cloudId })
      .returning();

    await this.db
      .insert(schema.vendorCategory)
      .values({ vendor_id: vendorId, category_id: newCategory[0].id });
    return newCategory[0];
  }

  async updateCategory(
    vendorId: number,
    categoryId: number,
    file?: Express.Multer.File
  ) {
    let imageUrl = '';
    let cloudId = '';

    if (file) {
      // fetch existing category to delete old image
      const [existing] = await this.db
        .select()
        .from(schema.category)
        .where(eq(schema.category.id, categoryId));
      if (existing?.cloud_id)
        await this.cloudinary.deleteFile(existing.cloud_id);

      const uploaded = await this.cloudinary.uploadFile(
        file,
        `categories`,
        `category_${vendorId}_${categoryId}_${Date.now()}`
      );
      imageUrl = uploaded.secure_url;
      cloudId = uploaded.public_id;
    }

    await this.db
      .update(schema.category)
      .set({
        ...(imageUrl && { img: imageUrl }),
        ...(cloudId && { cloud_id: cloudId }),
      })
      .where(eq(schema.category.id, categoryId));

    const [updated] = await this.db
      .select()
      .from(schema.category)
      .where(eq(schema.category.id, categoryId));
    return updated;
  }

  async updateProfile(vendorId: number, details: UpdateProfileDto) {
    const updateData = { ...details } as Partial<
      typeof schema.vendor.$inferInsert
    >;
    if (details.password) {
      updateData.password = await bcrypt.hash(details.password, 10);
    }
    await this.db
      .update(schema.vendor)
      .set(updateData)
      .where(eq(schema.vendor.id, vendorId));
    return { message: "Profile updated successfully" };
  }
}
