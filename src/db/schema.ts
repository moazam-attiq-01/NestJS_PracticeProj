import { timestamp, pgTable, varchar, integer, boolean, primaryKey } from 'drizzle-orm/pg-core'

// ============= VENDORS =============
export const vendor = pgTable('vendor', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  username: varchar('username', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  img: varchar('image'),
  password: varchar('password', { length: 255 }).notNull(),
  location: varchar('location', { length: 255 }),
  locked: boolean().default(false).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
})

// ============= CATEGORIES =============
export const category = pgTable('category', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  img: varchar('image', { length: 255 }),
  name: varchar('name', { length: 255 }).unique().notNull(),
})

// Many-to-many: Vendor ↔ Category
export const vendorCategory = pgTable(
  'vendor_category',
  {
    vendor_id: integer('vendor_id')
      .references(() => vendor.id, { onDelete: 'cascade' })
      .notNull(),
    category_id: integer('category_id')
      .references(() => category.id, { onDelete: 'cascade' })
      .notNull(),
  },
  (table) => [primaryKey({ columns: [table.vendor_id, table.category_id] })],
)

// ============= ITEMS =============
export const item = pgTable('items', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar('name', { length: 255 }).unique().notNull(),
  price: integer('price').notNull(),
  description: varchar('description', { length: 255 }).unique().notNull(),
  category_id: integer('category_id')
    .references(() => category.id, { onDelete: 'restrict' })
    .notNull(),
  vendor_id: integer('vendor_id')
    .references(() => vendor.id, { onDelete: 'cascade' })
    .notNull(),
  img: varchar('image').notNull(),
  available: boolean('available'),
})

// Separate discount table
export const itemDiscount = pgTable('item_discount', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  item_id: integer('item_id')
    .references(() => item.id, { onDelete: 'cascade' })
    .unique()
    .notNull(),
  amount: integer('amount').notNull(),
  available: boolean('available').default(false).notNull(),
})

// ============= DEALS =============
export const deal = pgTable('deals', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar('name', { length: 255 }).notNull().unique(),
  vendor_id: integer('vendor_id')
    .references(() => vendor.id, { onDelete: 'cascade' })
    .notNull(),
  img: varchar('image').notNull(),
  price: integer('price').notNull(),
  available: boolean('available'),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
})

// Many-to-many: Deal ↔ Item (with quantity)
export const dealItem = pgTable(
  'deal_item',
  {
    deal_id: integer('deal_id')
      .references(() => deal.id, { onDelete: 'cascade' })
      .notNull(),
    item_id: integer('item_id')
      .references(() => item.id, { onDelete: 'cascade' })
      .notNull(),
    quantity: integer('quantity').notNull().default(1),
  },
  (table) => [primaryKey({ columns: [table.deal_id, table.item_id] })],
)

// ============= RIDERS =============
export const rider = pgTable('riders', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
  username: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  password: varchar('password', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 20 }).notNull(),
  image: varchar('image'),
  available: boolean('available').default(true),
  status: integer().default(0),
  vendor_id: integer('vendor_id').references(() => vendor.id, { onDelete: 'cascade' }),
})

// ============= ORDERS =============
export const order = pgTable('orders', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
  end_time: timestamp('end_time', { withTimezone: true }),
  total_price: integer('total_price').notNull(),
  note: varchar('note', { length: 255 }),
  delivery_location: varchar('delivery_location', { length: 255 }).notNull(),
  status: varchar('status', { length: 50 }).notNull().default('pending'),
  assigned_rider_id: integer('assigned_rider_id').references(() => rider.id, { onDelete: 'set null' }),
  vendor_id: integer('vendor_id')
    .references(() => vendor.id, { onDelete: 'restrict' })
    .notNull(),
})

// Many-to-many: Order ↔ Item (with quantity)
export const orderItem = pgTable('order_item', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  order_id: integer('order_id')
    .references(() => order.id, { onDelete: 'cascade' })
    .notNull(),
  item_id: integer('item_id')
    .references(() => item.id, { onDelete: 'restrict' })
    .notNull(),
  quantity: integer('quantity').notNull().default(1),
  price_at_order: integer('price_at_order').notNull(),
})

// Many-to-many: Order ↔ Deal (with quantity)
export const orderDeal = pgTable('order_deal', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  order_id: integer('order_id')
    .references(() => order.id, { onDelete: 'cascade' })
    .notNull(),
  deal_id: integer('deal_id')
    .references(() => deal.id, { onDelete: 'restrict' })
    .notNull(),
  quantity: integer('quantity').notNull().default(1),
  price_at_order: integer('price_at_order').notNull(),
})
