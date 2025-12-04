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

    // Generate HTML email content with EMAIL-COMPATIBLE styling
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
          <title>Hub of Frames • Order Update</title>
          <!-- Inline CSS for email compatibility -->
          <style type="text/css">
              /* ===== RESET & BASE ===== */
              * {
                  margin: 0;
                  padding: 0;
              }
              
              body {
                  font-family: Arial, sans-serif;
                  line-height: 1.4;
                  color: #333333;
                  background-color: #f4f4f4;
                  margin: 0;
                  padding: 0;
                  -webkit-text-size-adjust: 100%;
                  -ms-text-size-adjust: 100%;
              }
              
              table {
                  border-collapse: collapse;
                  mso-table-lspace: 0pt;
                  mso-table-rspace: 0pt;
              }
              
              img {
                  border: 0;
                  height: auto;
                  line-height: 100%;
                  outline: none;
                  text-decoration: none;
                  -ms-interpolation-mode: bicubic;
              }
              
              a {
                  text-decoration: none;
              }
              
              /* ===== LAYOUT ===== */
              .email-wrapper {
                  width: 100%;
                  max-width: 600px;
                  margin: 0 auto;
                  background-color: #ffffff;
              }
              
              .email-container {
                  width: 100%;
                  max-width: 600px;
                  margin: 0 auto;
              }
              
              /* ===== HEADER ===== */
              .header {
                  background-color: #1a237e;
                  color: #ffffff;
                  padding: 30px 20px;
                  text-align: center;
              }
              
              .brand-logo {
                  font-size: 32px;
                  font-weight: bold;
                  color: #ffffff;
                  margin-bottom: 10px;
              }
              
              .brand-tagline {
                  font-size: 14px;
                  color: #bbdefb;
                  letter-spacing: 1px;
                  text-transform: uppercase;
                  margin-bottom: 5px;
              }
              
              .header-subtitle {
                  font-size: 16px;
                  color: #e3f2fd;
                  margin-top: 10px;
              }
              
              /* ===== CONTENT ===== */
              .content {
                  padding: 40px 30px;
              }
              
              .greeting {
                  font-size: 28px;
                  color: #1a237e;
                  margin-bottom: 20px;
                  line-height: 1.3;
              }
              
              .message-box {
                  background-color: #f8f9fa;
                  border-left: 4px solid #2196f3;
                  padding: 25px;
                  margin: 25px 0;
              }
              
              .message-text {
                  font-size: 16px;
                  line-height: 1.6;
                  color: #424242;
              }
              
              /* ===== ORDER CARD ===== */
              .order-card {
                  background-color: #ffffff;
                  border: 1px solid #e0e0e0;
                  border-radius: 8px;
                  padding: 30px;
                  margin: 30px 0;
                  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
              }
              
              .order-header {
                  border-bottom: 2px solid #f5f5f5;
                  padding-bottom: 20px;
                  margin-bottom: 25px;
              }
              
              .order-title {
                  font-size: 24px;
                  color: #1a237e;
                  margin-bottom: 10px;
              }
              
              .order-id {
                  background-color: #f5f5f5;
                  padding: 8px 16px;
                  border-radius: 4px;
                  font-family: monospace;
                  color: #666;
                  display: inline-block;
              }
              
              /* ===== ITEMS TABLE ===== */
              .items-table {
                  width: 100%;
                  border: 1px solid #e0e0e0;
                  margin: 20px 0;
              }
              
              .items-table th {
                  background-color: #f8f9fa;
                  color: #424242;
                  font-weight: bold;
                  text-align: left;
                  padding: 12px 15px;
                  border-bottom: 2px solid #e0e0e0;
              }
              
              .items-table td {
                  padding: 15px;
                  border-bottom: 1px solid #f0f0f0;
              }
              
              .item-name {
                  font-weight: bold;
                  color: #333;
              }
              
              .item-price {
                  color: #2196f3;
                  font-weight: bold;
                  text-align: right;
              }
              
              /* ===== TOTAL SECTION ===== */
              .total-section {
                  background-color: #1a237e;
                  padding: 25px;
                  margin-top: 25px;
                  border-radius: 8px;
              }
              
              .total-label {
                  color: #bbdefb;
                  font-size: 16px;
              }
              
              .total-amount {
                  color: #ffffff;
                  font-size: 32px;
                  font-weight: bold;
              }
              
              /* ===== TRACKING SECTION ===== */
              .tracking-section {
                  background-color: #e8f5e9;
                  border: 2px solid #4caf50;
                  padding: 20px;
                  margin: 20px 0;
                  border-radius: 8px;
              }
              
              .tracking-number {
                  background-color: #ffffff;
                  padding: 10px 15px;
                  border: 1px solid #4caf50;
                  border-radius: 4px;
                  font-family: monospace;
                  font-size: 16px;
                  color: #2e7d32;
                  display: inline-block;
                  margin-top: 10px;
              }
              
              /* ===== CTA BUTTONS ===== */
              .cta-button {
                  display: inline-block;
                  background-color: #2196f3;
                  color: #ffffff !important;
                  text-decoration: none;
                  padding: 15px 30px;
                  border-radius: 4px;
                  font-weight: bold;
                  text-align: center;
                  mso-padding-alt: 0;
              }
              
              .button-td {
                  background: #2196f3;
                  border-radius: 4px;
                  text-align: center;
              }
              
              .cta-button-secondary {
                  background-color: #ffffff;
                  color: #2196f3 !important;
                  border: 2px solid #2196f3;
              }
              
              /* ===== TIMELINE ===== */
              .timeline {
                  margin: 30px 0;
              }
              
              .timeline-item {
                  margin-bottom: 25px;
                  padding-left: 40px;
                  position: relative;
              }
              
              .timeline-dot {
                  position: absolute;
                  left: 0;
                  top: 0;
                  width: 30px;
                  height: 30px;
                  background-color: #2196f3;
                  border-radius: 50%;
                  color: #ffffff;
                  font-size: 14px;
                  text-align: center;
                  line-height: 30px;
              }
              
              /* ===== FOOTER ===== */
              .footer {
                  background-color: #0d1b2a;
                  color: #ffffff;
                  padding: 40px 30px;
                  text-align: center;
              }
              
              .footer-logo {
                  font-size: 24px;
                  font-weight: bold;
                  color: #ffffff;
                  margin-bottom: 10px;
              }
              
              .social-links {
                  margin: 20px 0;
              }
              
              .social-icon {
                  display: inline-block;
                  background-color: rgba(255,255,255,0.1);
                  width: 36px;
                  height: 36px;
                  line-height: 36px;
                  text-align: center;
                  border-radius: 50%;
                  margin: 0 5px;
                  color: #ffffff;
              }
              
              .copyright {
                  font-size: 12px;
                  color: #bbdefb;
                  margin-top: 20px;
                  padding-top: 20px;
                  border-top: 1px solid rgba(255,255,255,0.1);
              }
              
              /* ===== RESPONSIVE ===== */
              @media only screen and (max-width: 600px) {
                  .email-container {
                      width: 100% !important;
                  }
                  
                  .content {
                      padding: 20px !important;
                  }
                  
                  .order-card {
                      padding: 20px !important;
                  }
                  
                  .items-table {
                      display: block;
                      overflow-x: auto;
                  }
                  
                  .cta-button {
                      display: block !important;
                      width: 100% !important;
                  }
              }
              
              /* ===== OUTLOOK FIXES ===== */
              /* Outlook-specific fixes */
              .ExternalClass {
                  width: 100%;
              }
              
              .ExternalClass,
              .ExternalClass p,
              .ExternalClass span,
              .ExternalClass font,
              .ExternalClass td,
              .ExternalClass div {
                  line-height: 100%;
              }
              
              /* Force Outlook to provide a "view in browser" message */
              #outlook a {
                  padding: 0;
              }
              
              /* Hotmail & Yahoo! fixes */
              .ReadMsgBody {
                  width: 100%;
              }
              
              .yshortcuts {
                  color: #ffffff;
                  text-decoration: none;
              }
              
              /* iOS blue links fix */
              a[x-apple-data-detectors] {
                  color: inherit !important;
                  text-decoration: none !important;
                  font-size: inherit !important;
                  font-family: inherit !important;
                  font-weight: inherit !important;
                  line-height: inherit !important;
              }
              
              /* Gmail fixes */
              u + #body a {
                  color: inherit;
                  text-decoration: none;
                  font-size: inherit;
                  font-family: inherit;
                  font-weight: inherit;
                  line-height: inherit;
              }
          </style>
      </head>
      <body style="margin:0; padding:0; background-color:#f4f4f4;">
          <!--[if mso]>
          <div style="background-color:#f4f4f4;">
          <![endif]-->
          
          <div class="email-wrapper">
              <!-- HEADER -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" class="header">
                  <tr>
                      <td align="center">
                          <table width="600" cellpadding="0" cellspacing="0" border="0" class="email-container">
                              <tr>
                                  <td style="padding:30px 20px; text-align:center;">
                                      <div class="brand-logo" style="font-size:32px; font-weight:bold; color:#ffffff; margin-bottom:10px;">
                                          Hub of Frames
                                      </div>
                                      <div class="brand-tagline" style="font-size:14px; color:#bbdefb; letter-spacing:1px; text-transform:uppercase;">
                                          VISION PERFECTED
                                      </div>
                                      <div class="header-subtitle" style="font-size:16px; color:#e3f2fd; margin-top:10px;">
                                          Order Status Update
                                      </div>
                                  </td>
                              </tr>
                          </table>
                      </td>
                  </tr>
              </table>
              
              <!-- CONTENT -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                      <td align="center">
                          <table width="600" cellpadding="0" cellspacing="0" border="0" class="email-container">
                              <tr>
                                  <td class="content" style="padding:40px 30px;">
                                      <!-- Greeting -->
                                      <h1 class="greeting" style="font-size:28px; color:#1a237e; margin-bottom:20px;">
                                          Hello ${userName},
                                      </h1>
                                      
                                      <!-- Message -->
                                      <div class="message-box" style="background-color:#f8f9fa; border-left:4px solid #2196f3; padding:25px; margin:25px 0;">
                                          <p class="message-text" style="font-size:16px; line-height:1.6; color:#424242;">
                                              ${message}
                                          </p>
                                      </div>
                                      
                                      <!-- Timeline -->
                                      <div class="timeline" style="margin:30px 0;">
                                          <div class="timeline-item" style="margin-bottom:25px; padding-left:40px; position:relative;">
                                              <div class="timeline-dot" style="position:absolute; left:0; top:0; width:30px; height:30px; background-color:#2196f3; border-radius:50%; color:#ffffff; font-size:14px; text-align:center; line-height:30px;">
                                                  ✓
                                              </div>
                                              <div>
                                                  <h3 style="font-size:18px; color:#1a237e; margin-bottom:5px;">Order Confirmed</h3>
                                                  <p style="color:#666; font-size:14px;">Your order has been confirmed and is being processed</p>
                                              </div>
                                          </div>
                                          
                                          <div class="timeline-item" style="margin-bottom:25px; padding-left:40px; position:relative;">
                                              <div class="timeline-dot" style="position:absolute; left:0; top:0; width:30px; height:30px; background-color:#2196f3; border-radius:50%; color:#ffffff; font-size:14px; text-align:center; line-height:30px;">
                                                  🔄
                                              </div>
                                              <div>
                                                  <h3 style="font-size:18px; color:#1a237e; margin-bottom:5px;">In Production</h3>
                                                  <p style="color:#666; font-size:14px;">Crafting your premium frames with precision</p>
                                              </div>
                                          </div>
                                          
                                          <div class="timeline-item" style="margin-bottom:25px; padding-left:40px; position:relative;">
                                              <div class="timeline-dot" style="position:absolute; left:0; top:0; width:30px; height:30px; background-color:#2196f3; border-radius:50%; color:#ffffff; font-size:14px; text-align:center; line-height:30px;">
                                                  🚚
                                              </div>
                                              <div>
                                                  <h3 style="font-size:18px; color:#1a237e; margin-bottom:5px;">Shipped</h3>
                                                  <p style="color:#666; font-size:14px;">Your order is on its way to you</p>
                                              </div>
                                          </div>
                                      </div>
                                      
                                      <!-- Order Card -->
                                      <div class="order-card" style="background-color:#ffffff; border:1px solid #e0e0e0; border-radius:8px; padding:30px; margin:30px 0; box-shadow:0 2px 4px rgba(0,0,0,0.1);">
                                          <div class="order-header" style="border-bottom:2px solid #f5f5f5; padding-bottom:20px; margin-bottom:25px;">
                                              <div style="display:flex; justify-content:space-between; align-items:center;">
                                                  <h2 class="order-title" style="font-size:24px; color:#1a237e; margin:0;">Order Details</h2>
                                                  <div class="order-id" style="background-color:#f5f5f5; padding:8px 16px; border-radius:4px; font-family:monospace; color:#666;">
                                                      #${orderDetails.orderId}
                                                  </div>
                                              </div>
                                          </div>
                                          
                                          <!-- Items Table -->
                                          <table class="items-table" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #e0e0e0; margin:20px 0;">
                                              <thead>
                                                  <tr>
                                                      <th style="background-color:#f8f9fa; color:#424242; font-weight:bold; text-align:left; padding:12px 15px; border-bottom:2px solid #e0e0e0;">
                                                          Product
                                                      </th>
                                                      <th style="background-color:#f8f9fa; color:#424242; font-weight:bold; text-align:center; padding:12px 15px; border-bottom:2px solid #e0e0e0;">
                                                          Quantity
                                                      </th>
                                                      <th style="background-color:#f8f9fa; color:#424242; font-weight:bold; text-align:right; padding:12px 15px; border-bottom:2px solid #e0e0e0;">
                                                          Price
                                                      </th>
                                                  </tr>
                                              </thead>
                                              <tbody>
                                                  ${orderDetails.items && orderDetails.items.length > 0 ? orderDetails.items.map((item: any) => {
                                                      const itemName = item.name || 'Product';
                                                      const itemQty = item.quantity || 1;
                                                      const itemPrice = item.price || 0;
                                                      const itemTotal = (itemPrice * itemQty).toFixed(2);
                                                      return `
                                                          <tr>
                                                              <td style="padding:15px; border-bottom:1px solid #f0f0f0;">
                                                                  <div style="display:flex; align-items:center; gap:15px;">
                                                                      <div style="width:50px; height:50px; background-color:#e3f2fd; border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:20px;">
                                                                          👓
                                                                      </div>
                                                                      <div>
                                                                          <div class="item-name" style="font-weight:bold; color:#333;">${itemName}</div>
                                                                          <div style="color:#666; font-size:14px;">Premium Frame Collection</div>
                                                                      </div>
                                                                  </div>
                                                              </td>
                                                              <td style="padding:15px; border-bottom:1px solid #f0f0f0; text-align:center; color:#666;">
                                                                  ${itemQty}
                                                              </td>
                                                              <td style="padding:15px; border-bottom:1px solid #f0f0f0; text-align:right;">
                                                                  <span class="item-price" style="color:#2196f3; font-weight:bold;">$${itemTotal}</span>
                                                              </td>
                                                          </tr>
                                                      `;
                                                  }).join('') : ''}
                                              </tbody>
                                          </table>
                                          
                                          <!-- Total -->
                                          <div class="total-section" style="background-color:#1a237e; padding:25px; margin-top:25px; border-radius:8px;">
                                              <div style="display:flex; justify-content:space-between; align-items:center;">
                                                  <div>
                                                      <div class="total-label" style="color:#bbdefb; font-size:16px;">Total Amount</div>
                                                      <div style="color:#90caf9; font-size:14px; margin-top:5px;">
                                                          ${orderDetails.items ? orderDetails.items.length : 0} item${orderDetails.items && orderDetails.items.length !== 1 ? 's' : ''}
                                                      </div>
                                                  </div>
                                                  <div class="total-amount" style="color:#ffffff; font-size:32px; font-weight:bold;">
                                                      $${orderDetails.totalAmount.toFixed(2)}
                                                  </div>
                                              </div>
                                          </div>
                                          
                                          <!-- Tracking -->
                                          ${orderDetails.trackingNumber ? `
                                              <div class="tracking-section" style="background-color:#e8f5e9; border:2px solid #4caf50; padding:20px; margin:20px 0; border-radius:8px;">
                                                  <div style="display:flex; align-items:center; gap:15px; margin-bottom:15px;">
                                                      <div style="width:40px; height:40px; background-color:#4caf50; border-radius:8px; display:flex; align-items:center; justify-content:center; color:#ffffff; font-size:18px;">
                                                          📦
                                                      </div>
                                                      <div>
                                                          <h3 style="color:#2e7d32; font-size:18px; margin:0;">Track Your Order</h3>
                                                          <p style="color:#4caf50; font-size:14px; margin:5px 0 0 0;">Real-time tracking available</p>
                                                      </div>
                                                  </div>
                                                  <div class="tracking-number" style="background-color:#ffffff; padding:10px 15px; border:1px solid #4caf50; border-radius:4px; font-family:monospace; font-size:16px; color:#2e7d32; display:inline-block;">
                                                      ${orderDetails.trackingNumber}
                                                  </div>
                                                  <p style="color:#2e7d32; margin-top:15px; font-size:14px;">
                                                      Use this tracking number to monitor your delivery status
                                                  </p>
                                              </div>
                                          ` : ''}
                                      </div>
                                      
                                      <!-- CTA Buttons -->
                                      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:30px 0;">
                                          <tr>
                                              <td align="center">
                                                  <table cellpadding="0" cellspacing="0" border="0">
                                                      <tr>
                                                          <td align="center" style="padding:10px;">
                                                              <a href="https://hubofframes.com/track/${orderDetails.orderId}" class="cta-button" style="display:inline-block; background-color:#2196f3; color:#ffffff; text-decoration:none; padding:15px 30px; border-radius:4px; font-weight:bold; text-align:center;">
                                                                  Track Your Order →
                                                              </a>
                                                          </td>
                                                          <td align="center" style="padding:10px;">
                                                              <a href="https://hubofframes.com/account/orders" class="cta-button cta-button-secondary" style="display:inline-block; background-color:#ffffff; color:#2196f3; text-decoration:none; padding:15px 30px; border-radius:4px; font-weight:bold; text-align:center; border:2px solid #2196f3;">
                                                                  View All Orders
                                                              </a>
                                                          </td>
                                                      </tr>
                                                  </table>
                                              </td>
                                          </tr>
                                      </table>
                                      
                                      <!-- Support Message -->
                                      <div style="text-align:center; background-color:#f8f9fa; padding:25px; border-radius:8px; margin-top:30px;">
                                          <p style="font-size:16px; color:#666; line-height:1.6; margin:0;">
                                              Need assistance? Our customer support team is available 24/7 to help you with any questions about your order.
                                          </p>
                                      </div>
                                  </td>
                              </tr>
                          </table>
                      </td>
                  </tr>
              </table>
              
              <!-- FOOTER -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" class="footer">
                  <tr>
                      <td align="center">
                          <table width="600" cellpadding="0" cellspacing="0" border="0" class="email-container">
                              <tr>
                                  <td style="padding:40px 30px; text-align:center;">
                                      <div class="footer-logo" style="font-size:24px; font-weight:bold; color:#ffffff; margin-bottom:10px;">
                                          Hub of Frames
                                      </div>
                                      <div style="color:#90caf9; font-size:14px; margin-bottom:30px;">
                                          Premium Frames & Eyewear Solutions
                                      </div>
                                      
                                      <!-- Contact Info -->
                                      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:30px 0; border-top:1px solid rgba(255,255,255,0.1); border-bottom:1px solid rgba(255,255,255,0.1);">
                                          <tr>
                                              <td align="center" style="padding:20px;">
                                                  <div class="social-icon" style="display:inline-block; background-color:rgba(255,255,255,0.1); width:40px; height:40px; line-height:40px; text-align:center; border-radius:50%; margin:0 10px; color:#ffffff;">
                                                      📍
                                                  </div>
                                                  <div style="color:#90caf9; font-size:12px; margin-top:10px;">Address</div>
                                                  <div style="color:#ffffff; font-size:14px; margin-top:5px;">123 Vision Street</div>
                                              </td>
                                              <td align="center" style="padding:20px;">
                                                  <div class="social-icon" style="display:inline-block; background-color:rgba(255,255,255,0.1); width:40px; height:40px; line-height:40px; text-align:center; border-radius:50%; margin:0 10px; color:#ffffff;">
                                                      📞
                                                  </div>
                                                  <div style="color:#90caf9; font-size:12px; margin-top:10px;">Phone</div>
                                                  <div style="color:#ffffff; font-size:14px; margin-top:5px;">+1 (555) 123-4567</div>
                                              </td>
                                              <td align="center" style="padding:20px;">
                                                  <div class="social-icon" style="display:inline-block; background-color:rgba(255,255,255,0.1); width:40px; height:40px; line-height:40px; text-align:center; border-radius:50%; margin:0 10px; color:#ffffff;">
                                                      ✉️
                                                  </div>
                                                  <div style="color:#90caf9; font-size:12px; margin-top:10px;">Email</div>
                                                  <div style="color:#ffffff; font-size:14px; margin-top:5px;">support@hubofframes.com</div>
                                              </td>
                                          </tr>
                                      </table>
                                      
                                      <!-- Social Links -->
                                      <div class="social-links" style="margin:30px 0;">
                                          <a href="https://facebook.com/hubofframes" style="display:inline-block; background-color:rgba(255,255,255,0.1); width:36px; height:36px; line-height:36px; text-align:center; border-radius:50%; margin:0 5px; color:#ffffff;">
                                              f
                                          </a>
                                          <a href="https://instagram.com/hubofframes" style="display:inline-block; background-color:rgba(255,255,255,0.1); width:36px; height:36px; line-height:36px; text-align:center; border-radius:50%; margin:0 5px; color:#ffffff;">
                                              ig
                                          </a>
                                          <a href="https://twitter.com/hubofframes" style="display:inline-block; background-color:rgba(255,255,255,0.1); width:36px; height:36px; line-height:36px; text-align:center; border-radius:50%; margin:0 5px; color:#ffffff;">
                                              𝕏
                                          </a>
                                      </div>
                                      
                                      <!-- Copyright -->
                                      <div class="copyright" style="font-size:12px; color:#90caf9; margin-top:30px; padding-top:30px; border-top:1px solid rgba(255,255,255,0.1);">
                                          © ${new Date().getFullYear()} Hub of Frames. All rights reserved.<br>
                                          <a href="https://hubofframes.com/privacy" style="color:#90caf9;">Privacy Policy</a> • 
                                          <a href="https://hubofframes.com/terms" style="color:#90caf9;">Terms of Service</a> • 
                                          <a href="https://hubofframes.com/unsubscribe" style="color:#90caf9;">Unsubscribe</a>
                                      </div>
                                  </td>
                              </tr>
                          </table>
                      </td>
                  </tr>
              </table>
          </div>
          
          <!--[if mso]>
          </div>
          <![endif]-->
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
      from: `"Hub of Frames" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: htmlContent,
      // Text fallback for non-HTML email clients
      text: `
Hub of Frames - Order Update

Hello ${userName},

${message}

Order Details:
Order ID: ${orderDetails.orderId}

Items:
${orderDetails.items && orderDetails.items.length > 0 ? orderDetails.items.map((item: any) => 
  `- ${item.name || 'Product'} x ${item.quantity || 1}: $${((item.price || 0) * (item.quantity || 1)).toFixed(2)}`
).join('\n') : ''}

Total Amount: $${orderDetails.totalAmount.toFixed(2)}

${orderDetails.trackingNumber ? `Tracking Number: ${orderDetails.trackingNumber}` : ''}

Need assistance? Contact us at support@hubofframes.com

© ${new Date().getFullYear()} Hub of Frames. All rights reserved.
      `.trim(),
    };

    await transporter.sendMail(mailOptions);

    console.log(`Email sent successfully to ${to} - Subject: ${subject}`);

    return NextResponse.json({
      success: true,
      message: 'Email sent successfully',
    });
  } catch (error) {
    console.error('Error sending email:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to send email',
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}