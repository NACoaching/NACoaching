
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req) {
    try {
        const body = await req.json();
        const { productId, rating, comment, name, email } = body;

        // Basic validation
        if (!productId || !rating || !name || !email) {
            return NextResponse.json({ error: 'Champs manquants' }, { status: 400 });
        }

        // Initialize Supabase Admin Client
        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            process.env.SUPABASE_SERVICE_ROLE_KEY
        );

        // 1. Verify Purchase in 'orders' table
        const { data: orders, error: orderError } = await supabaseAdmin
            .from('orders')
            .select('*')
            .eq('product_id', productId)
            .ilike('email', email) // Case-insensitive email check
            .limit(1);

        if (orderError) {
            console.error('Error verifying order:', orderError);
            return NextResponse.json({ error: 'Erreur de vérification' }, { status: 500 });
        }

        if (!orders || orders.length === 0) {
            return NextResponse.json({ error: 'Aucun achat trouvé avec cet email pour ce produit.' }, { status: 403 });
        }

        // 2. Check if user already reviewed this product? (Optional, maybe later)

        // 3. Insert Review
        // We use admin client because we might lock down the 'reviews' table later.
        // For now, even if 'reviews' is public insert, using admin here is fine.
        const { error: reviewError } = await supabaseAdmin
            .from('reviews')
            .insert([
                {
                    product_id: productId,
                    rating,
                    comment,
                    author_name: name,
                    // We could store email in reviews if we schema supported it, but it's not in the original plan/schema for display.
                    // We can keep it private or just use it for verification.
                    // If we want to store it, we need to alter 'reviews' table.
                    // For now, we just use it for verification.
                }
            ]);

        if (reviewError) {
            console.error('Error inserting review:', reviewError);
            return NextResponse.json({ error: "Erreur lors de l'enregistrement de l'avis." }, { status: 500 });
        }

        return NextResponse.json({ success: true });

    } catch (err) {
        console.error('API Error:', err);
        return NextResponse.json({ error: 'Erreur Serveur' }, { status: 500 });
    }
}
