'use server';

import { db } from '@/lib/db';
import { clients, warranties, technicians, products, orders, campaigns, resources, settings, users } from '@/lib/schema';
import { eq, sql, and } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import fs from 'fs';
import path from 'path';

// --- Clients ---

export async function addClient(formData: FormData) {
    const name = formData.get('name') as string;
    const type = formData.get('type') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const location = formData.get('location') as string;
    const region = formData.get('region') as string;

    if (!name || !email) {
        throw new Error('Name and Email are required');
    }

    await db.insert(clients).values({
        name,
        type,
        email,
        phone,
        location,
        region,
        tier: 'Official', // Default
        address: 'N/A', // Default
        creditLimit: 5000 // Default
    });

    revalidatePath('/clients');
    revalidatePath('/'); // Update dashboard metrics
}

export async function deleteClient(formData: FormData) {
    const id = parseInt(formData.get('id') as string);

    if (!id) return;

    await db.delete(clients).where(eq(clients.id, id));
    revalidatePath('/clients');
    revalidatePath('/');
}

export async function updateClient(formData: FormData) {
    const id = parseInt(formData.get('id') as string);
    const name = formData.get('name') as string;
    const type = formData.get('type') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const location = formData.get('location') as string;
    const region = formData.get('region') as string;

    if (!id || !name || !email) {
        throw new Error('ID, Name and Email are required');
    }

    await db.update(clients)
        .set({
            name,
            type,
            email,
            phone,
            location,
            region,
        })
        .where(eq(clients.id, id));

    revalidatePath('/clients');
    revalidatePath('/');
}

// --- Warranties ---

export async function registerWarranty(formData: FormData) {
    const serialNumber = formData.get('serialNumber') as string;
    const customerName = formData.get('customerName') as string;
    const dealerId = parseInt(formData.get('dealerId') as string);
    const notes = formData.get('notes') as string;

    // Simple validation
    if (!serialNumber || !customerName || !dealerId) {
        // In a real app we'd return errors, but for now we'll just throw or ignore
        return;
    }

    // Find product by serial prefix (Smart Mock logic)
    // In a real app, this would query a manufacturing database.
    // Here we deterministically map the serial number to a product in our catalog
    // so different serials get different products, staying consistent.
    const allProducts = await db.select({ id: products.id, category: products.category }).from(products);

    let productId = allProducts[0]?.id || 1;

    // Simple hash of the serial number
    const serialSum = serialNumber.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

    if (serialNumber.toUpperCase().startsWith('ES-')) {
        // Assume it's a Boat Hull ID (HIN)
        const boats = allProducts.filter(p => p.category === 'Boat');
        if (boats.length > 0) {
            productId = boats[serialSum % boats.length].id;
        }
    } else {
        // Assume it's an Engine
        const engines = allProducts.filter(p => p.category === 'Engine');
        if (engines.length > 0) {
            productId = engines[serialSum % engines.length].id;
        }
    }

    await db.insert(warranties).values({
        serialNumber,
        customerName: customerName, // Schema mismatch in naming, correcting mapping 
        dealerId,
        productId,
        registrationDate: new Date().toISOString().split('T')[0],
        status: 'Pending',
        claimType: 'Registration',
        notes: notes
    });

    revalidatePath('/warranties');
    revalidatePath('/');
}

export async function deleteWarranty(formData: FormData) {
    const id = parseInt(formData.get('id') as string);
    if (!id) return;

    await db.delete(warranties).where(eq(warranties.id, id));
    revalidatePath('/warranties');
    revalidatePath('/');
}

export async function updateWarranty(formData: FormData) {
    const id = parseInt(formData.get('id') as string);
    const status = formData.get('status') as string;
    const type = formData.get('type') as string;

    if (!id) return;

    await db.update(warranties)
        .set({
            status,
            claimType: type
        })
        .where(eq(warranties.id, id));

    revalidatePath('/warranties');
    revalidatePath('/');
}

// --- Technicians ---

export async function addTechnician(formData: FormData) {
    const name = formData.get('name') as string;
    const dealerId = parseInt(formData.get('dealerId') as string);
    const certifications = formData.get('certifications') as string; // Comma separated

    if (!name || !dealerId) return;

    const certList = certifications ? certifications.split(',').map(c => c.trim()) : ['Standard'];

    await db.insert(technicians).values({
        name,
        dealerId,
        certifications: JSON.stringify(certList),
        status: 'Active'
    });

    revalidatePath('/technicians');
    revalidatePath('/');
}

export async function deleteTechnician(formData: FormData) {
    const id = parseInt(formData.get('id') as string);
    if (!id) return;

    await db.delete(technicians).where(eq(technicians.id, id));
    revalidatePath('/technicians');
    revalidatePath('/');
}

export async function updateTechnician(formData: FormData) {
    const id = parseInt(formData.get('id') as string);
    const name = formData.get('name') as string;
    const dealerId = parseInt(formData.get('dealerId') as string);
    const certifications = formData.get('certifications') as string;
    const status = formData.get('status') as string;

    if (!id || !name || !dealerId) {
        throw new Error('ID, Name and Dealer are required');
    }

    const certList = certifications ? certifications.split(',').map(c => c.trim()) : [];

    await db.update(technicians)
        .set({
            name,
            dealerId,
            certifications: JSON.stringify(certList),
            status: status as 'Active' | 'Inactive'
        })
        .where(eq(technicians.id, id));

    revalidatePath('/technicians');
    revalidatePath('/');
}

// --- Campaigns ---

export async function addCampaign(formData: FormData) {
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const priority = formData.get('priority') as string;
    const affectedProducts = formData.get('affectedProducts') as string;
    const file = formData.get('bulletinFile') as File;

    if (!title || !description) return;

    let bulletinUrl = null;

    if (file && file.size > 0) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const fileName = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
        const uploadDir = path.join(process.cwd(), 'public', 'bulletins');

        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const filePath = path.join(uploadDir, fileName);
        fs.writeFileSync(filePath, buffer);
        bulletinUrl = `/bulletins/${fileName}`;
    }

    await db.insert(campaigns).values({
        title,
        description,
        priority: priority as any,
        affectedProducts,
        releaseDate: new Date().toISOString().split('T')[0],
        bulletinUrl
    });

    revalidatePath('/campaigns');
    revalidatePath('/');
}

export async function updateCampaign(formData: FormData) {
    const id = parseInt(formData.get('id') as string);
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const priority = formData.get('priority') as string;
    const affectedProducts = formData.get('affectedProducts') as string;
    const file = formData.get('bulletinFile') as File;

    if (!id || !title || !description) return;

    const current = await db.query.campaigns.findFirst({
        where: eq(campaigns.id, id)
    });

    let bulletinUrl = current?.bulletinUrl;

    if (file && file.size > 0) {
        // Delete old file if exists
        if (bulletinUrl && bulletinUrl.startsWith('/bulletins/')) {
            const oldPath = path.join(process.cwd(), 'public', bulletinUrl);
            if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const fileName = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
        const filePath = path.join(process.cwd(), 'public', 'bulletins', fileName);

        fs.writeFileSync(filePath, buffer);
        bulletinUrl = `/bulletins/${fileName}`;
    }

    await db.update(campaigns)
        .set({
            title,
            description,
            priority: priority as any,
            affectedProducts,
            bulletinUrl
        })
        .where(eq(campaigns.id, id));

    revalidatePath('/campaigns');
    revalidatePath('/');
}

export async function deleteCampaign(formData: FormData) {
    const id = parseInt(formData.get('id') as string);
    if (!id) return;

    const current = await db.query.campaigns.findFirst({
        where: eq(campaigns.id, id)
    });

    // Delete associated file
    if (current?.bulletinUrl && current.bulletinUrl.startsWith('/bulletins/')) {
        const filePath = path.join(process.cwd(), 'public', current.bulletinUrl);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await db.delete(campaigns).where(eq(campaigns.id, id));
    revalidatePath('/campaigns');
    revalidatePath('/');
}

// --- Resources ---

export async function addResource(formData: FormData) {
    const title = formData.get('title') as string;
    const type = formData.get('type') as string;
    const category = formData.get('category') as string;
    const file = formData.get('url') as File;

    if (!title || !type || !file) return;

    let url = '';
    if (file && file.size > 0) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const fileName = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
        const uploadDir = path.join(process.cwd(), 'public', 'resources');

        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const filePath = path.join(uploadDir, fileName);
        fs.writeFileSync(filePath, buffer);
        url = `/resources/${fileName}`;
    }

    await db.insert(resources).values({
        title,
        type,
        category,
        url
    });

    revalidatePath('/resources');
    revalidatePath('/');
}

export async function updateResource(formData: FormData) {
    const id = parseInt(formData.get('id') as string);
    const title = formData.get('title') as string;
    const type = formData.get('type') as string;
    const category = formData.get('category') as string;
    const file = formData.get('url') as File;

    if (!id || !title || !type) return;

    const current = await db.query.resources.findFirst({
        where: eq(resources.id, id)
    });

    let url = current?.url || '';

    if (file && file.size > 0) {
        // Delete old file if exists
        if (url && url.startsWith('/resources/')) {
            const oldPath = path.join(process.cwd(), 'public', url);
            if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const fileName = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
        const filePath = path.join(process.cwd(), 'public', 'resources', fileName);

        if (!fs.existsSync(path.join(process.cwd(), 'public', 'resources'))) {
            fs.mkdirSync(path.join(process.cwd(), 'public', 'resources'), { recursive: true });
        }

        fs.writeFileSync(filePath, buffer);
        url = `/resources/${fileName}`;
    }

    await db.update(resources)
        .set({
            title,
            type,
            category,
            url
        })
        .where(eq(resources.id, id));

    revalidatePath('/resources');
    revalidatePath('/');
}

export async function deleteResource(formData: FormData) {
    const id = parseInt(formData.get('id') as string);
    if (!id) return;

    const current = await db.query.resources.findFirst({
        where: eq(resources.id, id)
    });

    // Delete associated file
    if (current?.url && current.url.startsWith('/resources/')) {
        const filePath = path.join(process.cwd(), 'public', current.url);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await db.delete(resources).where(eq(resources.id, id));
    revalidatePath('/resources');
    revalidatePath('/');
}

// --- Products (Integrated PIM) ---

export async function createProduct(formData: FormData) {
    const name = formData.get('name') as string;
    const brand = formData.get('brand') as string;
    const category = formData.get('category') as string;
    const series = formData.get('series') as string;
    const description = formData.get('description') as string;
    const price = parseFloat(formData.get('price') as string) || 0;
    const specsRaw = formData.get('specs') as string;

    let specs = '{}';
    try {
        specs = JSON.stringify(JSON.parse(specsRaw));
    } catch {
        specs = '{}';
    }

    await db.insert(products).values({
        name,
        brand,
        category,
        series: series || null,
        description: description || null,
        price,
        specs,
        stock: 0,
        serialPrefix: brand === 'Mercury' ? '2B' : '',
        warrantyYears: 2
    });

    revalidatePath('/products');
    revalidatePath('/');
    redirect('/products');
}

export async function importProductsBatch(productsData: any[]) {
    if (!productsData || productsData.length === 0) return;

    try {
        const formattedProducts = productsData.map(p => ({
            name: p.name || 'Sin nombre',
            brand: p.brand || 'Otro',
            category: p.category || 'Accessory',
            series: p.series || null,
            description: p.description || null,
            price: p.price || 0,
            specs: p.specs || '{}',
            image: null,
            stock: 0,
            serialPrefix: p.brand === 'Mercury' ? '2B' : '',
            warrantyYears: 2
        }));

        await db.insert(products).values(formattedProducts);

        revalidatePath('/products');
        revalidatePath('/');
        return { success: true, count: formattedProducts.length };
    } catch (error) {
        console.error('Error in batch import:', error);
        throw new Error('No se pudieron importar los productos. Revisa el formato.');
    }
}

export async function updateProduct(id: number, formData: FormData) {
    const name = formData.get('name') as string;
    const brand = formData.get('brand') as string;
    const category = formData.get('category') as string;
    const series = formData.get('series') as string;
    const description = formData.get('description') as string;
    const price = parseFloat(formData.get('price') as string) || 0;
    const specsRaw = formData.get('specs') as string;

    const imageUrl = formData.get('imageUrl') as string;
    const imageFile = formData.get('imageFile') as File;

    let imagePath = imageUrl;

    if (imageFile && imageFile.size > 0) {
        try {
            const bytes = await imageFile.arrayBuffer();
            const buffer = Buffer.from(bytes);

            const uploadDir = path.join(process.cwd(), 'public', 'uploads');
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            const filename = `${Date.now()}-${imageFile.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
            const filepath = path.join(uploadDir, filename);

            console.log(`Saving image to: ${filepath}`);
            fs.writeFileSync(filepath, buffer);
            imagePath = `/uploads/${filename}`;
        } catch (error) {
            console.error('CRITICAL: Error saving product image:', error);
            throw new Error('No se pudo guardar la imagen en el servidor. Por favor, contacte con soporte.');
        }
    }

    let specs = '{}';
    try {
        specs = JSON.stringify(JSON.parse(specsRaw));
    } catch {
        specs = '{}';
    }

    const updateData: any = {
        name,
        brand,
        category,
        series: series || null,
        description: description || null,
        price,
        specs,
    };

    if (imagePath) {
        updateData.image = imagePath;
    }

    await db.update(products).set(updateData).where(eq(products.id, id));

    revalidatePath('/products');
    revalidatePath(`/products/${id}`);
    revalidatePath('/');
    redirect(`/products/${id}`);
}

export async function deleteProduct(id: number) {
    await db.delete(products).where(eq(products.id, id));
    revalidatePath('/products');
    revalidatePath('/');
    redirect('/products');
}

// --- Settings ---

export async function updateSettings(formData: FormData) {
    const keys = Array.from(formData.keys()).filter(k => !k.startsWith('$') && k !== 'action');

    for (const key of keys) {
        const value = formData.get(key) as string;
        await db.update(settings)
            .set({ value, updatedAt: sql`CURRENT_TIMESTAMP` })
            .where(eq(settings.key, key));
    }

    revalidatePath('/settings');
    revalidatePath('/');
}

// --- Auth ---

export async function login(formData: FormData) {
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    const user = await db.select().from(users).where(and(eq(users.username, username), eq(users.password, password))).get();

    if (user) {
        const cookieStore = await cookies();
        cookieStore.set('session', 'true', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24, // 1 day
            path: '/'
        });
        cookieStore.set('username', user.username, {
            httpOnly: false, // Permitir leerlo si fuera necesario, o false
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24,
            path: '/'
        });
        redirect('/products');
    } else {
        redirect('/login?error=Invalid credentials');
    }
}

export async function logout() {
    const cookieStore = await cookies();
    cookieStore.delete('session');
    cookieStore.delete('username');
    redirect('/products');
}

