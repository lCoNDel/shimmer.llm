
import { db } from './db';
import { campaigns } from './schema';

async function main() {
    const all = await db.select().from(campaigns).limit(1);
    console.log(JSON.stringify(all, null, 2));
}

main();
