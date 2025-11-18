import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { DealDto, ItemDto } from './dto'
import { DB_CONNECTION } from '../../db/db.module'
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import * as schema from '../../db/schema'
import { and, eq } from 'drizzle-orm'

@Injectable()
export class MenuService {
  constructor(@Inject(DB_CONNECTION) private db: PostgresJsDatabase<typeof schema>) {}

  // ========== ITEM ==========
  async createItem(data: ItemDto, file: Express.Multer.File, vendorId: number) {
    const imagePath = `uploads/items/${file.filename}`

    const [item] = await this.db
      .insert(schema.item)
      .values({
        name: data.name,
        price: Number(data.price),
        description: data.description,
        available: Boolean(data.available) ?? false,
        category_id: Number(data.category_id),
        vendor_id: vendorId,
        img: imagePath,
      })
      .returning()

    if (data.discount && data.discount.amount > 0) {
      await this.db.insert(schema.itemDiscount).values({
        item_id: item.id,
        amount: data.discount.amount,
        available: Boolean(data.discount.available),
      })
    }

    // join category + discount for consistent structure
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

  async updateItem(data: ItemDto, vendorId: number, itemId: number) {
    if (!data) throw new BadRequestException('No data provided for update');
    
    const [item] = await this.db
      .select()
      .from(schema.item)
      .where(and(eq(schema.item.id, itemId), eq(schema.item.vendor_id, vendorId)))

    if (!item) throw new BadRequestException('Item not found or not owned by vendor')

    await this.db
      .update(schema.item)
      .set({
        name: data.name ?? item.name,
        price: data.price ?? item.price,
        description: data.description ?? item.description,
        category_id: data.category_id ?? item.category_id,
        available: data.available ?? item.available,
      })
      .where(eq(schema.item.id, itemId))

    // update discount table
    if (data.discount) {
      await this.db
        .insert(schema.itemDiscount)
        .values({
          item_id: itemId,
          amount: data.discount.amount,
          available: data.discount.available,
        })
        .onConflictDoUpdate({
          target: schema.itemDiscount.item_id,
          set: {
            amount: data.discount.amount,
            available: data.discount.available,
          },
        })
    }

    return { message: 'Item updated successfully' }
  }

  async deleteItem(vendorId: number, itemId: number) {
    const deleted = await this.db
      .delete(schema.item)
      .where(and(eq(schema.item.vendor_id, vendorId), eq(schema.item.id, itemId)))

    if (!deleted) {
      throw new BadRequestException('Item not found or not owned by vendor')
    }
    return { message: 'Item deleted successfully', itemId }
  }

  // ========== DEAL ==========
  async createDeal(data: DealDto, file: Express.Multer.File, vendorId: number) {
    const items = typeof data.items === 'string' ? JSON.parse(data.items) : data.items
    //const imagePath = `uploads/items/${file.filename}`
    const imagePath = ''
    const [deal] = await this.db
      .insert(schema.deal)
      .values({ name: data.name, img: imagePath, price: data.price, vendor_id: vendorId, available: data.available })
      .returning()

    for (const i of items) {
      await this.db.insert(schema.dealItem).values({ deal_id: deal.id, item_id: i.item_id, quantity: i.qty })
    }

    const rows = await this.db
      .select({
        deal_id: schema.deal.id,
        deal_name: schema.deal.name,
        deal_price: schema.deal.price,
        deal_img: schema.deal.img,
        deal_available: schema.deal.available,
        created_at: schema.deal.created_at,
        item_id: schema.item.id,
        item_name: schema.item.name,
        item_quantity: schema.dealItem.quantity,
        item_category: schema.category.name,
      })
      .from(schema.deal)
      .leftJoin(schema.dealItem, eq(schema.deal.id, schema.dealItem.deal_id))
      .leftJoin(schema.item, eq(schema.dealItem.item_id, schema.item.id))
      .leftJoin(schema.category, eq(schema.item.category_id, schema.category.id))
      .where(eq(schema.deal.id, deal.id))

    // Group items into an array
    const fullDeal = rows.length
      ? {
          deal_id: rows[0].deal_id,
          deal_name: rows[0].deal_name,
          deal_price: rows[0].deal_price,
          deal_img: rows[0].deal_img ?? '',
          deal_available: rows[0].deal_available ?? false,
          created_at: rows[0].created_at,
          items: rows.map((row) => ({
            itemId: row.item_id,
            itemName: row.item_name,
            itemQuantity: row.item_quantity,
            itemCategory: row.item_category,
          })),
        }
      : null

    return fullDeal
  }

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

    // Group deals and items
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

  async updateDeal(data: DealDto, vendorId: number) {
    const [existing] = await this.db
      .select()
      .from(schema.deal)
      .where(and(eq(schema.deal.id, data.id), eq(schema.deal.vendor_id, vendorId)))

    if (!existing) throw new BadRequestException('Deal not found or not owned by vendor')

    await this.db
      .update(schema.deal)
      .set({ name: data.name, img: data.img, price: data.price, available: data.available })
      .where(eq(schema.deal.id, data.id))

    // replace deal items
    await this.db.delete(schema.dealItem).where(eq(schema.dealItem.deal_id, data.id))
    for (const i of data.items) {
      await this.db.insert(schema.dealItem).values({ deal_id: data.id, item_id: i.item_id, quantity: i.qty })
    }

    return { message: 'Deal updated successfully' }
  }

  async deleteDeal(vendorId: number, dealId: number) {
    const deleted = await this.db
      .delete(schema.deal)
      .where(and(eq(schema.deal.vendor_id, vendorId), eq(schema.deal.id, dealId)))
    
    if (!deleted) {
      throw new BadRequestException('Deal not found or not owned by vendor')
    }
    return { message: 'Deal deleted successfully', dealId }
  }
}
