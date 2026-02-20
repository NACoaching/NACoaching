import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const resend = new Resend(process.env.RESEND_API_KEY);

// Sanitize user input to prevent HTML/XSS injection in emails
function escapeHtml(str) {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

export async function POST(req) {
    try {
        const { name, email, subject, message, phone } = await req.json();

        // Basic validation
        if (!name || !email || !message) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
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
        }

        // Sanitize all user inputs before injecting into HTML
        const safeName = escapeHtml(name);
        const safeEmail = escapeHtml(email);
        const safePhone = escapeHtml(phone);
        const safeSubject = escapeHtml(subject);
        const safeMessage = escapeHtml(message);

        // Send email notification
        const data = await resend.emails.send({
            from: 'NA Coaching <contact@na-coaching.com>',
            to: ['contact.nacoaching@gmail.com'],
            subject: `Nouveau Message: ${safeSubject} de ${safeName}`,
            html: `
        <h1>Nouveau message du site NA Coaching</h1>
        <p><strong>De:</strong> ${safeName} (${safeEmail})</p>
        <p><strong>Téléphone:</strong> ${safePhone || 'Non renseigné'}</p>
        <p><strong>Sujet:</strong> ${safeSubject}</p>
        <hr />
        <h2>Message:</h2>
        <p style="white-space: pre-wrap;">${safeMessage}</p>
      `,
            reply_to: email,
        });

        return NextResponse.json(data);
    } catch (error) {
        console.error('Send Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
