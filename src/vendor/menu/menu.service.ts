import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { DealDto, ItemDto } from './dto'
import { DB_CONNECTION } from '../../db/db.module'
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import * as schema from '../../db/schema'
import { and, eq } from 'drizzle-orm'
import { CloudinaryService } from 'src/cloudinary/cloudinary.service'

@Injectable()
export class MenuService {
  constructor(
    @Inject(DB_CONNECTION) private db: PostgresJsDatabase<typeof schema>,
    private readonly cloudinary: CloudinaryService
  ) {}

  // ============================================================
  // ITEM — CREATE
  // ============================================================
  async createItem(dto: ItemDto, imageUrl: string, cloudId: string, vendorId: number) {
    const [item] = await this.db
      .insert(schema.item)
      .values({
        name: dto.name,
        price: Number(dto.price),
        description: dto.description,
        available: Boolean(dto.available) ?? false,
        category_id: Number(dto.category_id),
        vendor_id: vendorId,
        img: imageUrl ?? null,
        cloud_id: cloudId ?? null
      })
      .returning()

    if (dto.discount && dto.discount.amount > 0) {
      await this.db.insert(schema.itemDiscount).values({
        item_id: item.id,
        amount: dto.discount.amount,
        available: Boolean(dto.discount.available),
      })
    }

    const [fullItem] = await this.db
      .select({
        id: schema.item.id,
        name: schema.item.name,
        description: schema.item.description,
        price: schema.item.price,
        available: schema.item.available,
        category: schema.category.name,
        discount_amount: schema.itemDiscount.amount,
        discount_available: schema.itemDiscount.available,
        img: schema.item.img,
      })
      .from(schema.item)
      .leftJoin(schema.category, eq(schema.item.category_id, schema.category.id))
      .leftJoin(schema.itemDiscount, eq(schema.item.id, schema.itemDiscount.item_id))
      .where(eq(schema.item.id, item.id))

    return {
      id: fullItem.id,
      name: fullItem.name,
      description: fullItem.description ?? '',
      price: fullItem.price,
      available: fullItem.available ?? false,
      category: fullItem.category ?? '',
      discount: {
        amount: fullItem.discount_amount ?? 0,
        available: fullItem.discount_available ?? false,
      },
      img: fullItem.img ?? '',
    }
  }

  // ============================================================
  // ITEM — GET
  // ============================================================
  async getItems(vendorId: number) {
    const items = await this.db
      .select({
        id: schema.item.id,
        name: schema.item.name,
        description: schema.item.description,
        price: schema.item.price,
        available: schema.item.available,
        category: schema.category.name,
        categoryId: schema.category.id,
        discount_amount: schema.itemDiscount.amount,
        discount_available: schema.itemDiscount.available,
        img: schema.item.img,
      })
      .from(schema.item)
      .leftJoin(schema.category, eq(schema.item.category_id, schema.category.id))
      .leftJoin(schema.itemDiscount, eq(schema.item.id, schema.itemDiscount.item_id))
      .where(eq(schema.item.vendor_id, vendorId))

    return items.map((item) => ({
      id: item.id,
      name: item.name,
      available: item.available ?? false,
      price: item.price,
      description: item.description ?? '',
      category: item.category ?? '',
      categoryId: item.categoryId,
      discount: {
        amount: item.discount_amount ?? 0,
        available: item.discount_available ?? false,
      },
      img: item.img ?? '',
    }))
  }

  // ============================================================
  // ITEM — UPDATE
  // ============================================================
  async updateItem(
    dto: ItemDto,
    vendorId: number,
    itemId: number,
    imageUrl?: string,
    cloudId?: string
  ) {
    if (!dto) throw new BadRequestException('No data provided for update')

    const [item] = await this.db
      .select()
      .from(schema.item)
      .where(and(eq(schema.item.id, itemId), eq(schema.item.vendor_id, vendorId)))

    if (!item) throw new BadRequestException('Item not found or not owned by vendor')      

    if (imageUrl !== '' && item.cloud_id) {
      await this.cloudinary.deleteFile(item.cloud_id)
    }

    await this.db
      .update(schema.item)
      .set({
        name: dto.name ?? item.name,
        price: dto.price ?? item.price,
        description: dto.description ?? item.description,
        category_id: dto.category_id ?? item.category_id,
        available: dto.available ?? item.available,
        img: imageUrl !== '' ? imageUrl : item.img,
        cloud_id: cloudId !== '' ? cloudId : item.cloud_id
      })
      .where(eq(schema.item.id, itemId))

    // update discount
    if (dto.discount) {
      await this.db
        .insert(schema.itemDiscount)
        .values({
          item_id: itemId,
          amount: dto.discount.amount,
          available: dto.discount.available,
        })
        .onConflictDoUpdate({
          target: schema.itemDiscount.item_id,
          set: {
            amount: dto.discount.amount,
            available: dto.discount.available,
          },
        })
    }

    return { message: 'Item updated successfully' }
  }

  // ============================================================
  // ITEM — DELETE
  // ============================================================
  async deleteItem(vendorId: number, itemId: number) {
    const [item] = await this.db
      .select()
      .from(schema.item)
      .where(and(eq(schema.item.id, itemId), eq(schema.item.vendor_id, vendorId)))

    if (!item) throw new BadRequestException('Item not found or not owned by vendor')

    if (item.cloud_id) {
      await this.cloudinary.deleteFile(item.cloud_id)
    }

    await this.db.delete(schema.item).where(eq(schema.item.id, itemId))

    return { message: 'Item deleted successfully', itemId }
  }

  // ============================================================
  // DEAL — CREATE
  // ============================================================
  async createDeal(dto: DealDto, imageUrl: string, cloudId: string, vendorId: number) {
    const items = typeof dto.items === 'string' ? JSON.parse(dto.items) : dto.items

    const [deal] = await this.db
      .insert(schema.deal)
      .values({
        name: dto.name,
        img: imageUrl ?? null,
        cloud_id: cloudId ?? null,
        price: dto.price,
        vendor_id: vendorId,
        available: dto.available,
      })
      .returning()

    for (const i of items) {
      await this.db.insert(schema.dealItem).values({
        deal_id: deal.id,
        item_id: i.item_id,
        quantity: i.qty,
      })
    }

    return deal
  }

  // ============================================================
  // DEAL — GET
  // ============================================================
  async getDeals(vendorId: number) {
    const rows = await this.db
      .select({
        deal_id: schema.deal.id,
        deal_name: schema.deal.name,
        deal_available: schema.deal.available,
        deal_price: schema.deal.price,
        deal_img: schema.deal.img,

        item_id: schema.item.id,
        item_name: schema.item.name,
        item_quantity: schema.dealItem.quantity,
        item_category: schema.category.name,
      })
      .from(schema.deal)
      .leftJoin(schema.dealItem, eq(schema.deal.id, schema.dealItem.deal_id))
      .leftJoin(schema.item, eq(schema.dealItem.item_id, schema.item.id))
      .leftJoin(schema.category, eq(schema.item.category_id, schema.category.id))
      .where(eq(schema.deal.vendor_id, vendorId))

    const grouped: Record<number, any> = {}

    for (const row of rows) {
      if (!grouped[row.deal_id]) {
        grouped[row.deal_id] = {
          dealId: row.deal_id,
          dealImg: row.deal_img,
          dealName: row.deal_name,
          available: row.deal_available,
          price: row.deal_price,
          items: [],
        }
      }

      if (row.item_id) {
        grouped[row.deal_id].items.push({
          itemId: row.item_id,
          name: row.item_name,
          quantity: row.item_quantity,
          category: row.item_category,
        })
      }
    }

    return Object.values(grouped)
  }

  // ============================================================
  // DEAL — UPDATE
  // ============================================================
  async updateDeal(dto: DealDto, vendorId: number, imageUrl?: string, cloudId?: string) {
    const [existing] = await this.db
      .select()
      .from(schema.deal)
      .where(and(eq(schema.deal.id, dto.id), eq(schema.deal.vendor_id, vendorId)))

    if (!existing) throw new BadRequestException('Deal not found or not owned by vendor')

    // delete old cloud image if new one provided
    if (imageUrl && existing.cloud_id) {
      await this.cloudinary.deleteFile(existing.cloud_id)
    }

    await this.db
      .update(schema.deal)
      .set({
        name: dto.name,
        price: dto.price,
        available: dto.available,
        img: imageUrl ?? existing.img,
        cloud_id: cloudId ?? existing.cloud_id
      })
      .where(eq(schema.deal.id, dto.id))

    // replace deal items
    await this.db.delete(schema.dealItem).where(eq(schema.dealItem.deal_id, dto.id))

    for (const i of dto.items) {
      await this.db.insert(schema.dealItem).values({
        deal_id: dto.id,
        item_id: i.item_id,
        quantity: i.qty,
      })
    }

    return { message: 'Deal updated successfully' }
  }

  // ============================================================
  // DEAL — DELETE
  // ============================================================
  async deleteDeal(vendorId: number, dealId: number) {
    const [deal] = await this.db
      .select()
      .from(schema.deal)
      .where(and(eq(schema.deal.id, dealId), eq(schema.deal.vendor_id, vendorId)))

    if (!deal) {
      throw new BadRequestException('Deal not found or not owned by vendor')
    }

    if (deal.cloud_id) {
      await this.cloudinary.deleteFile(deal.cloud_id)
    }

    await this.db.delete(schema.deal).where(eq(schema.deal.id, dealId))

    return { message: 'Deal deleted successfully', dealId }
  }
}
