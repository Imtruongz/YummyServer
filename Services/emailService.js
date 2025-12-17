import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});

// Cấu hình transporter cho Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASSWORD,
  },
});

/**
 * Gửi email xác minh (Development: log to console, Production: send actual email)
 */
export const sendVerificationEmail = async (email, verificationCode) => {
  try {
    const mailOptions = {
      from: process.env.GMAIL_USER || "noreply@yummy.com",
      to: email,
      subject: "🍽️ Verify Your Email - Yummy App",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #ff6b6b; padding: 20px; border-radius: 8px 8px 0 0; color: white; text-align: center;">
            <h1 style="margin: 0; font-size: 28px;">Yummy</h1>
            <p style="margin: 5px 0 0 0;">Food Sharing Community</p>
          </div>
          
          <div style="padding: 30px; background-color: #f8f9fa;">
            <h2 style="color: #333; margin-top: 0;">Welcome to Yummy! 👋</h2>
            <p style="color: #666; font-size: 16px; line-height: 1.5;">
              Thanks for signing up. Please verify your email address to complete your registration.
            </p>
            
            <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
              <p style="color: #999; font-size: 14px; margin: 0 0 10px 0;">Your verification code:</p>
              <div style="background-color: #ff6b6b; color: white; padding: 15px; border-radius: 6px; font-size: 32px; letter-spacing: 5px; font-weight: bold; font-family: monospace;">
                ${verificationCode}
              </div>
              <p style="color: #999; font-size: 12px; margin: 10px 0 0 0;">This code expires in 15 minutes</p>
            </div>
            
            <p style="color: #666; font-size: 14px; line-height: 1.5;">
              Enter this code in the verification screen within 15 minutes to complete your registration.
            </p>
            
            <p style="color: #999; font-size: 13px; margin-top: 30px; border-top: 1px solid #ddd; padding-top: 20px;">
              If you didn't create this account, please ignore this email.
            </p>
          </div>
          
          <div style="background-color: #f0f0f0; padding: 15px; text-align: center; border-radius: 0 0 8px 8px; color: #999; font-size: 12px;">
            <p style="margin: 0;">© ${new Date().getFullYear()} Yummy App. All rights reserved.</p>
          </div>
        </div>
      `,
    };

    // Production: Send actual email
    if (process.env.NODE_ENV === 'production') {
      await transporter.sendMail(mailOptions);
      console.log(`✅ Verification email sent to ${email}`);
    } else {
      // Development: Log to console instead
      console.log('📧 [DEV MODE] Email would be sent to:', email);
      console.log('📧 [DEV MODE] Verification Code:', verificationCode);
      console.log('📧 [DEV MODE] Full email content:', JSON.stringify(mailOptions, null, 2));
    }

    return true;
  } catch (error) {
    console.error("❌ Error sending verification email:", error);
    throw new Error("Failed to send verification email");
  }
};

/**
 * Gửi email chào mừng (sau khi xác minh thành công)
 */
export const sendWelcomeEmail = async (email, username) => {
  try {
    const mailOptions = {
      from: process.env.GMAIL_USER || "noreply@yummy.com",
      to: email,
      subject: "🎉 Welcome to Yummy - Let's Start Sharing!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #ff6b6b; padding: 20px; border-radius: 8px 8px 0 0; color: white; text-align: center;">
            <h1 style="margin: 0; font-size: 28px;">Yummy</h1>
            <p style="margin: 5px 0 0 0;">Food Sharing Community</p>
          </div>
          
          <div style="padding: 30px; background-color: #f8f9fa;">
            <h2 style="color: #333; margin-top: 0;">Welcome, ${username}! 🎉</h2>
            <p style="color: #666; font-size: 16px; line-height: 1.5;">
              Your email has been verified successfully! You can now enjoy all the features of Yummy.
            </p>
            
            <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #ff6b6b; margin-top: 0;">What you can do now:</h3>
              <ul style="color: #666; font-size: 14px; line-height: 1.8;">
                <li>Share your favorite food recipes</li>
                <li>Discover amazing dishes from other users</li>
                <li>Rate and review food</li>
                <li>Connect with food enthusiasts</li>
                <li>Get personalized recommendations</li>
              </ul>
            </div>
            
            <p style="color: #999; font-size: 13px; margin-top: 30px; border-top: 1px solid #ddd; padding-top: 20px;">
              Happy sharing! If you have any questions, feel free to contact us.
            </p>
          </div>
          
          <div style="background-color: #f0f0f0; padding: 15px; text-align: center; border-radius: 0 0 8px 8px; color: #999; font-size: 12px;">
            <p style="margin: 0;">© ${new Date().getFullYear()} Yummy App. All rights reserved.</p>
          </div>
        </div>
      `,
    };

    // Production: Send actual email
    if (process.env.NODE_ENV === 'production') {
      await transporter.sendMail(mailOptions);
      console.log(`✅ Welcome email sent to ${email}`);
    } else {
      // Development: Log to console
      console.log('📧 [DEV MODE] Welcome email would be sent to:', email);
      console.log('📧 [DEV MODE] Username:', username);
    }

    return true;
  } catch (error) {
    console.error("❌ Error sending welcome email:", error);
    throw new Error("Failed to send welcome email");
  }
};

/**
 * Test connection khi server start
 */
export const testEmailConnection = async () => {
  if (process.env.NODE_ENV === 'production') {
    try {
      await transporter.verify();
      console.log("✅ Email service connected successfullyy");
    } catch (error) {
      console.error("❌ Email service connection failed:", error);
    }
  } else {
    console.log("📧 [DEV MODE] Email service in development mode (using console logging)");
  }
};

