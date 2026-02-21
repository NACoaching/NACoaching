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
        // Priority: discount_price > price
        const priceToUse = (product.discount_price && product.discount_price.trim() !== '')
            ? product.discount_price
            : product.price;

        const cleanPrice = String(priceToUse).replace(',', '.').replace(/[^0-9.]/g, '');
        let numericPrice = parseFloat(cleanPrice);

        if (isNaN(numericPrice)) {
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
