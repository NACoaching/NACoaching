import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
    try {
        const { name, email, subject, message, phone } = await req.json();

        // Basic validation
        if (!name || !email || !message) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const data = await resend.emails.send({
            from: 'NA Coaching <onboarding@resend.dev>', // Default Resend testing domain
            to: ['contact.nacoaching@gmail.com'], // Replace with your real email later
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
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
