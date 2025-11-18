"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderDeal = exports.orderItem = exports.order = exports.rider = exports.dealItem = exports.deal = exports.itemDiscount = exports.item = exports.vendorCategory = exports.category = exports.vendor = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.vendor = (0, pg_core_1.pgTable)('vendor', {
    id: (0, pg_core_1.integer)().primaryKey().generatedAlwaysAsIdentity(),
    username: (0, pg_core_1.varchar)('username', { length: 255 }).notNull(),
    phone: (0, pg_core_1.varchar)('phone', { length: 255 }).notNull(),
    email: (0, pg_core_1.varchar)('email', { length: 255 }).unique().notNull(),
    img: (0, pg_core_1.varchar)('image'),
    password: (0, pg_core_1.varchar)('password', { length: 255 }).notNull(),
    location: (0, pg_core_1.varchar)('location', { length: 255 }),
    locked: (0, pg_core_1.boolean)().default(false).notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).defaultNow(),
});
exports.category = (0, pg_core_1.pgTable)('category', {
    id: (0, pg_core_1.integer)().primaryKey().generatedAlwaysAsIdentity(),
    img: (0, pg_core_1.varchar)('image', { length: 255 }),
    name: (0, pg_core_1.varchar)('name', { length: 255 }).unique().notNull(),
});
exports.vendorCategory = (0, pg_core_1.pgTable)('vendor_category', {
    vendor_id: (0, pg_core_1.integer)('vendor_id')
        .references(() => exports.vendor.id, { onDelete: 'cascade' })
        .notNull(),
    category_id: (0, pg_core_1.integer)('category_id')
        .references(() => exports.category.id, { onDelete: 'cascade' })
        .notNull(),
}, (table) => [(0, pg_core_1.primaryKey)({ columns: [table.vendor_id, table.category_id] })]);
exports.item = (0, pg_core_1.pgTable)('items', {
    id: (0, pg_core_1.integer)().primaryKey().generatedAlwaysAsIdentity(),
    name: (0, pg_core_1.varchar)('name', { length: 255 }).unique().notNull(),
    price: (0, pg_core_1.integer)('price').notNull(),
    description: (0, pg_core_1.varchar)('description', { length: 255 }).unique().notNull(),
    category_id: (0, pg_core_1.integer)('category_id')
        .references(() => exports.category.id, { onDelete: 'restrict' })
        .notNull(),
    vendor_id: (0, pg_core_1.integer)('vendor_id')
        .references(() => exports.vendor.id, { onDelete: 'cascade' })
        .notNull(),
    img: (0, pg_core_1.varchar)('image').notNull(),
    available: (0, pg_core_1.boolean)('available'),
});
exports.itemDiscount = (0, pg_core_1.pgTable)('item_discount', {
    id: (0, pg_core_1.integer)().primaryKey().generatedAlwaysAsIdentity(),
    item_id: (0, pg_core_1.integer)('item_id')
        .references(() => exports.item.id, { onDelete: 'cascade' })
        .unique()
        .notNull(),
    amount: (0, pg_core_1.integer)('amount').notNull(),
    available: (0, pg_core_1.boolean)('available').default(false).notNull(),
});
exports.deal = (0, pg_core_1.pgTable)('deals', {
    id: (0, pg_core_1.integer)().primaryKey().generatedAlwaysAsIdentity(),
    name: (0, pg_core_1.varchar)('name', { length: 255 }).notNull().unique(),
    vendor_id: (0, pg_core_1.integer)('vendor_id')
        .references(() => exports.vendor.id, { onDelete: 'cascade' })
        .notNull(),
    img: (0, pg_core_1.varchar)('image').notNull(),
    price: (0, pg_core_1.integer)('price').notNull(),
    available: (0, pg_core_1.boolean)('available'),
    created_at: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).defaultNow(),
});
exports.dealItem = (0, pg_core_1.pgTable)('deal_item', {
    deal_id: (0, pg_core_1.integer)('deal_id')
        .references(() => exports.deal.id, { onDelete: 'cascade' })
        .notNull(),
    item_id: (0, pg_core_1.integer)('item_id')
        .references(() => exports.item.id, { onDelete: 'cascade' })
        .notNull(),
    quantity: (0, pg_core_1.integer)('quantity').notNull().default(1),
}, (table) => [(0, pg_core_1.primaryKey)({ columns: [table.deal_id, table.item_id] })]);
exports.rider = (0, pg_core_1.pgTable)('riders', {
    id: (0, pg_core_1.integer)().primaryKey().generatedAlwaysAsIdentity(),
    created_at: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).defaultNow(),
    username: (0, pg_core_1.varchar)('name', { length: 255 }).notNull(),
    email: (0, pg_core_1.varchar)('email', { length: 255 }).unique().notNull(),
    password: (0, pg_core_1.varchar)('password', { length: 255 }).notNull(),
    phone: (0, pg_core_1.varchar)('phone', { length: 20 }).notNull(),
    image: (0, pg_core_1.varchar)('image'),
    available: (0, pg_core_1.boolean)('available').default(true),
    status: (0, pg_core_1.integer)().default(0),
    vendor_id: (0, pg_core_1.integer)('vendor_id').references(() => exports.vendor.id, { onDelete: 'cascade' }),
});
exports.order = (0, pg_core_1.pgTable)('orders', {
    id: (0, pg_core_1.integer)().primaryKey().generatedAlwaysAsIdentity(),
    created_at: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).defaultNow(),
    end_time: (0, pg_core_1.timestamp)('end_time', { withTimezone: true }),
    total_price: (0, pg_core_1.integer)('total_price').notNull(),
    note: (0, pg_core_1.varchar)('note', { length: 255 }),
    delivery_location: (0, pg_core_1.varchar)('delivery_location', { length: 255 }).notNull(),
    status: (0, pg_core_1.varchar)('status', { length: 50 }).notNull().default('pending'),
    assigned_rider_id: (0, pg_core_1.integer)('assigned_rider_id').references(() => exports.rider.id, { onDelete: 'set null' }),
    vendor_id: (0, pg_core_1.integer)('vendor_id')
        .references(() => exports.vendor.id, { onDelete: 'restrict' })
        .notNull(),
});
exports.orderItem = (0, pg_core_1.pgTable)('order_item', {
    id: (0, pg_core_1.integer)().primaryKey().generatedAlwaysAsIdentity(),
    order_id: (0, pg_core_1.integer)('order_id')
        .references(() => exports.order.id, { onDelete: 'cascade' })
        .notNull(),
    item_id: (0, pg_core_1.integer)('item_id')
        .references(() => exports.item.id, { onDelete: 'restrict' })
        .notNull(),
    quantity: (0, pg_core_1.integer)('quantity').notNull().default(1),
    price_at_order: (0, pg_core_1.integer)('price_at_order').notNull(),
});
exports.orderDeal = (0, pg_core_1.pgTable)('order_deal', {
    id: (0, pg_core_1.integer)().primaryKey().generatedAlwaysAsIdentity(),
    order_id: (0, pg_core_1.integer)('order_id')
        .references(() => exports.order.id, { onDelete: 'cascade' })
        .notNull(),
    deal_id: (0, pg_core_1.integer)('deal_id')
        .references(() => exports.deal.id, { onDelete: 'restrict' })
        .notNull(),
    quantity: (0, pg_core_1.integer)('quantity').notNull().default(1),
    price_at_order: (0, pg_core_1.integer)('price_at_order').notNull(),
});
//# sourceMappingURL=schema.js.map