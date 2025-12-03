import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { to, subject, orderDetails, userName, message } = body;

    if (!to || !subject) {
      return NextResponse.json(
        { success: false, error: 'Email and subject are required' },
        { status: 400 }
      );
    }

    // Generate HTML email content
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #1f2937; color: white; padding: 20px; border-radius: 8px; }
            .content { padding: 20px; background-color: #f9fafb; border-radius: 8px; margin-top: 20px; }
            .message { font-size: 16px; color: #374151; line-height: 1.6; }
            .order-details { background-color: white; padding: 15px; border-radius: 5px; margin-top: 15px; }
            .item { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
            .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 20px; }
            .total { font-weight: bold; font-size: 18px; color: #1f2937; padding: 15px 0; }
            .tracking { background-color: #f0fdf4; padding: 10px; border-radius: 5px; margin-top: 10px; border-left: 4px solid #22c55e; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Hub of Frames</h1>
              <p>Order Update</p>
            </div>

            <div class="content">
              <h2>Hello ${userName},</h2>
              <p class="message">${message}</p>
              
              <div class="order-details">
                <h3>Order Details</h3>
                <p><strong>Order ID:</strong> ${orderDetails.orderId}</p>
                
                ${orderDetails.items && orderDetails.items.length > 0 ? `
                  <h4>Items:</h4>
                  ${orderDetails.items.map((item: any) => {
                    const itemName = item.name || 'Product';
                    const itemQty = item.quantity || 1;
                    const itemPrice = item.price || 0;
                    const itemTotal = (itemPrice * itemQty).toFixed(2);
                    return `
                      <div class="item">
                        <span>${itemName} x ${itemQty}</span>
                        <span>$${itemTotal}</span>
                      </div>
                    `;
                  }).join('')}
                ` : ''}
                
                <div class="total">
                  Total Amount: $${orderDetails.totalAmount.toFixed(2)}
                </div>

                ${orderDetails.trackingNumber ? `
                  <div class="tracking">
                    <strong>Tracking Number:</strong> ${orderDetails.trackingNumber}
                  </div>
                ` : ''}
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

    console.log(`Email sent successfully to ${to} - Subject: ${subject}`);

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
