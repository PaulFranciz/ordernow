import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Create nodemailer transporter
const getBranchTransporter = (branchEmail: string, appPassword: string) => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: branchEmail,
      pass: appPassword
    }
  });
};

export async function POST(req: Request) {
  try {
    console.log('Webhook request received');
    
    // Verify Paystack webhook signature
    const signature = req.headers.get('x-paystack-signature');
    const payload = await req.text();
    
    const hash = crypto
      .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY!)
      .update(payload)
      .digest('hex');
    
    if (hash !== signature) {
      console.error('Invalid webhook signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const event = JSON.parse(payload);
    console.log('Webhook event:', event.event);
    
    const { metadata, status, reference } = event.data;
    const orderId = metadata.orderId;
    console.log('Order ID:', orderId);
    console.log('Payment status:', status);

    // Update order status in Supabase
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .update({ payment_status: status, payment_reference: reference })
      .eq('id', orderId)
      .select(`
        *,
        branch:branches(id, name, email),
        user:users(email),
        items:order_items(
          quantity,
          unit_price,
          menu_item:menu_items(name)
        )
      `)
      .single();

    if (orderError) {
      console.error('Error updating order:', orderError);
      throw orderError;
    }

    console.log('Order updated successfully');

    // Get branch email configuration
    let branchEmail, appPassword;
    switch(order.branch.id) {
      case 'branch1':
        branchEmail = process.env.BRANCH1_EMAIL;
        appPassword = process.env.BRANCH1_APP_PASSWORD;
        break;
      case 'branch2':
        branchEmail = process.env.BRANCH2_EMAIL;
        appPassword = process.env.BRANCH2_APP_PASSWORD;
        break;
      case 'branch3':
        branchEmail = process.env.BRANCH3_EMAIL;
        appPassword = process.env.BRANCH3_APP_PASSWORD;
        break;
    }

    // Send emails
    console.log('Sending confirmation emails');
    const transporter = getBranchTransporter(branchEmail!, appPassword!);
    await sendOrderEmails(transporter, order, status);
    console.log('Confirmation emails sent');

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}

async function sendOrderEmails(transporter: any, order: any, status: string) {
  const emailTemplate = generateEmailTemplate(order, status);

  // Send to customer
  await transporter.sendMail({
    from: order.branch.email,
    to: order.user.email,
    subject: `Order ${order.id} - ${status.toUpperCase()}`,
    html: emailTemplate
  });

  // Send to branch
  await transporter.sendMail({
    from: order.branch.email,
    to: order.branch.email,
    subject: `New Order ${order.id} - ${status.toUpperCase()}`,
    html: emailTemplate
  });
}

function generateEmailTemplate(order: any, status: string) {
  const items = order.items.map((item: any) => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.menu_item.name}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₦${(item.unit_price * item.quantity).toLocaleString()}</td>
    </tr>
  `).join('');

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #333; text-align: center;">Order Confirmation - ${status.toUpperCase()}</h1>
      <div style="background: #f8f8f8; padding: 20px; border-radius: 8px;">
        <p><strong>Order ID:</strong> ${order.id}</p>
        <p><strong>Branch:</strong> ${order.branch.name}</p>
        <p><strong>Order Type:</strong> ${order.order_type}</p>
        
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <thead>
            <tr style="background: #eee;">
              <th style="padding: 10px; text-align: left;">Item</th>
              <th style="padding: 10px; text-align: center;">Quantity</th>
              <th style="padding: 10px; text-align: right;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${items}
          </tbody>
          <tfoot>
            <tr style="font-weight: bold;">
              <td colspan="2" style="padding: 10px; border-top: 2px solid #eee;">Total</td>
              <td style="padding: 10px; border-top: 2px solid #eee; text-align: right;">₦${order.total_amount.toLocaleString()}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  `;
} 