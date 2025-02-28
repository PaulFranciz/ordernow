import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { rateLimit } from '@/lib/rate-limit';

const resend = new Resend(process.env.RESEND_API_KEY);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    // Rate limiting
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    const { success } = await rateLimit(ip);
    if (!success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const { email, isSignUp } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    // Store OTP in Supabase with expiration
    const { error: storeError } = await supabase
      .from('otps')
      .insert([
        {
          email,
          otp,
          expires_at: expiresAt,
          used: false
        }
      ]);

    if (storeError) {
      console.error('Error storing OTP:', storeError);
      return NextResponse.json(
        { error: 'Failed to generate OTP' },
        { status: 500 }
      );
    }

    // Send OTP via email
    const { error: emailError } = await resend.emails.send({
      from: 'OrderNow <noreply@ordernow.com>',
      to: email,
      subject: `Your verification code for ${isSignUp ? 'signing up' : 'signing in'}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1a1a1a; margin-bottom: 24px;">Verification Code</h2>
          <p style="color: #4b5563; margin-bottom: 24px;">
            Your verification code is:
          </p>
          <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; text-align: center; margin-bottom: 24px;">
            <span style="font-size: 32px; letter-spacing: 8px; font-weight: bold; color: #1a1a1a;">
              ${otp}
            </span>
          </div>
          <p style="color: #4b5563; margin-bottom: 24px;">
            This code will expire in 10 minutes.
          </p>
          <p style="color: #6b7280; font-size: 14px;">
            If you didn't request this code, you can safely ignore this email.
          </p>
        </div>
      `
    });

    if (emailError) {
      console.error('Error sending email:', emailError);
      return NextResponse.json(
        { error: 'Failed to send verification code' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in send-otp:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 