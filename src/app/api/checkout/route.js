import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import Stripe from 'stripe';

const stripe = process.env.STRIPE_SECRET_KEY
    ? new Stripe(process.env.STRIPE_SECRET_KEY)
    : null;


export async function POST(request) {
    try {
        const { productId } = await request.json();

        // 1. Fetch product details from Supabase
        const { data: product } = await supabase
            .from('products')
            .select('*')
            .eq('id', productId)
            .single();

        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        // 2. Validate Price
        // Ensure price is a number. Attempt to parse "XX€" or similar if needed, 
        // but ultimately we should probably store a clean numeric price or price_id.
        // For now, let's assume we extract numbers from the string if it's not a direct number.
        // Replace comma with dot for decimal parsing, then remove other non-numeric chars except dot
        const cleanPrice = product.price.replace(',', '.').replace(/[^0-9.]/g, '');
        let numericPrice = parseFloat(cleanPrice);

        if (isNaN(numericPrice)) {
            // Fallback or error if price isn't parseable. 
            // Ideally, the admin should ensure this, or we rely on a stored stripe_price_id.
            return NextResponse.json({ error: 'Invalid price format' }, { status: 400 });
        }

        // 3. Create Stripe Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'eur',
                        product_data: {
                            name: product.title,
                            description: product.description,
                            images: product.image ? [product.image] : [],
                        },
                        unit_amount: Math.round(numericPrice * 100), // Amount in cents
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            customer_creation: 'always', // Forces Stripe to create a customer (requires email)
            success_url: `${request.headers.get('origin')}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${request.headers.get('origin')}/boutique/${product.id}`,
            metadata: {
                productId: product.id,
                productTitle: product.title,
            },
        });

        return NextResponse.json({ url: session.url });
    } catch (err) {
        console.error('Stripe Checkout Error:', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
