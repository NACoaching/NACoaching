import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
    try {
        const { name, email, subject, message, phone } = await req.json();

        // Basic validation
        if (!name || !email || !message) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Save message to database (using admin client to bypass RLS)
        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            process.env.SUPABASE_SERVICE_ROLE_KEY
        );

        const { error: dbError } = await supabaseAdmin.from('messages').insert([{
            name, email, phone, subject, message
        }]);

        if (dbError) {
            console.error('Error saving message:', dbError);
            // Don't fail the whole request, still try to send the email
        }

        // Send email notification
        const data = await resend.emails.send({
            from: 'NA Coaching <contact@na-coaching.com>',
            to: ['contact.nacoaching@gmail.com'],
            subject: `Nouveau Message: ${subject} de ${name}`,
            html: `
        <h1>Nouveau message du site NA Coaching</h1>
        <p><strong>De:</strong> ${name} (${email})</p>
        <p><strong>Téléphone:</strong> ${phone || 'Non renseigné'}</p>
        <p><strong>Sujet:</strong> ${subject}</p>
        <hr />
        <h2>Message:</h2>
        <p style="white-space: pre-wrap;">${message}</p>
      `,
            reply_to: email,
        });

        return NextResponse.json(data);
    } catch (error) {
        console.error('Send Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
