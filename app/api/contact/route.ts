import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
    if (request.method === 'POST') {

        const { name, email, subject, message } = await request.json();

        // Create a transporter using SMTP
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD,
            },
        });

        try {
            // Send email
            await transporter.sendMail({
                from: email,
                to: process.env.CONTACT_EMAIL,
                subject: 'New Contact Form Submission',
                text: message,
                html: `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
            });

            return NextResponse.json({ message: 'Email sent successfully' }, { status: 200 });
        } catch {
            return NextResponse.json({ message: 'Error sending email' }, { status: 500 });
        }
    } else {
        return NextResponse.json({ message: `Method ${request.method} Not Allowed` }, { status: 405 });
    }
}