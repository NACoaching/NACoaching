
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';
import { Resend } from 'resend';

const stripe = process.env.STRIPE_SECRET_KEY
    ? new Stripe(process.env.STRIPE_SECRET_KEY)
    : null;
const resend = process.env.RESEND_API_KEY
    ? new Resend(process.env.RESEND_API_KEY)
    : null;

export async function POST(req) {
    const body = await req.text();
    const sig = req.headers.get('stripe-signature');

    let event;

    try {
        event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.error(`Webhook signature verification failed.`, err.message);
        return NextResponse.json({ error: 'Webhook Error' }, { status: 400 });
    }

    // Handle the event
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;

        // Fulfill the purchase...
        const customerEmail = session.customer_details.email;
        const productId = session.metadata.productId;

        console.log(`Processing payment for product ${productId} by ${customerEmail}`);

        try {
            // 1. Get Product Details (File Path)
            const { data: product, error: productError } = await supabase
                .from('products')
                .select('title, file_path')
                .eq('id', productId)
                .single();

            if (productError || !product || !product.file_path) {
                console.error('Product not found or no file path associated:', productId);
                // We might want to alert admin via email here too
                return NextResponse.json({ error: 'Product Error' }, { status: 500 });
            }

            // 2. Generate Signed URL (Valid for 24h)
            const { data: signedUrlData, error: signError } = await supabase
                .storage
                .from('secure_products')
                .createSignedUrl(product.file_path, 60 * 60 * 24); // 24 hours

            if (signError || !signedUrlData) {
                console.error('Error generating signed URL:', signError);
                return NextResponse.json({ error: 'Storage Error' }, { status: 500 });
            }

            const downloadLink = signedUrlData.signedUrl;

            // 3. Send Email via Resend
            const { data: emailData, error: emailError } = await resend.emails.send({
                from: 'NA Coaching <contact@na-coaching.com>', // Ensure domain is verified in Resend
                to: [customerEmail],
                subject: `Votre téléchargement : ${product.title}`,
                html: `
          <h1>Merci pour votre achat !</h1>
          <p>Voici votre lien de téléchargement pour <strong>${product.title}</strong>.</p>
          <p>Ce lien est valide pendant 24 heures.</p>
          <a href="${downloadLink}" style="background-color: #FF6B00; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Télécharger mon programme</a>
          <p>Si le bouton ne fonctionne pas, copiez ce lien : ${downloadLink}</p>
          <p>Bon entraînement !<br/>L'équipe NA Coaching</p>
        `,
            });

            if (emailError) {
                console.error('Error sending email:', emailError);
                return NextResponse.json({ error: 'Email Error' }, { status: 500 });
            }

            console.log('Email sent successfully:', emailData);

            // 4. Record Order in Supabase
            // We use the service_role key if available to bypass RLS, but here we are in an API route
            // which usually uses a service role client if configured, but 'supabase' imported from @/lib/supabaseClient
            // is likely using the ANON key. 
            // However, we just enabled RLS on 'orders' without policies, so ANON key CANNOT insert.
            // We need to use a Service Role client here.

            const supabaseAdmin = createClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL,
                process.env.SUPABASE_SERVICE_ROLE_KEY
            );

            const { error: orderError } = await supabaseAdmin
                .from('orders')
                .insert([
                    {
                        email: customerEmail,
                        product_id: productId,
                        stripe_session_id: session.id,
                        amount_total: session.amount_total
                    }
                ]);

            if (orderError) {
                console.error('Error saving order:', orderError);
                // Don't fail the webhook response, just log it.
            } else {
                console.log('Order saved successfully');
            }

        } catch (err) {
            console.error('Error during fulfillment:', err);
            return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
        }
    }

    return NextResponse.json({ received: true });
}
