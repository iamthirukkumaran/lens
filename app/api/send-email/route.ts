import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { to, subject, orderStatus, orderDetails, userName } = body;

    if (!to || !subject) {
      return NextResponse.json(
        { success: false, error: 'Email and subject are required' },
        { status: 400 }
      );
    }

    // Generate HTML email content based on status
    const statusMessages: { [key: string]: string } = {
      'confirmed': 'Your order has been confirmed and will be processed soon.',
      'processing': 'We are processing your order. Thank you for your patience.',
      'shipped': 'Great news! Your order has been shipped and is on its way!',
      'delivered': 'Your order has been delivered. Thank you for shopping with us!',
      'cancelled': 'Your order has been cancelled. If you have any questions, please contact us.',
    };

    const statusEmojis: { [key: string]: string } = {
      'confirmed': '✓',
      'processing': '⚙️',
      'shipped': '🚚',
      'delivered': '🎉',
      'cancelled': '✕',
    };

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #1f2937; color: white; padding: 20px; border-radius: 8px; }
            .content { padding: 20px; background-color: #f9fafb; border-radius: 8px; margin-top: 20px; }
            .status { font-size: 24px; font-weight: bold; color: #1f2937; margin-top: 10px; }
            .order-details { background-color: white; padding: 15px; border-radius: 5px; margin-top: 15px; }
            .item { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
            .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 20px; }
            .total { font-weight: bold; font-size: 18px; color: #1f2937; padding: 15px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Hub of Frames</h1>
              <p>Order Status Update</p>
            </div>

            <div class="content">
              <h2>Hello ${userName},</h2>
              <p>${statusMessages[orderStatus] || 'Your order status has been updated.'}</p>
              
              <div class="status">
                ${statusEmojis[orderStatus]} ${orderStatus.charAt(0).toUpperCase() + orderStatus.slice(1)}
              </div>

              <div class="order-details">
                <h3>Order Details</h3>
                <p><strong>Order ID:</strong> ${orderDetails.orderId}</p>
                
                <h4>Items:</h4>
                ${orderDetails.items.map((item: any) => `
                  <div class="item">
                    <span>${item.name} x-- ${item.quantity}</span>
                    <span>$${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                `).join('')}
                
                <div class="total">
                  Total Amount: $${orderDetails.totalAmount.toFixed(2)}
                </div>
              </div>

              <p style="margin-top: 20px; color: #6b7280;">
                If you have any questions about your order, please don't hesitate to contact us.
              </p>
            </div>

            <div class="footer">
              <p>© 2024 Hub of Frames. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Configure nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Send email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);

    console.log(`Email sent successfully to ${to} - Status: ${orderStatus}`);

    return NextResponse.json({
      success: true,
      message: 'Email sent successfully',
    });
  } catch (error) {
    console.error('Error sending email:', error);
    
    // Return error but don't block order updates
    return NextResponse.json({
      success: true,
      message: 'Order processed',
      warning: 'Email could not be sent, but order was updated',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
