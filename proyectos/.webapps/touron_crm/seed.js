const Database = require('better-sqlite3');
const db = new Database('touron.db');

// Drop existing tables
db.exec(`DROP TABLE IF EXISTS order_items`);
db.exec(`DROP TABLE IF EXISTS orders`);
db.exec(`DROP TABLE IF EXISTS warranties`);
db.exec(`DROP TABLE IF EXISTS technicians`);
db.exec(`DROP TABLE IF EXISTS campaigns`);
db.exec(`DROP TABLE IF EXISTS resources`);
db.exec(`DROP TABLE IF EXISTS products`);
db.exec(`DROP TABLE IF EXISTS clients`);

// Create tables
db.exec(`
  CREATE TABLE clients (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    address TEXT,
    location TEXT,
    tier TEXT DEFAULT 'Official',
    region TEXT,
    certification_level TEXT DEFAULT 'Standard',
    credit_limit REAL DEFAULT 5000
  )
`);

db.exec(`
  CREATE TABLE products (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    brand TEXT NOT NULL,
    category TEXT NOT NULL,
    price REAL NOT NULL,
    stock INTEGER NOT NULL,
    image TEXT,
    specs TEXT,
    serial_prefix TEXT,
    warranty_years INTEGER DEFAULT 2
  )
`);

db.exec(`
  CREATE TABLE orders (
    id INTEGER PRIMARY KEY,
    client_id INTEGER,
    date TEXT NOT NULL,
    status TEXT NOT NULL,
    total REAL NOT NULL,
    type TEXT DEFAULT 'Standard',
    FOREIGN KEY(client_id) REFERENCES clients(id)
  )
`);

db.exec(`
  CREATE TABLE order_items (
    id INTEGER PRIMARY KEY,
    order_id INTEGER,
    product_id INTEGER,
    quantity INTEGER NOT NULL,
    price REAL NOT NULL,
    FOREIGN KEY(order_id) REFERENCES orders(id),
    FOREIGN KEY(product_id) REFERENCES products(id)
  )
`);

db.exec(`
  CREATE TABLE warranties (
    id INTEGER PRIMARY KEY,
    serial_number TEXT NOT NULL,
    product_id INTEGER,
    dealer_id INTEGER,
    customer_name TEXT NOT NULL,
    registration_date TEXT NOT NULL,
    status TEXT DEFAULT 'Pending',
    claim_type TEXT DEFAULT 'Registration',
    notes TEXT,
    FOREIGN KEY(product_id) REFERENCES products(id),
    FOREIGN KEY(dealer_id) REFERENCES clients(id)
  )
`);

db.exec(`
  CREATE TABLE technicians (
    id INTEGER PRIMARY KEY,
    dealer_id INTEGER,
    name TEXT NOT NULL,
    email TEXT,
    certifications TEXT,
    status TEXT DEFAULT 'Active',
    FOREIGN KEY(dealer_id) REFERENCES clients(id)
  )
`);

db.exec(`
  CREATE TABLE campaigns (
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    affected_products TEXT,
    priority TEXT DEFAULT 'Routine',
    release_date TEXT NOT NULL,
    bulletin_url TEXT
  )
`);

db.exec(`
  CREATE TABLE resources (
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    type TEXT NOT NULL,
    category TEXT,
    url TEXT NOT NULL
  )
`);

// Seed Data Statements
const insertProduct = db.prepare('INSERT INTO products (name, brand, category, price, stock, image, specs, serial_prefix) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
const insertClient = db.prepare('INSERT INTO clients (name, type, email, phone, address, location, tier, region, certification_level) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
const insertOrder = db.prepare('INSERT INTO orders (client_id, date, status, total, type) VALUES (?, ?, ?, ?, ?)');
const insertOrderItem = db.prepare('INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)');
const insertWarranty = db.prepare('INSERT INTO warranties (serial_number, product_id, dealer_id, customer_name, registration_date, status, claim_type) VALUES (?, ?, ?, ?, ?, ?, ?)');
const insertTechnician = db.prepare('INSERT INTO technicians (dealer_id, name, certifications) VALUES (?, ?, ?)');
const insertCampaign = db.prepare('INSERT INTO campaigns (title, description, priority, release_date) VALUES (?, ?, ?, ?)');
const insertResource = db.prepare('INSERT INTO resources (title, type, category, url) VALUES (?, ?, ?, ?)');

console.log('Seeding Products...');

// 1. Mercury Outboards (Category: Engine)
const engines = [
  ['Mercury F 2.5 MH', 'Mercury', 'Engine', 1050, 20, '/images/f25.jpg', { hp: 2.5, type: '4-Stroke' }],
  ['Mercury F 3.5 MH', 'Mercury', 'Engine', 1200, 15, '/images/f35.jpg', { hp: 3.5, type: '4-Stroke' }],
  ['Mercury F 4 MH', 'Mercury', 'Engine', 1450, 18, '/images/f4.jpg', { hp: 4, type: '4-Stroke' }],
  ['Mercury F 5 MH', 'Mercury', 'Engine', 1600, 25, '/images/f5.jpg', { hp: 5, type: '4-Stroke' }],
  ['Mercury F 6 MH', 'Mercury', 'Engine', 1800, 10, '/images/f6.jpg', { hp: 6, type: '4-Stroke' }],
  ['Mercury F 8 MH', 'Mercury', 'Engine', 2400, 8, '/images/f8.jpg', { hp: 8, type: '4-Stroke' }],
  ['Mercury F 9.9 MH', 'Mercury', 'Engine', 2800, 12, '/images/f99.jpg', { hp: 9.9, type: '4-Stroke' }],
  ['Mercury F 15 EFI', 'Mercury', 'Engine', 3500, 30, '/images/f15.jpg', { hp: 15, type: 'EFI' }],
  ['Mercury F 20 EFI', 'Mercury', 'Engine', 4100, 22, '/images/f20.jpg', { hp: 20, type: 'EFI' }],
  ['Mercury F 25 EFI', 'Mercury', 'Engine', 4800, 14, '/images/f25efi.jpg', { hp: 25, type: 'EFI' }],
  ['Mercury F 30 EFI', 'Mercury', 'Engine', 5500, 10, '/images/f30.jpg', { hp: 30, type: 'EFI' }],
  ['Mercury F 40 EFI', 'Mercury', 'Engine', 6800, 15, '/images/f40.jpg', { hp: 40, type: 'EFI' }],
  ['Mercury F 50 EFI', 'Mercury', 'Engine', 7500, 20, '/images/f50.jpg', { hp: 50, type: 'EFI' }],
  ['Mercury F 60 EFI', 'Mercury', 'Engine', 8200, 18, '/images/f60.jpg', { hp: 60, type: 'EFI' }],
  ['Mercury F 80 EFI', 'Mercury', 'Engine', 10500, 8, '/images/f80.jpg', { hp: 80, type: 'EFI' }],
  ['Mercury F 100 EFI', 'Mercury', 'Engine', 11800, 12, '/images/f100.jpg', { hp: 100, type: 'EFI' }],
  ['Mercury F 115 EFI', 'Mercury', 'Engine', 12500, 15, '/images/f115.jpg', { hp: 115, type: 'EFI' }],
  ['Mercury F 150 EFI', 'Mercury', 'Engine', 16500, 25, '/images/f150.jpg', { hp: 150, type: 'EFI' }],
  ['Mercury V6 175', 'Mercury', 'Engine', 17800, 10, '/images/v6175.jpg', { hp: 175, type: 'V6' }],
  ['Mercury V6 200', 'Mercury', 'Engine', 19500, 14, '/images/v6200.jpg', { hp: 200, type: 'V6' }],
  ['Mercury V6 225', 'Mercury', 'Engine', 21000, 8, '/images/v6225.jpg', { hp: 225, type: 'V6' }],
  ['Mercury V8 250 Verado', 'Mercury', 'Engine', 24500, 5, '/images/v8250.jpg', { hp: 250, type: 'V8' }],
  ['Mercury V8 300 Verado', 'Mercury', 'Engine', 28900, 6, '/images/v8300.jpg', { hp: 300, type: 'V8' }],
  ['Mercury V10 350 Verado', 'Mercury', 'Engine', 35000, 3, '/images/v10350.jpg', { hp: 350, type: 'V10' }],
  ['Mercury V10 400 Verado', 'Mercury', 'Engine', 42000, 2, '/images/v10400.jpg', { hp: 400, type: 'V10' }],
  ['Mercury V12 600 Verado', 'Mercury', 'Engine', 85000, 1, '/images/v12600.jpg', { hp: 600, type: 'V12' }],
];

engines.forEach(p => insertProduct.run(p[0], p[1], p[2], p[3], p[4], p[5], JSON.stringify(p[6]), '1B' + Math.floor(Math.random() * 100000)));

// 2. Boats (Category: Boat)
const boats = [
  ['Quicksilver Activ 455 Cabin', 'Quicksilver', 'Boat', 18000, 5, '/images/qs455.jpg', { length: '4.55m' }],
  ['Quicksilver Activ 505 Open', 'Quicksilver', 'Boat', 22000, 4, '/images/qs505.jpg', { length: '5.05m' }],
  ['Quicksilver Activ 555 Open', 'Quicksilver', 'Boat', 26500, 6, '/images/qs555.jpg', { length: '5.55m' }],
  ['Quicksilver Activ 605 Open', 'Quicksilver', 'Boat', 32000, 3, '/images/qs605.jpg', { length: '6.05m' }],
  ['Quicksilver Activ 675 Open', 'Quicksilver', 'Boat', 41000, 2, '/images/qs675.jpg', { length: '6.75m' }],
  ['Quicksilver Activ 755 Weekend', 'Quicksilver', 'Boat', 65000, 1, '/images/qs755w.jpg', { length: '7.55m' }],
  ['Quicksilver Activ 805 Cruiser', 'Quicksilver', 'Boat', 78000, 1, '/images/qs805c.jpg', { length: '8.05m' }],
  ['Bayliner VR5 Bowrider', 'Bayliner', 'Boat', 45000, 2, '/images/blvr5.jpg', { length: '6.23m' }],
  ['Bayliner VR6 Bowrider', 'Bayliner', 'Boat', 52000, 2, '/images/blvr6.jpg', { length: '6.82m' }],
  ['Bayliner Element M15', 'Bayliner', 'Boat', 19000, 8, '/images/blem15.jpg', { length: '4.62m' }],
  ['Bayliner Element M17', 'Bayliner', 'Boat', 24500, 5, '/images/blem17.jpg', { length: '5.18m' }],
];

boats.forEach(p => insertProduct.run(p[0], p[1], p[2], p[3], p[4], p[5], JSON.stringify(p[6]), 'BE' + Math.floor(Math.random() * 100000)));

// 3. Parts & Accessories
const parts = [
  ['Hélice Black Max 15p', 'Mercury', 'Part', 250, 40, '/images/prop1.jpg', { pitch: 15, material: 'Aluminium' }],
  ['Hélice Enertia 19p', 'Mercury', 'Part', 850, 12, '/images/prop2.jpg', { pitch: 19, material: 'Stainless' }],
  ['Aceite 25W-40 4L', 'Quicksilver', 'Part', 45, 200, '/images/oil1.jpg', { grade: '25W-40' }],
  ['Filtro Combustible', 'Quicksilver', 'Part', 22, 150, '/images/filter1.jpg', { type: 'Fuel' }],
  ['SmartCraft Connect', 'Mercury', 'Accessory', 450, 25, '/images/sc1.jpg', { type: 'Interface' }],
  ['VesselView Mobile', 'Mercury', 'Accessory', 280, 50, '/images/vv1.jpg', { type: 'Bluetooth' }],
  ['Kit Mantenimiento 100h F150', 'Quicksilver', 'Part', 180, 40, '/images/kit150.jpg', { hours: 100 }],
  ['Ánodo Zinc Trim', 'Quicksilver', 'Part', 18, 300, '/images/anode1.jpg', { material: 'Zinc' }],
];

parts.forEach(p => insertProduct.run(p[0], p[1], p[2], p[3], p[4], p[5], JSON.stringify(p[6]), null));


console.log('Seeding Clients...');
const dealers = [
  ['Náutica Madrid Center', 'Dealer', 'ventas@nauticamadrid.es', '910000001', 'Madrid', 'Premium', 'Master Tech'],
  ['Marina Barcelona', 'Service', 'service@marinabcn.es', '930000002', 'Barcelona', 'Official', 'Certified'],
  ['Náutica Valencia Sur', 'Dealer', 'info@nauticavalencia.es', '960000003', 'Valencia', 'Official', 'Standard'],
  ['Ibiza Yacht Service', 'Service', 'taller@ibizayacht.es', '971000004', 'Ibiza', 'Premium', 'Master Tech'],
  ['Motonáutica Balear', 'Dealer', 'ventas@motobalear.es', '971000005', 'Palma', 'Official', 'Certified'],
  ['Náutica Costa Brava', 'Dealer', 'info@ncb.es', '972000006', 'Girona', 'Premium', 'Master Tech'],
  ['Talleres del Mar', 'Service', 'taller@delmar.es', '981000007', 'A Coruña', 'Official', 'Standard'],
  ['Sur Náutica', 'Dealer', 'ventas@surnautica.es', '952000008', 'Málaga', 'Official', 'Certified'],
];

dealers.forEach(d => insertClient.run(d[0], d[1], d[2], d[3], 'Main St 123', d[4], d[5], 'Iberia', d[6]));

console.log('Seeding Orders & Warranties...');
// Create some mock orders
insertOrder.run(1, '2023-11-01', 'Completed', 45000, 'Standard');
insertOrder.run(2, '2023-11-05', 'Pending', 1200, 'Urgent');
insertOrder.run(3, '2023-11-10', 'Processing', 8500, 'Stock');

// Mock Warranties
insertWarranty.run('1B456789', 18, 1, 'Juan Pérez', '2023-09-01', 'Approved', 'Registration');
insertWarranty.run('1B987654', 22, 1, 'Charter Ibiza SL', '2023-09-15', 'Pending', 'RepairClaim');
insertWarranty.run('BE123456', 30, 4, 'Carlos Ruiz', '2023-10-01', 'Approved', 'Registration');

// Technicians
insertTechnician.run(1, 'Antonio García', JSON.stringify(['Mercury Outboard Pro', 'Verado Certified']));
insertTechnician.run(1, 'Luis Rodriguez', JSON.stringify(['Mercury Maintenance']));
insertTechnician.run(4, 'Marc Costa', JSON.stringify(['Master Technician', 'Diesel Certified']));

// Campaigns
insertCampaign.run('Boletín de Servicio 2023-05', 'Actualización de software PCM para motores V6/V8', 'Routine', '2023-05-20');
insertCampaign.run('Recall Seguridad: Bomba de Combustible', 'Inspección obligatoria de módulo de combustible en modelos 2022', 'Urgent', '2023-08-10');

// Resources
insertResource.run('Manual de Propietario V6/V8', 'Manual', 'Outboard', '/manuals/v6_v8_owners.pdf');
insertResource.run('Programa de Mantenimiento 100h', 'Document', 'Service', '/docs/maint_100h.pdf');

console.log('Database seeded successfully with expanded dataset!');
