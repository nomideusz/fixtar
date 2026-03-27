import 'dotenv/config';
import { createClient } from '@libsql/client';

const client = createClient({
	url: process.env.TURSO_DATABASE_URL || 'file:./dev.db',
	authToken: process.env.TURSO_AUTH_TOKEN || undefined
});

async function main() {
    const res = await client.execute('SELECT id, name, category_slug FROM products');
    
    let matched = 0;
    for (const row of res.rows) {
        const name = String(row.name).toLowerCase();
        const id = String(row.id);
        const cat = String(row.category_slug).toLowerCase();
        
        let image = '';
        
        if (name.includes('bavaria') && (name.includes('wiertark') || name.includes('wkrętark'))) {
            image = 'bavaria-cordless-drill-front.webp';
        } else if (name.includes('magnum') && name.includes('szlifierka')) {
            image = 'magnum-angle-grinder-front.webp';
        } else if (name.includes('graphite') && name.includes('wyrzynarka')) {
            image = 'graphite-jigsaw-side.webp';
        } else if (name.includes('eurotec') && (name.includes('młoto') || name.includes('młot '))) {
            image = 'eurotec-rotary-hammer-kit-open.webp';
        } else if (name.includes('eurotec') && (name.includes('pilarka') || name.includes('piła'))) {
            image = 'eurotec-circular-saw-front.webp';
        } else if (name.includes('eurotec') && (name.includes('klucz udarowy') || name.includes('klucz'))) {
            image = 'eurotec-impact-wrench-front.webp';
        }
        
        // Let's also do a general fallback if no image is mapped but we have one of the images
        if (!image) {
            if (cat.includes('szlifierk')) image = 'magnum-angle-grinder-front.webp';
            else if (cat.includes('wiertark')) image = 'bavaria-cordless-drill-front.webp';
            else if (cat.includes('piły') || cat.includes('pily')) image = 'eurotec-circular-saw-front.webp';
            else if (cat.includes('młot') || cat.includes('mlot')) image = 'eurotec-rotary-hammer-kit-flatlay.webp';
        }

        if (image) {
            await client.execute({
                sql: 'UPDATE products SET image = ? WHERE id = ?',
                args: [image, id]
            });
            matched++;
        }
    }
    
    console.log(`Updated images for ${matched} products.`);
}

main().catch(console.error);
