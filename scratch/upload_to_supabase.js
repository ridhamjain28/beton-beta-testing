const fs = require('fs');
const path = require('path');

const SUPABASE_URL = 'https://kageeyipltwnsuuhkwfm.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_wz3DY0kXG8zhRRYsSfix6A_KcUFhAR8';

async function main() {
    console.log('Using native fetch to connect to Supabase...');

    // 1. Fetch current documents
    const docRes = await fetch(`${SUPABASE_URL}/rest/v1/documents?select=*`, {
        headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        }
    });
    const existingDocs = await docRes.json();
    console.log('Current DB documents:', existingDocs);

    const filesToUpload = [
        {
            filePath: path.join(__dirname, '../src/assets/docs/beton-price-list.pdf'),
            storagePath: 'documents/beton-price-list.pdf',
            title: 'BETON Price List',
            category: 'Price List'
        },
        {
            filePath: path.join(__dirname, '../src/assets/docs/BETON_Catalogue.pdf'),
            storagePath: 'documents/BETON_Catalogue.pdf',
            title: 'BETON Product Catalogue',
            category: 'Catalogue'
        }
    ];

    for (const item of filesToUpload) {
        if (!fs.existsSync(item.filePath)) {
            console.error('File not found:', item.filePath);
            continue;
        }

        const fileBuffer = fs.readFileSync(item.filePath);
        console.log(`Uploading ${item.title} (${fileBuffer.length} bytes)...`);

        // Upload to storage bucket: product-images
        const uploadUrl = `${SUPABASE_URL}/storage/v1/object/product-images/${item.storagePath}`;
        const upRes = await fetch(uploadUrl, {
            method: 'POST',
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/pdf',
                'x-upsert': 'true'
            },
            body: fileBuffer
        });

        const upText = await upRes.text();
        console.log(`Storage upload response (${upRes.status}):`, upText);

        const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/product-images/${item.storagePath}`;
        console.log(`Public URL: ${publicUrl}`);

        // Insert or update in documents table
        // Delete any existing doc with this title to avoid duplicates
        await fetch(`${SUPABASE_URL}/rest/v1/documents?title=eq.${encodeURIComponent(item.title)}`, {
            method: 'DELETE',
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
            }
        });

        // Insert fresh row
        const insRes = await fetch(`${SUPABASE_URL}/rest/v1/documents`, {
            method: 'POST',
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify({
                title: item.title,
                category: item.category,
                file_url: publicUrl,
                is_visible: true
            })
        });
        const insData = await insRes.json();
        console.log(`DB Insert result for ${item.title}:`, insData);
    }

    // Check final documents
    const finalRes = await fetch(`${SUPABASE_URL}/rest/v1/documents?select=*`, {
        headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        }
    });
    const finalDocs = await finalRes.json();
    console.log('\nFinal documents in Supabase database:');
    console.dir(finalDocs, { depth: null });
}

main().catch(console.error);
