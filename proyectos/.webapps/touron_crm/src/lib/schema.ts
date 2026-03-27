import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const products = sqliteTable('products', {
    id: integer('id').primaryKey(),
    name: text('name').notNull(),
    brand: text('brand').notNull(), // Mercury, Quicksilver, Bayliner
    category: text('category').notNull(), // Engine, Boat, Accessory
    price: real('price').notNull(),
    stock: integer('stock').notNull().default(0),
    image: text('image'),
    description: text('description'),
    series: text('series'),
    specs: text('specs'), // JSON string for specs
    // New Professional Fields
    serialPrefix: text('serial_prefix'), // e.g., "2B..." for Mercury
    warrantyYears: integer('warranty_years').default(2),
});

export const clients = sqliteTable('clients', {
    id: integer('id').primaryKey(),
    name: text('name').notNull(),
    type: text('type').notNull(), // Dealer, Service, EndUser (though mostly B2B)
    email: text('email').notNull(),
    phone: text('phone'),
    address: text('address'),
    location: text('location'),
    // New Professional Fields
    tier: text('tier').default('Official'), // Premium, Official, Maintenance
    region: text('region'), // Iberia, Baleares, Canarias
    certificationLevel: text('certification_level').default('Standard'),
    creditLimit: real('credit_limit').default(5000),
});

export const orders = sqliteTable('orders', {
    id: integer('id').primaryKey(),
    clientId: integer('client_id').references(() => clients.id),
    date: text('date').notNull(),
    status: text('status').notNull(), // Pending, Processing, Shipped, Delivered, Cancelled
    total: real('total').notNull(),
    type: text('type').default('Standard'), // Standard, Urgent, WarrantyReplacement
});

export const orderItems = sqliteTable('order_items', {
    id: integer('id').primaryKey(),
    orderId: integer('order_id').references(() => orders.id),
    productId: integer('product_id').references(() => products.id),
    quantity: integer('quantity').notNull(),
    price: real('price').notNull(),
});

// --- NEW MODULES ---

// 1. Warranty System
export const warranties = sqliteTable('warranties', {
    id: integer('id').primaryKey(),
    serialNumber: text('serial_number').notNull(),
    productId: integer('product_id').references(() => products.id),
    dealerId: integer('dealer_id').references(() => clients.id),
    customerName: text('customer_name').notNull(),
    registrationDate: text('registration_date').notNull(),
    status: text('status').default('Pending'), // Pending, Approved, Rejected, InfoRequired
    claimType: text('claim_type').default('Registration'), // Registration, RepairClaim
    notes: text('notes'),
});

// 2. Technicians & Training
export const technicians = sqliteTable('technicians', {
    id: integer('id').primaryKey(),
    dealerId: integer('dealer_id').references(() => clients.id),
    name: text('name').notNull(),
    email: text('email'),
    certifications: text('certifications'), // JSON array: ["Mercury Outboard Pro", "Mercruiser Diesel"]
    status: text('status').default('Active'),
});

// 3. Campaigns & Bulletins
export const campaigns = sqliteTable('campaigns', {
    id: integer('id').primaryKey(),
    title: text('title').notNull(),
    description: text('description').notNull(),
    affectedProducts: text('affected_products'), // JSON or text description
    priority: text('priority').default('Routine'), // Routine, Urgent, Safety
    releaseDate: text('release_date').notNull(),
    bulletinUrl: text('bulletin_url'), // Link to PDF
});

// 4. Technical Resources (Manuals)
export const resources = sqliteTable('resources', {
    id: integer('id').primaryKey(),
    title: text('title').notNull(),
    type: text('type').notNull(), // Manual, Diagram, Software
    category: text('category'), // Outboard, Sterndrive, Electronics
    url: text('url').notNull(),
});

// 5. System Settings
export const settings = sqliteTable('settings', {
    key: text('key').primaryKey(),
    value: text('value').notNull(),
    description: text('description'),
    updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
});

// 6. User Authentication
export const users = sqliteTable('users', {
    id: integer('id').primaryKey(),
    username: text('username').unique().notNull(),
    password: text('password').notNull(),
    role: text('role').default('admin'),
});

