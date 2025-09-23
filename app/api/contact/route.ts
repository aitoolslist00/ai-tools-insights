import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

// Pure Static Generation for API route
export const dynamic = 'force-dynamic' // Contact form needs to be dynamic
export const runtime = 'nodejs'

interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}

// Email configuration for Gmail
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_USER || 'insightsaitools@gmail.com',
      pass: process.env.SMTP_PASS // App-specific password for Gmail
    }
  })
}

export async function POST(request: NextRequest) {
  try {
    const formData: ContactFormData = await request.json()
    const { name, email, subject, message } = formData

    // Validate form data
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    // Create transporter
    const transporter = createTransporter()

    // Email content for you (the recipient)
    const mailOptions = {
      from: `"AI Tools Insights Contact Form" <insightsaitools@gmail.com>`,
      to: 'insightsaitools@gmail.com',
      subject: `Contact Form: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="color: #333; text-align: center; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>
          
          <div style="margin: 20px 0;">
            <h3 style="color: #007bff; margin-bottom: 5px;">Contact Details:</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px; background-color: #f8f9fa; border: 1px solid #ddd; font-weight: bold;">Name:</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 8px; background-color: #f8f9fa; border: 1px solid #ddd; font-weight: bold;">Email:</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${email}</td>
              </tr>
              <tr>
                <td style="padding: 8px; background-color: #f8f9fa; border: 1px solid #ddd; font-weight: bold;">Subject:</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${subject}</td>
              </tr>
            </table>
          </div>

          <div style="margin: 20px 0;">
            <h3 style="color: #007bff; margin-bottom: 10px;">Message:</h3>
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; border-left: 4px solid #007bff;">
              ${message.replace(/\n/g, '<br>')}
            </div>
          </div>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #666; font-size: 12px;">
            <p>This message was sent from the AI Tools Insights contact form.</p>
            <p>Received on: ${new Date().toLocaleString()}</p>
          </div>
        </div>
      `,
      text: `
New Contact Form Submission

Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}

---
Sent from AI Tools Insights contact form
Received on: ${new Date().toLocaleString()}
      `
    }

    // Auto-reply email to the sender
    const autoReplyOptions = {
      from: `"AI Tools Insights" <insightsaitools@gmail.com>`,
      to: email,
      subject: `Thank you for contacting AI Tools Insights - We've received your message`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="color: #007bff; text-align: center; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
            Thank You for Contacting Us!
          </h2>
          
          <p style="font-size: 16px; line-height: 1.6; color: #333;">Hi ${name},</p>
          
          <p style="font-size: 16px; line-height: 1.6; color: #333;">
            Thank you for reaching out to <strong>AI Tools Insights</strong>! We've successfully received your message and wanted to confirm that it's now in our inbox.
          </p>

          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #28a745;">
            <h4 style="color: #28a745; margin-top: 0;">Your Message Summary:</h4>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Sent on:</strong> ${new Date().toLocaleString()}</p>
          </div>

          <p style="font-size: 16px; line-height: 1.6; color: #333;">
            <strong>What happens next?</strong>
          </p>
          <ul style="font-size: 16px; line-height: 1.6; color: #333;">
            <li>Our team will review your message within <strong>24 hours</strong></li>
            <li>We'll respond with helpful information or next steps</li>
            <li>For urgent matters, you can also email us directly at <a href="mailto:insightsaitools@gmail.com">insightsaitools@gmail.com</a></li>
          </ul>

          <p style="font-size: 16px; line-height: 1.6; color: #333;">
            While you wait, feel free to explore our <a href="https://www.aitoolsinsights.com" style="color: #007bff;">latest AI tools</a> and <a href="https://www.aitoolsinsights.com/blog" style="color: #007bff;">blog articles</a>.
          </p>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center;">
            <p style="color: #666; margin-bottom: 10px;">Best regards,<br><strong>The AI Tools Insights Team</strong></p>
            <div>
              <a href="https://www.aitoolsinsights.com" style="color: #007bff; text-decoration: none; margin: 0 10px;">🌐 Website</a>
              <a href="https://www.aitoolsinsights.com/blog" style="color: #007bff; text-decoration: none; margin: 0 10px;">📝 Blog</a>
              <a href="mailto:insightsaitools@gmail.com" style="color: #007bff; text-decoration: none; margin: 0 10px;">📧 Email</a>
            </div>
          </div>
        </div>
      `,
      text: `Hi ${name},

Thank you for reaching out to AI Tools Insights! We've successfully received your message and wanted to confirm that it's now in our inbox.

Your Message Summary:
Subject: ${subject}
Sent on: ${new Date().toLocaleString()}

What happens next?
- Our team will review your message within 24 hours
- We'll respond with helpful information or next steps
- For urgent matters, you can also email us directly at insightsaitools@gmail.com

While you wait, feel free to explore our latest AI tools and blog articles at https://www.aitoolsinsights.com

Best regards,
The AI Tools Insights Team
      `
    }

    // Send both emails
    await Promise.all([
      transporter.sendMail(mailOptions),
      transporter.sendMail(autoReplyOptions)
    ])

    // Log successful submission (for analytics)
    console.log(`Contact form submission received from ${email} at ${new Date().toISOString()}`)

    return NextResponse.json(
      { message: 'Message sent successfully!' },
      { status: 200 }
    )

  } catch (error) {
    console.error('Contact form error:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to send message. Please try again or email us directly at insightsaitools@gmail.com' 
      },
      { status: 500 }
    )
  }
}

// Handle GET requests (not allowed)
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  )
}