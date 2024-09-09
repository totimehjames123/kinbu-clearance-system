import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'Gmail', // Replace with your email service provider if different
    auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
    },
});

/**
 * Sends an email using nodemailer.
 *
 * @param {string} to - Recipient email address.
 * @param {string} subject - Email subject.
 * @param {string} text - Email body text.
 * @returns {Promise} - A promise that resolves when the email is sent.
 */
const sendEmail = async (to, subject, text) => {
    // Check for missing recipient
    if (!to) {
        throw new Error('No recipient specified');
    }

    const mailOptions = {
        from: process.env.SMTP_USERNAME,
        to,
        subject,
        text,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${to}`);
    } catch (error) {
        console.error('Error sending email:', error);
        throw error; // Re-throw the error for further handling
    }
};

export default sendEmail;
