import User from '../models/User.js'; // Import the User model
import bcrypt from 'bcrypt'; // For password hashing

const resetPassword = async (req, res) => {
    try {
        const { email, verificationCode, newPassword } = req.body;

        // Validate required fields
        if (!email || !verificationCode || !newPassword) {
            return res.status(400).json({ error: 'Email, verification code, and new password are required' });
        }

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'User with this email does not exist' });
        }

        // Check if the verification code is correct and not expired
        if (user.verificationCode !== verificationCode || Date.now() > user.resetPasswordExpires) {
            return res.status(400).json({ error: 'Invalid or expired verification code' });
        }

        // Validate new password (optional, e.g., minimum length)
        if (newPassword.length < 8) {
            return res.status(400).json({ error: 'New password must be at least 8 characters long' });
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedNewPassword = await bcrypt.hash(newPassword, salt);

        // Update the user's password
        user.password = hashedNewPassword;
        user.verificationCode = undefined; // Clear the verification code
        user.resetPasswordExpires = undefined; // Clear the expiry date
        await user.save();

        // Respond with success
        res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export default resetPassword;
