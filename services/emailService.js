const nodemailer = require('nodemailer');
require('dotenv').config();

const sendEmail = async (emailData) => {
    try {
        const { from, to, subject, html } = emailData;

        console.log(emailData);

        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_APP_KEY,
            },
        });
        
        const mailOptions = {
            from    : from,
            to      : to,
            subject : subject,
            html    : html, // or text: for plain text
        };

        const result = await transporter.sendMail(mailOptions);
        return { success: true, messageId: result.messageId };
    } catch (error) {
        console.error('Email error:', error);
        return { success: false, error: error.message };
    }
};

module.exports = { sendEmail };