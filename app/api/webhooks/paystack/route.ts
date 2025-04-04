import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import type { OrderStatus } from '@/app/api/types'; // Import your internal OrderStatus type

// --- Environment Variable Check ---
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;

if (!supabaseUrl || !supabaseServiceKey || !paystackSecretKey) {
    console.error("CRITICAL: Missing Supabase/Paystack environment variables for webhook.");
    // In production, you might want to throw an error or have better alerting
}

// --- Supabase Admin Client ---
// Use service key for elevated privileges needed to update orders
const supabaseAdmin = createClient(supabaseUrl!, supabaseServiceKey!);

// --- Nodemailer Setup (from your original code) ---
const getBranchTransporter = (branchEmail: string, appPassword?: string) => {
    if (!branchEmail || !appPassword) {
        console.error(`Missing email credentials for branch: ${branchEmail}`);
        return null; // Handle missing credentials gracefully
    }
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
        user: branchEmail,
        pass: appPassword, // Use the Google App Password
        },
    });
};

// --- Webhook Handler ---
export async function POST(req: Request) {
  console.log('Paystack webhook received...');

  if (!paystackSecretKey) {
    console.error('PAYSTACK_SECRET_KEY environment variable is not set.');
    return NextResponse.json({ error: 'Webhook configuration error' }, { status: 500 });
  }

  try {
    const signature = req.headers.get('x-paystack-signature');
    const payload = await req.text();

    // 1. Verify Signature
    const hash = crypto
      .createHmac('sha512', paystackSecretKey)
      .update(payload)
      .digest('hex');

    if (hash !== signature) {
      console.warn('Invalid Paystack webhook signature.');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }
    console.log('Paystack signature verified.');

    // 2. Parse Payload
    const event = JSON.parse(payload);
    console.log(`Processing Paystack event: ${event.event}`);

    const eventData = event.data;
    const paystackStatus = eventData?.status; // e.g., 'success', 'failed'
    const paymentReference = eventData?.reference || null;
    const orderId = eventData?.metadata?.orderId || null; // Assumes orderId is in metadata

    if (!orderId) {
        // Potentially try extracting from reference as a fallback, but log clearly
        console.warn("Order ID not found in webhook metadata. Reference:", paymentReference);
        // You could add logic here to extract from reference if needed, but it's less reliable
        // For now, we'll stop if metadata.orderId is missing.
         return NextResponse.json({ received: true, message: "Webhook processed (no orderId in metadata)." });
    }

    console.log(`Order ID: ${orderId}, Paystack Status: ${paystackStatus}, Reference: ${paymentReference}`);

    // 3. Map Paystack Status to Your Internal OrderStatus
    let newDbStatus: OrderStatus | null = null;
    switch (event.event) {
      case 'charge.success':
        // Assuming 'success' means the order is confirmed and ready for processing
        newDbStatus = 'confirmed';
        break;
      case 'charge.failed':
         // Or potentially 'pending' if you want user to retry?
         newDbStatus = 'cancelled';
         break;
      // Add other cases like 'transfer.success' if relevant
      default:
        console.log(`No specific action defined for event: ${event.event}`);
        break;
    }

    // 4. Update Database (if status mapping occurred)
    let updatedOrderData: any = null; // To store data for email sending

    if (newDbStatus) {
      console.log(`Attempting to update Order ${orderId} status to '${newDbStatus}' with reference '${paymentReference}'`);

      const updatePayload: { status: OrderStatus; payment_reference?: string | null } = {
          status: newDbStatus,
          payment_reference: paymentReference // Store the reference
      };

      const { data: updatedOrder, error: updateError } = await supabaseAdmin
        .from('orders')
        .update(updatePayload)
        .eq('id', orderId)
        .select(`
            *,
            branch:branches!inner(id, name, email),
            user:users(email),
            items:order_items(
              quantity,
              unit_price,
              menu_item:menu_items(name)
            )
        `) // Fetch data needed for email AFTER update
        .single(); // Ensures we get the updated row back

      if (updateError) {
        console.error(`Error updating Order ${orderId} in Supabase:`, updateError);
        // Log the error but still return 200 OK to Paystack unless it's critical
        // return NextResponse.json({ error: 'Failed to update order status' }, { status: 500 });
      } else if (updatedOrder) {
        console.log(`Successfully updated Order ${orderId} status to ${newDbStatus}.`);
        updatedOrderData = updatedOrder; // Save data for email
      } else {
         console.warn(`Order ${orderId} not found during update attempt.`);
         // Order might have been deleted, but webhook is still acknowledged
      }
    }

    // 5. Send Emails (if update was successful and data was fetched)
    if (updatedOrderData && newDbStatus === 'confirmed') { // Only send confirmation on success? Adjust as needed.
        const branchId = updatedOrderData.branch?.id; // Use optional chaining
        const branchEmail = process.env[`BRANCH${branchId}_EMAIL`]; // Construct env var name dynamically (careful!) - Consider storing email directly in branches table instead.
        const appPassword = process.env[`BRANCH${branchId}_APP_PASSWORD`];

        // Basic check for required email data
        if (updatedOrderData.user?.email && updatedOrderData.branch?.email && branchEmail && appPassword) {
            const transporter = getBranchTransporter(branchEmail, appPassword);
            if (transporter) {
                console.log(`Sending confirmation emails for Order ${orderId}...`);
                try {
                    // Use the Paystack status ('success') for the email subject/body for clarity? Or the internal one? Using internal for now.
                    await sendOrderEmails(transporter, updatedOrderData, newDbStatus);
                    console.log(`Confirmation emails sent for Order ${orderId}.`);
                } catch (emailError) {
                    console.error(`Failed to send emails for Order ${orderId}:`, emailError);
                    // Log email error but don't fail the webhook response
                }
            } else {
                 console.error(`Could not create transporter for branch ${branchId}. Check email env vars.`);
            }
        } else {
            console.warn(`Missing data required for sending emails for Order ${orderId}. User Email: ${!!updatedOrderData.user?.email}, Branch Email Env: ${!!branchEmail}, App Password Env: ${!!appPassword}`);
        }
    }

    // 6. Acknowledge Receipt to Paystack
    console.log(`Webhook processing finished for event ${event.event}, Order ID: ${orderId || 'N/A'}.`);
    return NextResponse.json({ received: true });

  } catch (error: any) {
    console.error('Critical error processing Paystack webhook:', error);
    // Return 500 for unexpected errors
    return NextResponse.json({ error: 'Webhook handler failed', details: error.message }, { status: 500 });
  }
}

// --- Email Sending Logic (from your original code) ---
async function sendOrderEmails(transporter: any, order: any, status: OrderStatus) {
  const emailTemplate = generateEmailTemplate(order, status);
  const branchInfo = order.branch; // Already selected in the update query
  const userInfo = order.user; // Already selected

  if (!userInfo?.email || !branchInfo?.email) {
      console.error("Missing user or branch email in order data for email sending.");
      return;
  }

  // Send to customer
  console.log(`Sending email to customer: ${userInfo.email}`);
  await transporter.sendMail({
    from: `"${branchInfo.name}" <${branchInfo.email}>`, // Use branch name and email
    to: userInfo.email,
    subject: `Your Order ${order.id} is ${status.toUpperCase()}`, // Use internal status
    html: emailTemplate,
  });

  // Send to branch
  console.log(`Sending email to branch: ${branchInfo.email}`);
  await transporter.sendMail({
    from: `"${branchInfo.name} (System)" <${branchInfo.email}>`, // Indicate it's a system notification
    to: branchInfo.email, // Send to the branch's actual email
    subject: `New/Updated Order ${order.id} - Status: ${status.toUpperCase()}`, // Use internal status
    html: emailTemplate,
  });
}

// --- Email Template Generation (from your original code - minor adjustment for potentially missing menu_item) ---
function generateEmailTemplate(order: any, status: string) {
  const items = order.items.map((item: any) => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.menu_item?.name ?? 'Item Unavailable'}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₦${(item.unit_price * item.quantity).toLocaleString()}</td>
    </tr>
  `).join('');

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #4CAF50; color: white; padding: 15px 20px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">Order ${status.toUpperCase()}</h1>
      </div>
      <div style="padding: 20px;">
        <p>Hello,</p>
        <p>Your order status has been updated to <strong>${status.toUpperCase()}</strong>.</p>
        <div style="background: #f8f8f8; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #333; font-size: 18px; margin-top: 0; margin-bottom: 10px;">Order Details</h2>
          <p style="margin: 5px 0;"><strong>Order ID:</strong> ${order.id}</p>
          <p style="margin: 5px 0;"><strong>Branch:</strong> ${order.branch?.name ?? 'N/A'}</p>
          <p style="margin: 5px 0;"><strong>Order Type:</strong> ${order.order_type}</p>
          ${order.delivery_address ? `<p style="margin: 5px 0;"><strong>Delivery Address:</strong> ${order.delivery_address}</p>` : ''}
          ${order.special_instructions ? `<p style="margin: 5px 0;"><strong>Special Instructions:</strong> ${order.special_instructions}</p>` : ''}
        </div>

        <h3 style="color: #333; font-size: 16px; border-bottom: 1px solid #eee; padding-bottom: 5px; margin-bottom: 10px;">Items Ordered</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <thead>
            <tr style="background: #eee;">
              <th style="padding: 10px; text-align: left; font-size: 14px;">Item</th>
              <th style="padding: 10px; text-align: center; font-size: 14px;">Quantity</th>
              <th style="padding: 10px; text-align: right; font-size: 14px;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${items}
          </tbody>
          <tfoot>
            ${order.delivery_fee && order.delivery_fee > 0 ? `
            <tr>
                <td colspan="2" style="padding: 10px; border-top: 1px solid #eee; text-align: right;">Delivery Fee:</td>
                <td style="padding: 10px; border-top: 1px solid #eee; text-align: right;">₦${order.delivery_fee.toLocaleString()}</td>
            </tr>
            ` : ''}
            <tr style="font-weight: bold;">
              <td colspan="2" style="padding: 10px; border-top: 2px solid #333; text-align: right;">Total:</td>
              <td style="padding: 10px; border-top: 2px solid #333; text-align: right; font-size: 18px;">₦${order.total_amount.toLocaleString()}</td>
            </tr>
          </tfoot>
        </table>
        <p style="text-align: center; font-size: 12px; color: #888;">Thank you for your order!</p>
      </div>
    </div>
  `;
} 