import { Router } from 'express';
import { Resend } from 'resend';
const router = Router();

router.post('/send', async (req, res) => {

    try {
    
        const { name, email, phone, message } = req.body;

        // Prevent using your own email as client email
        if (email === process.env.EMAIL_USER) {
            return res.status(400).json({
                success: false,
                error: 'Please use your personal email address, not our contact email.'
            });
        }

        // This now works perfectly because .env was loaded before this file was imported
        const resend = new Resend(process.env.RESEND_API_KEY);

        const generateAutoReplyTemplate = (data) => {
            return `<!DOCTYPE html>
                    <html>
                    <body>
                        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
                            <div style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 30px; text-align: center;">
                                <h1>Thank You, ${data.name}!</h1>
                            </div>
                            <div style="padding: 30px; background: #f9f9f9;">
                                <p>Hi <strong>${data.name}</strong>,</p>
                                <p>Thank you for contacting me through my portfolio website! I have received your message and will get back to you within 24 hours.</p>
                                <p><strong>Best regards,</strong><br>Md. Saddam Hossain</p>
                                <hr>
                                <p style="color: #666;">
                                    Email: ${process.env.EMAIL_USER}<br>
                                    Phone: 01676690930
                                </p>
                            </div>
                        </div>
                    </body>
                    </html>`;

        };
        const generateQueryEmailTemplate = (queryData) => {
            const currentDate = new Date().toLocaleString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });

            return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>New Website Query</title>
                <style>
                    /* Reset and Base Styles */
                    * {
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                    }
                    
                    body {
                        font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
                        line-height: 1.6;
                        color: #333;
                        background-color: #f5f7fa;
                        padding: 20px;
                    }
                    
                    /* Email Container */
                    .email-container {
                        max-width: 600px;
                        margin: 0 auto;
                        background: #ffffff;
                        border-radius: 12px;
                        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
                        overflow: hidden;
                    }
                    
                    /* Header Section */
                    .email-header {
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        padding: 40px 30px;
                        text-align: center;
                    }
                    
                    .email-header h1 {
                        font-size: 28px;
                        font-weight: 600;
                        margin-bottom: 8px;
                    }
                    
                    .email-header p {
                        font-size: 16px;
                        opacity: 0.9;
                        font-weight: 300;
                    }
                    
                    /* Content Section */
                    .email-content {
                        padding: 40px 30px;
                    }
                    
                    /* Timestamp */
                    .timestamp {
                        text-align: center;
                        color: #666;
                        font-size: 14px;
                        margin-bottom: 30px;
                        padding: 12px;
                        background: #f8f9fa;
                        border-radius: 8px;
                        border-left: 4px solid #667eea;
                    }
                    
                    .timestamp strong {
                        color: #333;
                    }
                    
                    /* Priority Badge */
                    .priority-badge {
                        display: inline-flex;
                        align-items: center;
                        background: #fff3cd;
                        color: #856404;
                        padding: 8px 16px;
                        border-radius: 20px;
                        font-size: 14px;
                        font-weight: 500;
                        margin-bottom: 30px;
                    }
                    
                    .priority-badge::before {
                        content: "●";
                        color: #ffc107;
                        margin-right: 8px;
                        font-size: 16px;
                    }
                    
                    /* Divider */
                    .divider {
                        height: 1px;
                        background: linear-gradient(90deg, transparent, #e0e0e0, transparent);
                        margin: 30px 0;
                    }
                    
                    /* Query Details */
                    .query-section h2 {
                        color: #2c3e50;
                        font-size: 20px;
                        margin-bottom: 20px;
                        font-weight: 600;
                    }
                    
                    .user-info {
                        background: #f8f9fa;
                        border-radius: 10px;
                        padding: 25px;
                        margin-bottom: 30px;
                    }
                    
                    .info-item {
                        display: flex;
                        align-items: flex-start;
                        margin-bottom: 15px;
                        padding-bottom: 15px;
                        border-bottom: 1px solid #e9ecef;
                    }
                    
                    .info-item:last-child {
                        margin-bottom: 0;
                        padding-bottom: 0;
                        border-bottom: none;
                    }
                    
                    .info-label {
                        font-weight: 600;
                        color: #495057;
                        min-width: 80px;
                        margin-right: 15px;
                    }
                    
                    .info-value {
                        color: #212529;
                        flex: 1;
                    }
                    
                    .user-name {
                        font-size: 22px;
                        color: #2c3e50;
                        font-weight: 600;
                    }
                    
                    .contact-info {
                        display: flex;
                        flex-direction: column;
                        gap: 8px;
                    }
                    
                    .contact-link {
                        color: #007bff;
                        text-decoration: none;
                        display: flex;
                        align-items: center;
                        transition: color 0.2s;
                    }
                    
                    .contact-link:hover {
                        color: #0056b3;
                    }
                    
                    .contact-link::before {
                        content: "•";
                        margin-right: 8px;
                        color: #6c757d;
                    }
                    
                    .message-content {
                        background: white;
                        border: 1px solid #e9ecef;
                        border-radius: 8px;
                        padding: 15px;
                        margin-top: 10px;
                        font-style: italic;
                        color: #495057;
                    }
                    
                    /* Quick Actions */
                    .quick-actions {
                        margin-top: 40px;
                    }
                    
                    .quick-actions h2 {
                        color: #2c3e50;
                        font-size: 20px;
                        margin-bottom: 20px;
                        font-weight: 600;
                    }
                    
                    .action-buttons {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 15px;
                    }
                    
                    .action-button {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        padding: 14px 20px;
                        background: #007bff;
                        color: white;
                        text-decoration: none;
                        border-radius: 8px;
                        font-weight: 500;
                        transition: all 0.3s ease;
                        text-align: center;
                    }
                    
                    .action-button:hover {
                        background: #0056b3;
                        transform: translateY(-2px);
                        box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
                    }
                    
                    .action-button.call {
                        background: #28a745;
                    }
                    
                    .action-button.call:hover {
                        background: #1e7e34;
                        box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
                    }
                    
                    /* Footer */
                    .email-footer {
                        background: #f8f9fa;
                        padding: 25px 30px;
                        text-align: center;
                        color: #6c757d;
                        font-size: 14px;
                        border-top: 1px solid #e9ecef;
                    }
                    
                    .email-footer p {
                        margin-bottom: 8px;
                    }
                    
                    /* Responsive Design */
                    @media (max-width: 600px) {
                        body {
                            padding: 10px;
                        }
                        
                        .email-header {
                            padding: 30px 20px;
                        }
                        
                        .email-header h1 {
                            font-size: 24px;
                        }
                        
                        .email-content {
                            padding: 30px 20px;
                        }
                        
                        .action-buttons {
                            grid-template-columns: 1fr;
                        }
                        
                        .info-item {
                            flex-direction: column;
                        }
                        
                        .info-label {
                            margin-bottom: 5px;
                            margin-right: 0;
                        }
                    }
                    
                    @media (max-width: 400px) {
                        .email-header h1 {
                            font-size: 22px;
                        }
                        
                        .email-content {
                            padding: 20px 15px;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="email-container">
                    <!-- Header -->
                    <div class="email-header">
                        <h1>New Website Query</h1>
                        <p>You have received a new contact form submission</p>
                    </div>
                    
                    <!-- Content -->
                    <div class="email-content">
                        <!-- Timestamp -->
                        <div class="timestamp">
                            Received on: <strong>Wednesday, November 26, 2025 at 02:39 PM</strong>
                        </div>
                        
                        <!-- Priority Badge -->
                        <div class="priority-badge">
                            Priority: Medium
                        </div>
                        
                        <!-- Divider -->
                        <div class="divider"></div>
                        
                        <!-- Query Details -->
                        <div class="query-section">
                            <h2>Contact Information</h2>
                            <div class="user-info">
                                <div class="info-item">
                                    <div class="info-label">Name:</div>
                                    <div class="info-value user-name">${queryData.name}</div>
                                </div>
                                
                                <div class="info-item">
                                    <div class="info-label">Contact:</div>
                                    <div class="info-value contact-info">
                                        <a href="mailto:${queryData.email}" class="contact-link">${queryData.email}</a>
                                        <a href="tel:${queryData.phone}" class="contact-link">${queryData.phone}</a>
                                    </div>
                                </div>
                                
                                <div class="info-item">
                                    <div class="info-label">Message:</div>
                                    <div class="info-value">
                                        <div class="message-content">${queryData.message}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Footer -->
                    <div class="email-footer">
                        <p>This email was automatically generated from your website contact form.</p>
                        <p>© 2025 Saddam Portfolio. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>`;
        }

        const { error: notifyError } = await resend.emails.send({
            from: `${name} <notify@resend.dev>`, // Change yourdomain.com to your actual domain or keep as-is
            to: process.env.EMAIL_USER,
            replyTo: email, // When you hit reply → goes to client
            subject: `New Message from ${name} (${email})`,
            html: generateQueryEmailTemplate({ name, email, phone, message }), // your beautiful template stays the same
        });

        if (notifyError) {
            console.error('Failed to send to you:', notifyError);
            return res.status(500).json({ success: false, error: 'Failed to send notification' });
        }

        // 2. Send auto-reply to the client
        await resend.emails.send({
            from: `Md. Saddam Hossain <${process.env.EMAIL_USER}>`, // Your name/email
            to: email,
            subject: 'Thank you for contacting me! I received your message',
            html: generateAutoReplyTemplate({ name }),
        });

        res.json({
            success: true,
            message: 'Message sent successfully! Auto-reply delivered.',
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;