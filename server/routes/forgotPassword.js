import User from '../models/User.js'; // Import the User model
import crypto from 'crypto'; // For generating the verification code
import sendEmail from '../utils/sendEmail.js'; // Import the reusable sendEmail function

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        // Validate the email field
        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'User with this email does not exist' });
        }

        // Generate a 6-digit verification code
        const verificationCode = crypto.randomInt(100000, 999999).toString();

        // Set the verification code and expiry date (e.g., 15 minutes from now)
        user.verificationCode = verificationCode;
        user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 minutes

        // Save the updated user
        await user.save();

        // Prepare the email content
        const subject = 'Password Reset Request - Kinbu Clearance System';
        const text = `Dear ${user.fullName},\n\n` +
                      `You have requested to reset your password. Please use the following verification code to reset your password:\n\n` +
                      `Verification Code: ${verificationCode}\n\n` +
                      `This code will expire in 15 minutes.\n\n` +
                      `If you did not request this, please ignore this email.\n\n` +
                      `Best regards,\nKinbu SHS`;

        // Send verification code via email
        await sendEmail(email, subject, text);

        // Respond with success
        res.status(200).json({ message: 'Verification code sent to email' });
    } catch (error) {
        console.error('Error handling forgot password:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export default forgotPassword;
