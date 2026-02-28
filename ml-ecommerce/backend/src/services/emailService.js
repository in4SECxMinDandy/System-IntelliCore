// ==========================================
// Email Service — IntelliCore Ecommerce
// ==========================================

const nodemailer = require('nodemailer');
const logger = require('../config/logger');

// Email configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Email templates
const templates = {
  welcome: (data) => ({
    subject: 'Welcome to IntelliCore! 🎉',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to IntelliCore</title>
      </head>
      <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #ea2a33; margin: 0; font-size: 32px;">IntelliCore</h1>
            <p style="color: #666; margin-top: 5px;">AI-Powered Shopping Experience</p>
          </div>
          
          <h2 style="color: #333;">Welcome, ${data.name || 'there'}! 👋</h2>
          
          <p>Thank you for joining IntelliCore! We're thrilled to have you as part of our community of smart shoppers.</p>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #333;">What you can do now:</h3>
            <ul style="margin: 0; padding-left: 20px;">
              <li>🛍️ Browse our curated product collection</li>
              <li>🤖 Get AI-powered personalized recommendations</li>
              <li>💬 Join our shopping community</li>
              <li>🎁 Earn loyalty points on every purchase</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${data.frontendUrl || 'https://intellicore.com'}" style="display: inline-block; background: linear-gradient(135deg, #ea2a33, #f97316); color: white; text-decoration: none; padding: 15px 30px; border-radius: 25px; font-weight: bold;">Start Shopping Now</a>
          </div>
          
          <p style="color: #666; font-size: 14px; text-align: center; margin-top: 30px;">
            If you have any questions, reply to this email or visit our <a href="${data.frontendUrl || 'https://intellicore.com'}/support" style="color: #ea2a33;">Help Center</a>.
          </p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          
          <p style="color: #999; font-size: 12px; text-align: center;">
            © ${new Date().getFullYear()} IntelliCore. All rights reserved.<br>
            This email was sent to ${data.email}
          </p>
        </div>
      </body>
      </html>
    `,
  }),

  orderConfirmation: (data) => ({
    subject: `Order Confirmed! #${data.orderNumber} 🎉`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Confirmation</title>
      </head>
      <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #ea2a33; margin: 0; font-size: 32px;">IntelliCore</h1>
            <p style="color: #666; margin-top: 5px;">Order Confirmation</p>
          </div>
          
          <div style="background-color: #d4edda; padding: 20px; border-radius: 10px; margin: 20px 0; text-align: center;">
            <h2 style="margin: 0; color: #155724;">✅ Order Confirmed!</h2>
            <p style="margin: 10px 0 0 0;">Order #${data.orderNumber}</p>
          </div>
          
          <h3 style="color: #333; border-bottom: 2px solid #eee; padding-bottom: 10px;">Order Details</h3>
          
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr style="background-color: #f8f9fa;">
              <th style="padding: 12px; text-align: left; border-bottom: 1px solid #ddd;">Item</th>
              <th style="padding: 12px; text-align: center; border-bottom: 1px solid #ddd;">Qty</th>
              <th style="padding: 12px; text-align: right; border-bottom: 1px solid #ddd;">Price</th>
            </tr>
            ${data.items.map(item => `
              <tr>
                <td style="padding: 12px; border-bottom: 1px solid #eee;">${item.name}</td>
                <td style="padding: 12px; text-align: center; border-bottom: 1px solid #eee;">${item.quantity}</td>
                <td style="padding: 12px; text-align: right; border-bottom: 1px solid #eee;">$${item.price.toFixed(2)}</td>
              </tr>
            `).join('')}
            <tr style="font-weight: bold;">
              <td colspan="2" style="padding: 12px; text-align: right;">Total:</td>
              <td style="padding: 12px; text-align: right; color: #ea2a33;">$${data.total.toFixed(2)}</td>
            </tr>
          </table>
          
          <h3 style="color: #333; border-bottom: 2px solid #eee; padding-bottom: 10px;">Shipping Address</h3>
          <p style="background-color: #f8f9fa; padding: 15px; border-radius: 8px;">
            ${data.shippingAddress?.fullName || ''}<br>
            ${data.shippingAddress?.street || ''}<br>
            ${data.shippingAddress?.city || ''}, ${data.shippingAddress?.state || ''} ${data.shippingAddress?.zipCode || ''}
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${data.frontendUrl || 'https://.com'}/ordersintellicore/${data.orderId}" style="display: inline-block; background: linear-gradient(135deg, #ea2a33, #f97316); color: white; text-decoration: none; padding: 15px 30px; border-radius: 25px; font-weight: bold;">Track Your Order</a>
          </div>
          
          <p style="color: #666; font-size: 14px; text-align: center;">
            Thank you for shopping with us!
          </p>
        </div>
      </body>
      </html>
    `,
  }),

  orderShipped: (data) => ({
    subject: `Your Order #${data.orderNumber} Has Been Shipped! 📦`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Order Shipped</title>
      </head>
      <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #ea2a33; margin: 0; font-size: 32px;">IntelliCore</h1>
            <p style="color: #666; margin-top: 5px;">Order Shipped</p>
          </div>
          
          <div style="background-color: #cce5ff; padding: 20px; border-radius: 10px; margin: 20px 0; text-align: center;">
            <h2 style="margin: 0; color: #004085;">📦 Your order is on its way!</h2>
          </div>
          
          <p>Great news! Your order has been shipped and is on its way to you.</p>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <p style="margin: 0 0 10px 0;"><strong>Tracking Number:</strong> ${data.trackingNumber || 'N/A'}</p>
            <p style="margin: 0;"><strong>Carrier:</strong> ${data.shippingCarrier || 'Standard Shipping'}</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${data.frontendUrl || 'https://intellicore.com'}/orders/${data.orderId}/tracking" style="display: inline-block; background: linear-gradient(135deg, #ea2a33, #f97316); color: white; text-decoration: none; padding: 15px 30px; border-radius: 25px; font-weight: bold;">Track Package</a>
          </div>
          
          <p style="color: #666; font-size: 14px;">
            Estimated delivery: ${data.estimatedDelivery || '3-5 business days'}
          </p>
        </div>
      </body>
      </html>
    `,
  }),

  passwordReset: (data) => ({
    subject: 'Reset Your IntelliCore Password 🔐',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Reset Password</title>
      </head>
      <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #ea2a33; margin: 0; font-size: 32px;">IntelliCore</h1>
          </div>
          
          <h2 style="color: #333;">Password Reset Request</h2>
          
          <p>We received a request to reset your IntelliCore password. Click the button below to create a new password:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${data.resetUrl}" style="display: inline-block; background: linear-gradient(135deg, #ea2a33, #f97316); color: white; text-decoration: none; padding: 15px 30px; border-radius: 25px; font-weight: bold;">Reset Password</a>
          </div>
          
          <div style="background-color: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #856404;"><strong>⚠️ Important:</strong></p>
            <ul style="margin: 10px 0 0 0; color: #856404;">
              <li>This link expires in 1 hour</li>
              <li>If you didn't request this, please ignore this email</li>
            </ul>
          </div>
          
          <p style="color: #666; font-size: 14px;">
            If the button doesn't work, copy and paste this link into your browser:<br>
            <a href="${data.resetUrl}" style="color: #ea2a33;">${data.resetUrl}</a>
          </p>
        </div>
      </body>
      </html>
    `,
  }),

  emailVerification: (data) => ({
    subject: 'Verify Your IntelliCore Email 📧',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Email Verification</title>
      </head>
      <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #ea2a33; margin: 0; font-size: 32px;">IntelliCore</h1>
          </div>
          
          <h2 style="color: #333;">Verify Your Email</h2>
          
          <p>Thank you for registering with IntelliCore! Please verify your email address by clicking the button below:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${data.verifyUrl}" style="display: inline-block; background: linear-gradient(135deg, #ea2a33, #f97316); color: white; text-decoration: none; padding: 15px 30px; border-radius: 25px; font-weight: bold;">Verify Email</a>
          </div>
          
          <p style="color: #666; font-size: 14px;">
            If the button doesn't work, copy and paste this link into your browser:<br>
            <a href="${data.verifyUrl}" style="color: #ea2a33;">${data.verifyUrl}</a>
          </p>
          
          <div style="background-color: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #856404;">This verification link expires in 24 hours.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),

  twoFactorCode: (data) => ({
    subject: 'Your IntelliCore 2FA Code 🔐',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>2FA Code</title>
      </head>
      <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #ea2a33; margin: 0; font-size: 32px;">IntelliCore</h1>
          </div>
          
          <h2 style="color: #333; text-align: center;">Your Verification Code</h2>
          
          <div style="background-color: #f8f9fa; padding: 30px; border-radius: 10px; margin: 30px 0; text-align: center;">
            <p style="margin: 0 0 15px 0; color: #666;">Enter this code to complete your login:</p>
            <p style="margin: 0; font-size: 36px; font-weight: bold; color: #ea2a33; letter-spacing: 8px;">${data.code}</p>
          </div>
          
          <div style="background-color: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #856404;">⚠️ This code expires in 5 minutes. If you didn't request this, please secure your account immediately.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),

  reviewReceived: (data) => ({
    subject: 'Thank You for Your Review! ⭐',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Review Received</title>
      </head>
      <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #ea2a33; margin: 0; font-size: 32px;">IntelliCore</h1>
          </div>
          
          <h2 style="color: #333; text-align: center;">Thank You for Your Review! 🌟</h2>
          
          <p style="text-align: center;">Your review for <strong>${data.productName}</strong> has been submitted successfully.</p>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0; text-align: center;">
            <p style="margin: 0; font-size: 24px; color: #ffc107;">
              ${'★'.repeat(data.rating)}${'☆'.repeat(5 - data.rating)}
            </p>
          </div>
          
          <p style="color: #666; font-size: 14px; text-align: center;">
            Your feedback helps other shoppers make better decisions!
          </p>
        </div>
      </body>
      </html>
    `,
  }),

  lowStock: (data) => ({
    subject: `⚠️ Low Stock Alert: ${data.productName}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Low Stock Alert</title>
      </head>
      <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #ea2a33; margin: 0; font-size: 32px;">IntelliCore</h1>
            <p style="color: #666; margin-top: 5px;">Inventory Alert</p>
          </div>
          
          <div style="background-color: #f8d7da; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <h2 style="margin: 0; color: #721c24;">⚠️ Low Stock Alert</h2>
          </div>
          
          <p>The following product is running low on stock:</p>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <p style="margin: 0;"><strong>Product:</strong> ${data.productName}</p>
            <p style="margin: 10px 0 0 0;"><strong>Current Stock:</strong> <span style="color: #dc3545; font-weight: bold;">${data.stockQuantity} units</span></p>
            <p style="margin: 10px 0 0 0;"><strong>SKU:</strong> ${data.sku || 'N/A'}</p>
          </div>
          
          <p>Please restock this item soon to avoid missed sales.</p>
        </div>
      </body>
      </html>
    `,
  }),
};

/**
 * Send email with template
 */
async function sendEmail(to, templateName, data) {
  const template = templates[templateName];
  
  if (!template) {
    throw new Error(`Email template '${templateName}' not found`);
  }

  const { subject, html } = template(data);

  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || '"IntelliCore" <noreply@intellicore.com>',
      to,
      subject,
      html,
    });

    logger.info(`Email sent: ${templateName} to ${to}, MessageID: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    logger.error(`Failed to send email: ${templateName} to ${to}`, error);
    throw error;
  }
}

// Export functions
module.exports = {
  sendEmail,
  // Helper functions for common sending scenarios
  sendWelcome: (email, data) => sendEmail(email, 'welcome', data),
  sendOrderConfirmation: (email, data) => sendEmail(email, 'orderConfirmation', data),
  sendOrderShipped: (email, data) => sendEmail(email, 'orderShipped', data),
  sendPasswordReset: (email, data) => sendEmail(email, 'passwordReset', data),
  sendEmailVerification: (email, data) => sendEmail(email, 'emailVerification', data),
  sendTwoFactorCode: (email, data) => sendEmail(email, 'twoFactorCode', data),
  sendReviewReceived: (email, data) => sendEmail(email, 'reviewReceived', data),
  sendLowStockAlert: (email, data) => sendEmail(email, 'lowStock', data),
};
