const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
// const fetch = require('node-fetch'); // Native fetch available in Node 18+
// const fetch = require('node-fetch'); // Native fetch available in Node 18+

// Load env vars
dotenv.config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SITE_URL = 'http://localhost:3000'; // Assuming local dev server is running

async function testWebhookSecurity() {
    console.log('🛡️  TEST 1: Webhook Signature Verification');
    try {
        const res = await fetch(`${SITE_URL}/api/webhook`, {
            method: 'POST',
            body: JSON.stringify({ type: 'checkout.session.completed' }),
            headers: {
                'Content-Type': 'application/json',
                'stripe-signature': 'fake_signature_123'
            }
        });

        if (res.status === 400) {
            console.log('✅ PASS: Webhook correctly rejected fake signature (400 Bad Request)');
        } else {
            console.log(`❌ FAIL: Webhook returned status ${res.status} instead of 400`);
        }
    } catch (e) {
        console.log('⚠️  Could not reach webhook endpoint (Is server running?)');
    }
    console.log('---------------------------------------------------');
}

async function testStorageSecurity() {
    console.log('🛡️  TEST 2: Secure Storage Access (Public/Anon)');
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    try {
        // Try to list files in the private bucket as an anonymous user
        const { data, error } = await supabase
            .storage
            .from('secure_products')
            .list();

        if (error || data.length === 0) {
            // Exact behavior depends on RLS, but usually it either returns error or empty list for anon
            console.log('✅ PASS: Anonymous user cannot list files in "secure_products"');
            if (error) console.log(`   (Supabase Error: ${error.message})`);
        } else {
            console.log('❌ FAIL: Anonymous user COULD list files:', data);
        }

        // Try to upload a file as anon
        const { error: uploadError } = await supabase
            .storage
            .from('secure_products')
            .upload('hack.txt', Buffer.from('hacked'));

        if (uploadError) {
            console.log('✅ PASS: Anonymous user cannot upload to "secure_products"');
            console.log(`   (Supabase Error: ${uploadError.message})`);
        } else {
            console.log('❌ FAIL: Anonymous user COULD upload a file!');
        }

    } catch (e) {
        console.error('Test error:', e);
    }
    console.log('---------------------------------------------------');
}

async function runTests() {
    console.log('🔒 STARTING SECURITY AUDIT...\n');
    await testWebhookSecurity();
    await testStorageSecurity();
    console.log('\nAudit Complete.');
}

runTests();
