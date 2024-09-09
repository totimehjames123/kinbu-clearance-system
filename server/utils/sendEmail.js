import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Create nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'Gmail', // Ensure this is the correct service provider
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
 * @returns {Promise<void>} - A promise that resolves when the email is sent.
 */
const sendEmail = async (to, subject, text) => {
    // Validate input
    if (!to) {
        throw new Error('No recipient specified');
    }
    if (!subject) {
        throw new Error('No subject specified');
    }
    if (!text) {
        throw new Error('No text specified');
    }

    const mailOptions = {
        from: process.env.SMTP_USERNAME, // Sender email address
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
