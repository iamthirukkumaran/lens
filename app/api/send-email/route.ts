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
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="color-scheme" content="light dark">
    <meta name="supported-color-schemes" content="light dark">
    <title>Hub of Frames • Order Update</title>
    <style>
        /* Reset & Base */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #374151;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }
        
        /* Container */
        .email-wrapper {
            max-width: 680px;
            margin: 0 auto;
            background: linear-gradient(to bottom, #ffffff, #fafafa);
            border-radius: 24px;
            overflow: hidden;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
            border: 1px solid rgba(255, 255, 255, 0.2);
            backdrop-filter: blur(10px);
        }
        
        /* Header */
        .email-header {
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
            color: white;
            padding: 40px 32px;
            text-align: center;
            position: relative;
            overflow: hidden;
        }
        
        .email-header::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
            opacity: 0.3;
        }
        
        .brand-logo {
            font-size: 32px;
            font-weight: 800;
            letter-spacing: -0.5px;
            margin-bottom: 8px;
            background: linear-gradient(to right, #60a5fa, #8b5cf6);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            display: inline-block;
        }
        
        .brand-tagline {
            font-size: 14px;
            opacity: 0.9;
            letter-spacing: 0.5px;
            text-transform: uppercase;
            margin-bottom: 16px;
            color: #cbd5e1;
        }
        
        /* Status Badge */
        .status-badge {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 12px 24px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 100px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            margin-top: 16px;
            animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.02); }
        }
        
        .status-icon {
            font-size: 20px;
        }
        
        .status-text {
            font-size: 18px;
            font-weight: 600;
            text-transform: capitalize;
        }
        
        /* Content */
        .email-content {
            padding: 48px 40px;
        }
        
        .greeting {
            font-size: 28px;
            font-weight: 700;
            color: #1e293b;
            margin-bottom: 20px;
            background: linear-gradient(to right, #3b82f6, #8b5cf6);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        
        .message-box {
            background: white;
            padding: 28px;
            border-radius: 16px;
            border-left: 4px solid #3b82f6;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
            margin: 24px 0;
            border: 1px solid #e5e7eb;
        }
        
        /* Order Details */
        .order-card {
            background: white;
            border-radius: 20px;
            padding: 32px;
            margin: 32px 0;
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.06);
            border: 1px solid #f1f5f9;
            position: relative;
            overflow: hidden;
        }
        
        .order-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(to right, #3b82f6, #8b5cf6, #ec4899);
        }
        
        .order-id {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: #f8fafc;
            padding: 8px 16px;
            border-radius: 10px;
            font-family: 'Courier New', monospace;
            font-size: 14px;
            color: #475569;
            border: 1px solid #e2e8f0;
        }
        
        /* Items Table */
        .items-table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0;
            margin: 24px 0;
        }
        
        .items-table th {
            text-align: left;
            padding: 16px;
            background: #f8fafc;
            font-weight: 600;
            color: #475569;
            border-bottom: 2px solid #e2e8f0;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .items-table td {
            padding: 20px 16px;
            border-bottom: 1px solid #f1f5f9;
            transition: all 0.2s ease;
        }
        
        .items-table tr:hover td {
            background: #f8fafc;
        }
        
        .item-name {
            font-weight: 500;
            color: #1e293b;
        }
        
        .item-quantity {
            color: #64748b;
            font-size: 14px;
        }
        
        .item-price {
            font-weight: 600;
            color: #3b82f6;
            text-align: right;
        }
        
        /* Total Section */
        .total-section {
            background: linear-gradient(to right, #f8fafc, #ffffff);
            padding: 24px;
            border-radius: 16px;
            margin-top: 32px;
            border: 1px solid #e2e8f0;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .total-label {
            font-size: 16px;
            color: #64748b;
        }
        
        .total-amount {
            font-size: 32px;
            font-weight: 800;
            color: #0f172a;
            letter-spacing: -0.5px;
        }
        
        /* Tracking */
        .tracking-steps {
            display: flex;
            justify-content: space-between;
            position: relative;
            margin: 40px 0;
            padding: 0 20px;
        }
        
        .tracking-steps::before {
            content: '';
            position: absolute;
            top: 15px;
            left: 20px;
            right: 20px;
            height: 2px;
            background: #e2e8f0;
            z-index: 1;
        }
        
        .step {
            display: flex;
            flex-direction: column;
            align-items: center;
            position: relative;
            z-index: 2;
            flex: 1;
        }
        
        .step-icon {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: white;
            border: 2px solid #e2e8f0;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 8px;
            font-size: 14px;
            color: #94a3b8;
            transition: all 0.3s ease;
        }
        
        .step.active .step-icon {
            background: #3b82f6;
            border-color: #3b82f6;
            color: white;
            box-shadow: 0 0 0 6px rgba(59, 130, 246, 0.1);
        }
        
        .step-label {
            font-size: 12px;
            color: #64748b;
            text-align: center;
            margin-top: 4px;
        }
        
        /* CTA */
        .cta-section {
            text-align: center;
            margin: 40px 0;
        }
        
        .cta-button {
            display: inline-flex;
            align-items: center;
            gap: 12px;
            background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
            color: white;
            padding: 18px 36px;
            border-radius: 12px;
            text-decoration: none;
            font-weight: 600;
            font-size: 16px;
            box-shadow: 0 10px 25px rgba(59, 130, 246, 0.3);
            transition: all 0.3s ease;
            border: none;
        }
        
        .cta-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 15px 35px rgba(59, 130, 246, 0.4);
        }
        
        /* Footer */
        .email-footer {
            background: linear-gradient(to bottom, #0f172a, #1e293b);
            color: #cbd5e1;
            padding: 40px 32px;
            text-align: center;
        }
        
        .social-links {
            display: flex;
            justify-content: center;
            gap: 20px;
            margin: 24px 0;
        }
        
        .social-icon {
            width: 40px;
            height: 40px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            text-decoration: none;
            color: white;
            transition: all 0.3s ease;
        }
        
        .social-icon:hover {
            background: rgba(255, 255, 255, 0.2);
            transform: translateY(-2px);
        }
        
        .copyright {
            font-size: 12px;
            color: #94a3b8;
            margin-top: 24px;
            padding-top: 24px;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        /* Responsive */
        @media (max-width: 640px) {
            .email-content {
                padding: 32px 20px;
            }
            
            .tracking-steps {
                flex-direction: column;
                gap: 24px;
            }
            
            .tracking-steps::before {
                display: none;
            }
            
            .step {
                flex-direction: row;
                justify-content: flex-start;
                gap: 16px;
                width: 100%;
            }
            
            .step-icon {
                margin-bottom: 0;
            }
            
            .items-table {
                display: block;
                overflow-x: auto;
            }
            
            .cta-button {
                width: 100%;
                justify-content: center;
            }
        }
        
        /* Dark Mode Support */
        @media (prefers-color-scheme: dark) {
            .email-wrapper {
                background: linear-gradient(to bottom, #1e293b, #0f172a);
                color: #cbd5e1;
            }
            
            .message-box, .order-card {
                background: #334155;
                border-color: #475569;
            }
            
            .order-card::before {
                background: linear-gradient(to right, #60a5fa, #a78bfa, #f472b6);
            }
            
            .items-table th {
                background: #475569;
                color: #e2e8f0;
            }
            
            .items-table td {
                background: #334155;
                border-color: #475569;
            }
            
            .item-name {
                color: #f1f5f9;
            }
            
            .total-section {
                background: linear-gradient(to right, #475569, #334155);
                border-color: #475569;
            }
        }
    </style>
</head>
<body>
    <div class="email-wrapper">
        <!-- Header -->
        <div class="email-header">
            <div class="brand-logo">Hub of Frames</div>
            <div class="brand-tagline">Where Vision Meets Perfection</div>
            <div class="status-badge">
                <span class="status-icon">${statusEmojis[orderStatus] || '📦'}</span>
                <span class="status-text">${orderStatus.charAt(0).toUpperCase() + orderStatus.slice(1)}</span>
            </div>
        </div>
        
        <!-- Content -->
        <div class="email-content">
            <h1 class="greeting">Hello ${userName},</h1>
            
            <div class="message-box">
                <p style="font-size: 18px; line-height: 1.8; color: #1e293b;">
                    ${statusMessages[orderStatus] || 'Your order status has been updated.'}
                </p>
                <p style="margin-top: 16px; color: #64748b;">
                    We're committed to providing you with the best shopping experience.
                </p>
            </div>
            
            <!-- Order Tracking -->
            <div class="tracking-steps">
                <div class="step ${orderStatus === 'confirmed' ? 'active' : ''}">
                    <div class="step-icon">✓</div>
                    <div class="step-label">Order Confirmed</div>
                </div>
                <div class="step ${orderStatus === 'processing' ? 'active' : ''}">
                    <div class="step-icon">🔄</div>
                    <div class="step-label">Processing</div>
                </div>
                <div class="step ${orderStatus === 'shipped' ? 'active' : ''}">
                    <div class="step-icon">🚚</div>
                    <div class="step-label">Shipped</div>
                </div>
                <div class="step ${orderStatus === 'delivered' ? 'active' : ''}">
                    <div class="step-icon">📬</div>
                    <div class="step-label">Delivered</div>
                </div>
            </div>
            
            <!-- Order Details -->
            <div class="order-card">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px;">
                    <h2 style="font-size: 24px; font-weight: 700; color: #1e293b;">Order Details</h2>
                    <span class="order-id">
                        <span style="opacity: 0.7;">#</span>${orderDetails.orderId}
                    </span>
                </div>
                
                <table class="items-table">
                    <thead>
                        <tr>
                            <th style="width: 45%;">Product</th>
                            <th style="width: 25%;">Quantity</th>
                            <th style="width: 30%; text-align: right;">Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${orderDetails.items.map((item: any) => `
                            <tr>
                                <td>
                                    <div class="item-name">${item.name}</div>
                                    <div style="font-size: 14px; color: #64748b;">${item.sku || 'Standard Item'}</div>
                                </td>
                                <td>
                                    <div class="item-quantity">${item.quantity} × $${item.price.toFixed(2)}</div>
                                </td>
                                <td class="item-price">$${(item.price * item.quantity).toFixed(2)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                
                <div class="total-section">
                    <div>
                        <div class="total-label">Total Amount</div>
                        <div style="font-size: 14px; color: #64748b; margin-top: 4px;">
                            ${orderDetails.items.length} item${orderDetails.items.length !== 1 ? 's' : ''}
                        </div>
                    </div>
                    <div class="total-amount">$${orderDetails.totalAmount.toFixed(2)}</div>
                </div>
            </div>
            
            <!-- Additional Info -->
            <div style="background: #f0f9ff; padding: 24px; border-radius: 16px; border: 1px solid #bae6fd; margin: 24px 0;">
                <div style="display: flex; gap: 16px; align-items: flex-start;">
                    <div style="font-size: 24px; color: #0369a1;">ℹ️</div>
                    <div>
                        <h3 style="font-size: 18px; font-weight: 600; color: #0369a1; margin-bottom: 8px;">
                            Important Information
                        </h3>
                        <p style="color: #0c4a6e; line-height: 1.6;">
                            Estimated delivery: <strong>3-5 business days</strong><br>
                            Shipping address: ${orderDetails.shippingAddress || 'As provided during checkout'}<br>
                            Payment method: ${orderDetails.paymentMethod || 'Credit/Debit Card'}
                        </p>
                    </div>
                </div>
            </div>
            
            <!-- CTA -->
            <div class="cta-section">
                <a href="https://hubofframes.com/orders/${orderDetails.orderId}" class="cta-button">
                    <span>Track Your Order</span>
                    <span>→</span>
                </a>
                <p style="margin-top: 16px; color: #64748b; font-size: 14px;">
                    Need help? <a href="mailto:support@hubofframes.com" style="color: #3b82f6; text-decoration: none;">Contact our support team</a>
                </p>
            </div>
        </div>
        
        <!-- Footer -->
        <div class="email-footer">
            <div style="font-size: 20px; font-weight: 600; margin-bottom: 8px; color: white;">Hub of Frames</div>
            <div style="font-size: 14px; color: #94a3b8; margin-bottom: 24px;">
                Premium Frames & Eyewear Solutions
            </div>
            
            <div class="social-links">
                <a href="https://facebook.com/hubofframes" class="social-icon">f</a>
                <a href="https://instagram.com/hubofframes" class="social-icon">ig</a>
                <a href="https://twitter.com/hubofframes" class="social-icon">𝕏</a>
                <a href="https://pinterest.com/hubofframes" class="social-icon">P</a>
            </div>
            
            <div style="font-size: 14px; color: #cbd5e1; margin: 20px 0;">
                123 Frame Street, Vision City, VC 10001<br>
                +1 (555) 123-4567 • hello@hubofframes.com
            </div>
            
            <div class="copyright">
                © ${new Date().getFullYear()} Hub of Frames. All rights reserved.<br>
                <a href="https://hubofframes.com/privacy" style="color: #94a3b8; text-decoration: none;">Privacy Policy</a> • 
                <a href="https://hubofframes.com/terms" style="color: #94a3b8; text-decoration: none;">Terms of Service</a>
            </div>
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
